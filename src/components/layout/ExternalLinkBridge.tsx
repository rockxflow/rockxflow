"use client";

import { useEffect } from "react";

/**
 * Makes every external link open on a plain click, in any container.
 *
 * Root cause this works around: the social icons are real anchors
 * (`<a href target="_blank" rel="noopener noreferrer">`), and a browser that is
 * refusing new windows — a sandboxed iframe/preview without `allow-popups`, an
 * in-app webview, a popup blocker — swallows that navigation silently. The click
 * looks dead, and the only gesture still available is dragging the link out, which
 * is exactly what "you have to drag the icon" meant.
 *
 * The fix is behaviour, not styling: on a plain left click we perform the same
 * navigation ourselves — new tab first, then the top frame if the page is embedded
 * and allowed to break out, and if neither is permitted we leave the anchor's own
 * default action alone. Middle-click, cmd/ctrl-click and no-JS keep the browser's
 * native link behaviour because we never touch those events, so href, target and rel
 * stay exactly as they are in the markup.
 */
export function ExternalLinkBridge() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      // only a plain left click on a left-button press; let the browser handle
      // cmd/ctrl (new tab in background), shift (new window) and middle clicks
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.<HTMLAnchorElement>('a[target="_blank"]');
      if (!anchor) return;
      const href = anchor.href;
      if (!/^https?:/i.test(href)) return; // mailto:, tel:, javascript-free sites stay untouched

      // Ask for the tab ourselves. `noopener` as a *feature string* would make
      // window.open return null even on success, so we could not tell handled from
      // blocked and the anchor would open a second tab — instead we open plainly and
      // sever the reference immediately, which is what rel="noopener" guarantees.
      let opened: Window | null = null;
      try {
        opened = window.open(href, "_blank");
      } catch {
        opened = null;
      }
      if (opened) {
        try {
          opened.opener = null;
        } catch {
          /* cross-origin window: already unreachable from here */
        }
        e.preventDefault(); // handled — the anchor must not open another tab
        return;
      }

      // No new tab available (popup blocker, or an embed without allow-popups).
      // Break out of the frame if we may, otherwise navigate this one: a click that
      // silently does nothing is the bug being fixed.
      e.preventDefault();
      const escape = () => {
        try {
          window.location.href = href;
        } catch {
          /* nothing more we can do; the anchor's href is still there for a retry */
        }
      };
      if (window.top === window.self) {
        escape(); // not embedded — same-tab navigation is the honest fallback
        return;
      }
      let topAttempted = false;
      let topWas = "";
      try {
        topWas = window.top!.location.href; // throws when the host is cross-origin
        window.top!.location.href = href;
        topAttempted = true;
      } catch {
        topAttempted = false; // cross-origin top frame, no navigation rights
      }
      if (!topAttempted) {
        escape();
        return;
      }
      // A sandbox may refuse top navigation *silently*: no exception to catch. If this
      // frame is still running a moment later, the host never moved, so take the
      // destination here instead of leaving the click dead. A navigation that did commit
      // unloads this script first, so the timer never fires in the success case.
      window.setTimeout(() => {
        try {
          if (window.top && window.top.location.href !== topWas) return; // the host moved: done
        } catch {
          return; // top frame went unreadable = it navigated away from us
        }
        escape();
      }, 500);
    };

    document.addEventListener("click", onClick, { capture: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, []);

  return null;
}
