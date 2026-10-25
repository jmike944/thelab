import Image from "next/image";
import { Goo } from "@/components/site/ui/goo";
import { Marquee } from "@/components/site/ui/marquee";
import { CAPABILITIES, CLIENTS, PROJECTS } from "@/lib/content";
import s from "./ticker.module.css";

/*
 * Two tickers (after the Prism demo), each a full-bleed brand colour field
 * with black type (brandbook p. 9 "color vs black", p. 15).
 *
 * CapabilityTicker: a thin mono strip on magenta right under the hero, the
 * capabilities separated by small black printed shapes, each with its keyline
 * knocked slightly out of register (Corvel's two-plate print).
 *
 * ClientTicker: the clients' own logos in black on yellow (the brand's black
 * logo on colour, p. 15), with a small goo swatch before each and a rule after
 * it. The label sits in its own column at the band's left edge, so the logos
 * come out from behind it and never under it.
 */

/**
 * Logos are sized for equal visual weight rather than equal height: a wide
 * wordmark gets less height than a compact mark. Height in em of the band's
 * type size, for a constant area (a 3:1 logo comes out at 0.6em).
 */
const logoHeight = (w: number, h: number) => Math.min(0.78, Math.max(0.34, Math.sqrt((0.6 * 0.6 * 3) / (w / h))));

const SHAPES = [s.sq, s.ci, s.di];

/** What we made for each client, from the real projects: "Collabs · 2025". */
const madeFor = (name: string) => {
  const p = PROJECTS.find((x) => x.client.includes(name));
  return p ? `${p.category} · ${p.year}` : null;
};

export function CapabilityTicker() {
  return (
    <div className={`field field--magenta ${s.cap}`}>
      <Marquee seconds={55} label="Lo que hacemos" className={s.capRun}>
        {CAPABILITIES.map((c, i) => (
          <li key={c} className={s.capItem}>
            <span>{c}</span>
            <span className={s.capSep} aria-hidden="true">
              <i className={s.capRule} />
              <i className={`${s.shape} ${SHAPES[i % SHAPES.length]}`} />
              <i className={s.capRule} />
            </span>
          </li>
        ))}
      </Marquee>
    </div>
  );
}

export function ClientTicker() {
  const count = String(CLIENTS.length).padStart(2, "0");
  return (
    <section className={s.clients} aria-labelledby="clientes-h">
      <h2 id="clientes-h" className="sr-only">
        Clientes
      </h2>

      <div className={`field field--yellow ${s.band}`}>
        <div className={s.label} aria-hidden="true">
          <p className={`mono ${s.labelK}`}>Clientes</p>
          <p className={`mono ${s.labelN}`}>({count})</p>
        </div>
        <p className={`note ${s.clNote}`} aria-hidden="true">
          marcas con las que hemos creado ↙
        </p>

        <Marquee seconds={46} label="Clientes" className={s.clRun}>
          {CLIENTS.map((c, i) => {
            const made = c.made ?? madeFor(c.name);
            return (
              <li key={c.name} className={s.clItem}>
                <Goo size="sm" cols={3} rows={2} seed={211 + i * 37} className={s.swatch} />
                <Image
                  className={s.logo}
                  src={c.logo}
                  width={c.w}
                  height={c.h}
                  alt={c.name}
                  sizes="(max-width: 760px) 50vw, 26vw"
                  style={{ "--lh": logoHeight(c.w, c.h) } as React.CSSProperties}
                />
                <span className={`mono ${s.sup}`}>
                  <span className={s.supN} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {made && <span>{made}</span>}
                </span>
                <i className={s.clSep} aria-hidden="true" />
              </li>
            );
          })}
        </Marquee>
      </div>
    </section>
  );
}
