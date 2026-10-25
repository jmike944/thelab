/*
 * The button (after the Corvel demo): an ink block with a hard offset shadow
 * that collapses as the button slides into it on hover. An optional second,
 * paper-coloured mono segment carries a short fact ("Respuesta < 2 días hábiles").
 */
export function Btn({
  href,
  children,
  sub,
  tone = "ink",
  type,
  onClick,
  className,
}: {
  href?: string;
  children: React.ReactNode;
  sub?: string;
  /** "ink" on paper, "light" on dark panels. */
  tone?: "ink" | "light";
  type?: "submit" | "button";
  onClick?: () => void;
  className?: string;
}) {
  const cls = `btn${tone === "light" ? " btn--light" : ""}${className ? ` ${className}` : ""}`;
  const inner = (
    <>
      <span className="btn-k">{children}</span>
      {sub && <span className="btn-v">{sub}</span>}
    </>
  );
  if (href) {
    return (
      <a className={cls} href={href}>
        {inner}
      </a>
    );
  }
  return (
    <button className={cls} type={type ?? "button"} onClick={onClick}>
      {inner}
    </button>
  );
}
