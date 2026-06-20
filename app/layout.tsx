import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "THE LAB® — Creative Worth · Estudio de contenido en Saltillo",
  description:
    "The Lab MX — estudio de contenido en Saltillo, Coahuila. Contenido viral, cobertura de eventos, fotografía, video y community management para restaurantes y experiencias.",
};

const themeBoot = `(() => { try { var r = document.documentElement; var m = localStorage.getItem("lab-site-theme"); var dark = m === "signal" || ((m === "system" || m === null) && window.matchMedia("(prefers-color-scheme: dark)").matches); if (dark) r.setAttribute("data-theme", "signal"); var ac = localStorage.getItem("lab-site-accent"); var A = {red:["#ee1708","#fffcf7"],orange:["#ff9000","#231f20"],yellow:["#feff1f","#231f20"],green:["#3ac62f","#231f20"],cyan:["#00cfff","#231f20"],blue:["#3537ff","#fffcf7"],magenta:["#ff0074","#fffcf7"]}; if (ac && A[ac]) { r.style.setProperty("--hud-accent", A[ac][0]); r.style.setProperty("--hud-accent-ink", A[ac][1]); } } catch (_) {} })();`;

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeBoot }} />
      </head>
      <body>{children}</body>
    </html>
  );
}
