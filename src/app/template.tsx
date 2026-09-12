/** Remounts the page subtree on every navigation so template.tsx transitions replay. */
export default function Template({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
