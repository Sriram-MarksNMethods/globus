import Image from "next/image";

/* TEMPORARY page to pick a sculpture direction. Delete it (and public/spiral-options) once one is chosen. */
const OPTIONS = [
  { id: "H", src: "/spiral-options/h-hero.png", name: "G colours, hero framing (newest)", note: "The G-colour column leaning diagonally, close up and running off the frame edges, for the hero." },
  { id: "G", src: "/spiral-options/g-brand.png", name: "Blender, Globus G colours (newest)", note: "Bold, cropped fin column in the logo G colours: plum rising into orange, same 13:9 split as the logo ring." },
  { id: "F", src: "/spiral-options/f-white.png", name: "Blender, all white", note: "The same bold, cropped fin column in white, for comparison." },
  { id: "E", src: "/spiral-options/e-blender.png", name: "Blender render (new)", note: "Twisted fin column rendered in Blender with real soft light and shadow. Approve this and the full loop renders overnight." },
  { id: "A", src: "/spiral-options/a.png", name: "Fine twisted stack", note: "200 very thin fins, a full twist up a soft S-curve. Fine, silky lines." },
  { id: "B", src: "/spiral-options/b.png", name: "Smooth ribbon", note: "One continuous white band that twists as it rises. No fins, pure curves." },
  { id: "C", src: "/spiral-options/c.png", name: "Spiral stair", note: "Plates fanning round a centre like a sculptural staircase. Open and airy." },
  { id: "D", src: "/spiral-options/d.png", name: "Wave column", note: "A straight stack of plates whose size swells in a soft wave. Calm, architectural." },
];

export default function SpiralOptionsPage() {
  return (
    <main className="bg-white px-5 pt-[110px] pb-20">
      <h1 className="text-h2">Pick a sculpture direction</h1>
      <p className="text-body mt-3 text-grey">Stills. The chosen one gets refined and rendered as a slow, seamless video loop.</p>
      <ul className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-3">
        {OPTIONS.map((option) => (
          <li key={option.id}>
            <div className="relative aspect-square overflow-hidden rounded-[5px] border border-black/5">
              <Image src={option.src} alt={option.name} fill sizes="25vw" className="object-contain" />
            </div>
            <p className="text-h2 mt-4">
              {option.id} · {option.name}
            </p>
            <p className="text-body mt-2 text-grey">{option.note}</p>
          </li>
        ))}
      </ul>
    </main>
  );
}
