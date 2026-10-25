/*
 * Site content. Projects, services, figures and contact details are real (from
 * The Lab MX's portfolio). Anything else here is derived from them: no invented
 * clients, quotes, prices or numbers.
 */

export type Project = {
  id: string;
  /** Short name set huge on the card (LAB face). */
  title: string;
  client: string;
  category: string;
  year: string;
  image: string;
  /** Intrinsic size, for next/image. */
  width: number;
  height: number;
  /** object-position when the photo is cropped. */
  focus: string;
  alt: string;
  blurb: string;
  /** Brand spectrum colour that tags this project (offset shadow, year). */
  color: string;
};

export const PROJECTS: Project[] = [
  {
    id: "wu",
    title: "WU",
    client: "WU Nutrition",
    category: "Contenido viral",
    year: "2026",
    image: "/work/wu.jpg",
    width: 562,
    height: 1000,
    focus: "50% 40%",
    alt: "Una creadora se graba frente al espejo con su celular, con el texto «3 vitaminas para mujeres este 2026».",
    blurb: "Video viral «3 vitaminas para mujeres este 2026». +25M de reproducciones y 444K likes, 100% orgánico.",
    color: "var(--magenta)",
  },
  {
    id: "zoco",
    title: "ZOCO",
    client: "Zoco Brema",
    category: "Storytelling",
    year: "2026",
    image: "/work/zoco.jpg",
    width: 750,
    height: 1000,
    focus: "50% 50%",
    alt: "Póster del spring menu de Zoco Brema: tres bebidas heladas con sus nombres en etiquetas amarillas.",
    blurb: "Spring menu para Zoco Brema: mango sticky rice matcha, banana latte y mango spritz. Storytelling que se siente, se entiende y se queda.",
    color: "var(--yellow)",
  },
  {
    id: "collab",
    title: "COLLAB",
    client: "La Cantina × La Potranca",
    category: "Collabs",
    year: "2025",
    image: "/work/collab.jpg",
    width: 1000,
    height: 750,
    focus: "42% 50%",
    alt: "Un hombre con sombrero vaquero al volante de una camioneta roja clásica.",
    blurb: "Colaboración de marcas: La Cantina × La Potranca. Narrativa norteña de rancho, cantina y carretera.",
    color: "var(--red)",
  },
  {
    id: "mercato",
    title: "MERCATO",
    client: "Il Mercato Gentiloni",
    category: "Producción",
    year: "2025",
    image: "/work/mercato.jpg",
    width: 667,
    height: 1000,
    focus: "40% 50%",
    alt: "Un chef de Il Mercato Gentiloni sostiene un manojo de perejil frente a su mandil negro.",
    blurb: "Sesiones fotográficas y producción de video para Il Mercato Gentiloni: carta, platillos y marca.",
    color: "var(--orange)",
  },
  {
    id: "apertura",
    title: "EVENTOS",
    client: "Apertura de sucursal",
    category: "Cobertura",
    year: "2026",
    image: "/work/apertura.jpg",
    width: 1000,
    height: 750,
    focus: "38% 50%",
    alt: "Unas manos abren un folleto impreso doblado durante la apertura de una sucursal.",
    blurb: "Cobertura de la apertura de una nueva sucursal: shorts y reels capturados y publicados en tiempo real.",
    color: "var(--cyan)",
  },
  {
    id: "rancho",
    title: "RANCHO",
    client: "Saltillo es un rancho",
    category: "Campañas",
    year: "2025",
    image: "/work/rancho.jpg",
    width: 666,
    height: 1000,
    focus: "50% 30%",
    alt: "Una mujer con sombrero vaquero posa junto a una camioneta clásica al atardecer.",
    blurb: "Campaña lifestyle «Saltillo es un rancho»: rodeo, rancho y merch para una comunidad local.",
    color: "var(--green)",
  },
];

export const projectById = (id: string) => PROJECTS.find((p) => p.id === id)!;

/** Figures shown in the hero and the stats band. */
export const STATS = [
  { value: "+43M", label: "Visualizaciones" },
  { value: "+160K", label: "Seguidores nuevos" },
  { value: "+900K", label: "Interacciones" },
  { value: "100%", label: "Orgánico" },
];

export const SERVICES: { name: string; tag: string; description: string; points: string[] }[] = [
  {
    name: "Contenido viral",
    tag: "Reels y shorts",
    description: "Reels y shorts pensados para volverse virales. Crecimiento real, 100% orgánico.",
    points: ["Reels y shorts", "Crecimiento orgánico"],
  },
  {
    name: "Cobertura de eventos",
    tag: "En tiempo real",
    description: "Aperturas, activaciones y experiencias cubiertas y publicadas en tiempo real.",
    points: ["Aperturas", "Activaciones", "Publicación en vivo"],
  },
  {
    name: "Foto y video",
    tag: "Producción",
    description: "Sesiones fotográficas y producción de video para tu carta, tu producto y tu marca.",
    points: ["Sesiones de foto", "Video de carta y producto"],
  },
  {
    name: "Community management",
    tag: "Todos los días",
    description: "Manejamos tus redes y tu comunidad: la voz de tu marca, todos los días.",
    points: ["Manejo de redes", "Voz de marca"],
  },
];

/** The studio's own line, "se siente, se entiende y se queda", as three steps. */
export const STEPS: { title: string; text: string }[] = [
  {
    title: "Se siente",
    text: "Conectamos con tu marca: lo que eres, cómo hablas y qué te hace distinto.",
  },
  {
    title: "Se entiende",
    text: "Lo convertimos en contenido claro: guion, foto y video pensados para tu comunidad.",
  },
  {
    title: "Se queda",
    text: "Publicamos y cuidamos la conversación para que tu comunidad regrese.",
  },
];

/** Phrases for the services ticker. */
export const CAPABILITIES = [
  "Contenido viral",
  "Cobertura de eventos",
  "Fotografía",
  "Video",
  "Community management",
  "Storytelling",
  "Campañas",
  "Collabs",
];

/** Real clients from the projects above, for the display ticker. */
export const CLIENTS = ["WU Nutrition", "Zoco Brema", "La Cantina", "La Potranca", "Il Mercato Gentiloni"];

export const INTERESTS = ["Contenido viral", "Cobertura de eventos", "Foto y video", "Community management", "Aún no sé"];

export const CONTACT = {
  email: "vasconcelos@thelabmx.com",
  instagram: "@the.labmx",
  instagramUrl: "https://www.instagram.com/the.labmx/",
  city: "Saltillo, Coahuila",
  location: "Saltillo, Coahuila, México",
  response: "Menos de 2 días hábiles",
};

/** Header and footer sections, in the order they appear on the page. */
export const NAV: [id: string, label: string][] = [
  ["estudio", "Estudio"],
  ["trabajo", "Trabajo"],
  ["proceso", "Proceso"],
  ["contacto", "Contacto"],
];
