import Image from "next/image";

/*
 * Hand-drawn versions of the logo from the brandbook's graphic elements
 * (p. 17, 21, 24): crayon, marker, pen scribble and script. Extracted from the
 * brandbook with the paper knocked out, so they sit on any surface.
 * Decorative by default; pass `label` when one stands in for the name.
 */
const MARKS = {
  crayon: { src: "/brand/hand/crayon-thelab.png", w: 1016, h: 253, alt: "THE LAB®, dibujado con crayón azul" },
  rainbow: { src: "/brand/hand/rainbow-thelab.png", w: 906, h: 264, alt: "THE LAB, contorno en colores" },
  script: { src: "/brand/hand/script-thelab.png", w: 830, h: 358, alt: "The Lab, en letra cursiva" },
  "marker-red": { src: "/brand/hand/marker-lab-red.png", w: 407, h: 226, alt: "Lab, con plumón rojo" },
  "marker-black": { src: "/brand/hand/marker-lab-black.png", w: 626, h: 352, alt: "Lab, con plumón negro" },
  "scribble-3d": { src: "/brand/hand/scribble-3d-blue.png", w: 1537, h: 1021, alt: "Logo 3D de The Lab, garabateado en pluma azul" },
  "scribble-black": { src: "/brand/hand/scribble-thelab-black.png", w: 947, h: 385, alt: "The Lab, garabateado en negro" },
} as const;

export type HandMarkName = keyof typeof MARKS;

export function HandMark({
  name,
  className,
  sizes = "(max-width: 760px) 60vw, 30vw",
  label,
}: {
  name: HandMarkName;
  className?: string;
  sizes?: string;
  /** Accessible name; omit when decorative. */
  label?: boolean | string;
}) {
  const m = MARKS[name];
  const alt = label === true ? m.alt : typeof label === "string" ? label : "";
  return (
    <Image
      className={`hand-mark${className ? ` ${className}` : ""}`}
      src={m.src}
      width={m.w}
      height={m.h}
      sizes={sizes}
      alt={alt}
      aria-hidden={alt ? undefined : true}
    />
  );
}
