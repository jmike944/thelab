/*
 * An endless horizontal loop. The items are rendered twice and the track
 * slides by half its width; the copy is aria-hidden so it's read once. Runs
 * only under html.motion, and pauses on hover, keyboard focus or the page's
 * pause switch. Without motion (reduced motion, no JS) it is a static list
 * instead: the copy is dropped and the run wraps, so every item is visible.
 */
export function Marquee({
  children,
  className,
  seconds = 50,
  label,
}: {
  /** The run of items, rendered as list items. */
  children: React.ReactNode;
  className?: string;
  /** Duration of one full loop. */
  seconds?: number;
  label?: string;
}) {
  return (
    <div className={`marquee ${className ?? ""}`} style={{ "--mq-dur": `${seconds}s` } as React.CSSProperties}>
      <div className="mq-track">
        <ul className="mq-run" aria-label={label}>
          {children}
        </ul>
        <ul className="mq-run" aria-hidden="true">
          {children}
        </ul>
      </div>
    </div>
  );
}
