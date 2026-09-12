#!/usr/bin/env node
/** Guards against malformed arbitrary-value utilities, e.g. text-[#43soon]. */
import { readdirSync, readFileSync, statSync } from "node:fs";
import path from "node:path";

const root = path.resolve(import.meta.dirname, "..", "src");
const bad = [];
const colourArb = /\[(?:bg|text|border|from|via|to|ring|shadow|fill|stroke|decoration|caret|outline)?-?[#/]?(#[0-9a-zA-Z]+)\]/g;
const anyHashInClass = /className=\{?["'`][^"'`]*#([0-9a-zA-Z]+)(?![0-9a-zA-Z])/g;
const ok = (h) => [3, 4, 6, 8].includes(h.length) && /^[0-9a-fA-F]+$/.test(h);

const walk = (d) => {
  for (const f of readdirSync(d)) {
    const p = path.join(d, f);
    if (statSync(p).isDirectory()) walk(p);
    else if (/\.(tsx|ts)$/.test(f)) {
      readFileSync(p, "utf8")
        .split("\n")
        .forEach((line, i) => {
          for (const re of [colourArb, anyHashInClass]) {
            re.lastIndex = 0;
            let m;
            while ((m = re.exec(line))) {
              const hex = m[1].replace(/^#/, "");
              if (!ok(hex)) bad.push(`${path.relative(root, p)}:${i + 1}  bad hex "#${hex}"  ::  ${line.trim().slice(0, 96)}`);
            }
          }
          if (/\b(?:text|bg|border|from|to|via|shadow|ring)-\[#/.test(line)) {
            for (const m of line.matchAll(/(?:text|bg|border|from|to|via|shadow|ring)-\[#([^\]]+)\]/g)) {
              const v = m[1];
              if (/^[0-9a-fA-F]{3,8}$/.test(v) === false && /^\d/.test(v)) {
                bad.push(`${path.relative(root, p)}:${i + 1}  malformed arbitrary value [#${v}]  ::  ${line.trim().slice(0, 96)}`);
              }
            }
          }
        });
    }
  }
};
walk(root);
if (bad.length) {
  console.log("SUSPECT TOKENS:\n" + [...new Set(bad)].join("\n"));
  process.exitCode = 1;
} else console.log("class-value scan clean");
