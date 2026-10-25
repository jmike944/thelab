import { Fragment } from "react";
import { SIGNATURE, type SigItem } from "@/lib/content";

/*
 * The brand's dotted signature line (brandbook p. 8, 18-24):
 * "The LAB MX ...... Creative Worth ...... México". Parts are joined by dot
 * leaders; with `fill` the leaders stretch so the line spans its container
 * (as on the business cards). Screen readers hear the parts with commas.
 * A part can carry its own language ({ text, lang }) for the English phrases.
 */
export function Signature({
  items = SIGNATURE,
  fill = false,
  className,
}: {
  items?: readonly SigItem[];
  fill?: boolean;
  className?: string;
}) {
  return (
    <p className={`sig${fill ? " sig--fill" : ""}${className ? ` ${className}` : ""}`}>
      {items.map((item, i) => {
        const { text, lang } = typeof item === "string" ? { text: item, lang: undefined } : item;
        return (
          <Fragment key={`${text}-${i}`}>
            {i > 0 && (
              <>
                <span className="sig-dots" aria-hidden="true" />
                <span className="sr-only">, </span>
              </>
            )}
            <span className="sig-part" lang={lang}>
              {text}
            </span>
          </Fragment>
        );
      })}
    </p>
  );
}
