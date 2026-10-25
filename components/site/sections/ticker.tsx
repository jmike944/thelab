import { Goo } from "@/components/site/ui/goo";
import { Marquee } from "@/components/site/ui/marquee";
import { CAPABILITIES, CLIENTS, PROJECTS } from "@/lib/content";
import s from "./ticker.module.css";

/*
 * Two tickers (after the Prism demo).
 *
 * CapabilityTicker: a thin mono strip right under the hero, hairlines top and
 * bottom, the capabilities separated by small printed shapes that cycle
 * through the spectrum, each with its ink keyline knocked slightly out of
 * register (Corvel's two-plate print).
 *
 * ClientTicker: the real client names at display size in LAB, alternating
 * solid and outlined, with a small goo swatch before each name and a rule
 * after it. A paper tab pinned over the left edge carries the label.
 */

const SPECTRUM = [
  "var(--blue)",
  "var(--magenta)",
  "var(--yellow)",
  "var(--orange)",
  "var(--violet)",
  "var(--cyan)",
  "var(--green)",
  "var(--red)",
];
const SHAPES = [s.sq, s.ci, s.di];

/** What we made for each client, from the real projects: "Collabs · 2025". */
const madeFor = (name: string) => {
  const p = PROJECTS.find((x) => x.client.includes(name));
  return p ? `${p.category} · ${p.year}` : null;
};

export function CapabilityTicker() {
  return (
    <div className={s.cap}>
      <Marquee seconds={55} label="Lo que hacemos" className={s.capRun}>
        {CAPABILITIES.map((c, i) => (
          <li key={c} className={s.capItem}>
            <span>{c}</span>
            <span className={s.capSep} aria-hidden="true">
              <i className={s.capRule} />
              <i
                className={`${s.shape} ${SHAPES[i % SHAPES.length]}`}
                style={{ "--c": SPECTRUM[i % SPECTRUM.length] } as React.CSSProperties}
              />
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

      <div className={s.band}>
        <div className={s.label} aria-hidden="true">
          <p className={`mono ${s.labelK}`}>Clientes</p>
          <p className={`mono ${s.labelN}`}>({count})</p>
        </div>
        <p className={`note ${s.clNote}`} aria-hidden="true">
          marcas con las que hemos creado ↙
        </p>

        <Marquee seconds={46} label="Clientes" className={s.clRun}>
          {CLIENTS.map((name, i) => {
            const made = madeFor(name);
            return (
              <li key={name} className={s.clItem}>
                <Goo size="sm" cols={3} rows={2} seed={211 + i * 37} className={s.swatch} />
                <span className={`${s.word}${i % 2 ? ` ${s.outline}` : ""}`}>{name}</span>
                <span className={`mono ${s.sup}`}>
                  <span className={s.supN} aria-hidden="true">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  {made && <span className={s.supV}>{made}</span>}
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
