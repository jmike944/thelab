import Image from "next/image";

/*
 * A photo printed through a halftone screen (after the Corvel demo): the image
 * is greyscaled inside a high-contrast layer with a rotated dot grid multiplied
 * over it, then the ink colour is laid on top with mix-blend lighten, so the
 * dots print in that ink on white.
 */
export function Halftone({
  src,
  alt,
  ink = "ink",
  sizes,
  focus,
  priority,
  className,
  angle,
}: {
  src: string;
  /** Pass "" when the print is decorative. */
  alt: string;
  ink?: "ink" | "blue" | "magenta";
  sizes: string;
  focus?: string;
  priority?: boolean;
  className?: string;
  /** Screen angle in degrees (two plates of the same image use different angles). */
  angle?: number;
}) {
  return (
    <div
      className={`ht ht--${ink} ${className ?? ""}`}
      role={alt ? "img" : undefined}
      aria-label={alt || undefined}
      aria-hidden={alt ? undefined : true}
      style={angle != null ? ({ "--ht-a": `${angle}deg` } as React.CSSProperties) : undefined}
    >
      <div className="ht-scr">
        <Image className="ht-img" src={src} alt="" fill sizes={sizes} priority={priority} style={{ objectFit: "cover", objectPosition: focus }} />
      </div>
    </div>
  );
}
