/*
 * The brand's test-card colour bars (brandbook p. 14): seven tall bars over a
 * strip of five, in the brandbook's own order. Decorative.
 */
const TOP = ["paper-hi", "yellow", "cyan", "green", "violet", "red", "blue"];
const FOOT = ["paper-hi", "orange", "magenta", "sage", "ink"];

export function ColorBars({ className }: { className?: string }) {
  return (
    <div className={`bars${className ? ` ${className}` : ""}`} aria-hidden="true">
      <div className="bars-top">
        {TOP.map((c, i) => (
          <i key={`t${i}`} style={{ background: `var(--${c})` }} />
        ))}
      </div>
      <div className="bars-foot">
        {FOOT.map((c, i) => (
          <i key={`f${i}`} style={{ background: `var(--${c})` }} />
        ))}
      </div>
    </div>
  );
}
