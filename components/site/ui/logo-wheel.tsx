import { CONTACT } from "@/lib/content";

/*
 * The radial logo wheel (brandbook p. 18, 20, 21): spokes of "The LaB" with
 * the signature and the handle, turning around a centre lockup. Purely
 * decorative. It turns slowly only under html.motion; the global pause stops it.
 */
export function LogoWheel({ spokes = 12, className }: { spokes?: number; className?: string }) {
  return (
    <div
      className={`wheel${className ? ` ${className}` : ""}`}
      style={{ "--n": spokes } as React.CSSProperties}
      aria-hidden="true"
    >
      <div className="wheel-turn">
        {Array.from({ length: spokes }, (_, i) => (
          <div key={i} className="wheel-spoke" style={{ "--i": i } as React.CSSProperties}>
            <span className="logo-mask wheel-logo" />
            <span className="wheel-sig">Creative Worth ..... México</span>
            <span className="wheel-handle">{CONTACT.instagram}</span>
          </div>
        ))}
      </div>
      <span className="logo-mask wheel-core" />
    </div>
  );
}
