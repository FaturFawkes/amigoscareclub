import Kicker from "./ui/Kicker";
import RevealOnScroll from "./ui/RevealOnScroll";

interface Segment {
  bib: string;
  pace: string;
  distance: string;
  difficulty: string;
  title: string;
  description: string;
  variant: "light" | "dark" | "orange";
  iconPath: React.ReactNode;
}

const segments: Segment[] = [
  {
    bib: "01",
    pace: "7:00–8:30 /km",
    title: "Beginner",
    description: "First-timers welcome. We walk, we jog, we cheer — no pressure, no judgment.",
    distance: "3–5 km",
    difficulty: "Easy",
    variant: "light",
    iconPath: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="13" cy="4" r="2" />
        <path d="M4 22l3-6 4-2 2-4 3 3 4 1" />
        <path d="M13 12l-2 4 4 3" />
      </svg>
    ),
  },
  {
    bib: "02",
    pace: "5:30–7:00 /km",
    title: "Intermediate",
    description: "Building endurance. Tempo runs, intervals, and your first 10K within reach.",
    distance: "5–10 km",
    difficulty: "Moderate",
    variant: "light",
    iconPath: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M13 4a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" transform="translate(0 2)" />
        <path d="M4 22l3-6 4-2 2-4 3 3 4 1" />
        <path d="M11 10l-2 4 4 3" />
      </svg>
    ),
  },
  {
    bib: "03",
    pace: "4:00–5:30 /km",
    title: "Advanced",
    description: "Race-focused training. Half-marathons, marathons, and chasing PBs together.",
    distance: "10+ km",
    difficulty: "Intense",
    variant: "dark",
    iconPath: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="14" cy="4" r="2" />
        <path d="M3 22l3-6 5-2 2-5 4 4 5 1" />
      </svg>
    ),
  },
  {
    bib: "04",
    pace: "Any pace",
    title: "Social Run",
    description: "Themed runs, brunch runs, costume runs. Running that feels like a party.",
    distance: "No rules",
    difficulty: "Always",
    variant: "orange",
    iconPath: (
      <svg width="56" height="56" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
        <circle cx="12" cy="12" r="4" />
      </svg>
    ),
  },
];

function SegmentCard({ segment }: { segment: Segment }) {
  const wrapper: Record<string, string> = {
    light: "bg-cream border-2 border-ink/10 hover:border-orange",
    dark: "bg-ink text-cream",
    orange: "bg-orange text-cream",
  };
  const paceText: Record<string, string> = {
    light: "text-ink/50",
    dark: "text-cream/50",
    orange: "text-cream/70",
  };
  const iconColor: Record<string, string> = {
    light: "text-orange",
    dark: "text-lime",
    orange: "text-cream",
  };
  const divider: Record<string, string> = {
    light: "border-ink/10",
    dark: "border-cream/15",
    orange: "border-cream/25",
  };
  const diffColor: Record<string, string> = {
    light: "text-orange",
    dark: "text-lime",
    orange: "text-cream",
  };
  const bibClass =
    segment.variant === "orange" ? "bib !bg-cream !text-orange" : "bib";

  return (
    <RevealOnScroll>
      <div className={`card rounded-3xl p-7 group h-full ${wrapper[segment.variant]}`}>
        <div className="flex items-center justify-between">
          <span className={bibClass}>{segment.bib}</span>
          <span className={`mono text-[10px] ${paceText[segment.variant]}`}>{segment.pace}</span>
        </div>
        <div className={`mt-8 group-hover:scale-110 transition-transform ${iconColor[segment.variant]}`}>
          {segment.iconPath}
        </div>
        <h3 className="display text-3xl mt-6">{segment.title}</h3>
        <p className={`text-sm mt-2 leading-relaxed ${segment.variant === "light" ? "text-ink/70" : segment.variant === "dark" ? "text-cream/70" : "text-cream/85"}`}>
          {segment.description}
        </p>
        <div className={`mt-6 pt-5 border-t flex items-center justify-between text-sm ${divider[segment.variant]}`}>
          <span className="font-semibold">{segment.distance}</span>
          <span className={`font-bold ${diffColor[segment.variant]}`}>{segment.difficulty} →</span>
        </div>
      </div>
    </RevealOnScroll>
  );
}

export default function Segments() {
  return (
    <section id="segments" className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Kicker>Find your pace</Kicker>
              <h2 className="display text-5xl md:text-7xl mt-5">
                Four segments.
                <br />
                <span className="text-orange">One</span> finish line.
              </h2>
            </div>
            <p className="md:max-w-xs text-ink/70">
              Whether it&apos;s your first kilometer or your fiftieth race, there&apos;s a squad
              that fits your stride.
            </p>
          </div>
        </RevealOnScroll>

        <div className="mt-14 grid md:grid-cols-2 lg:grid-cols-4 gap-5">
          {segments.map((seg) => (
            <SegmentCard key={seg.bib} segment={seg} />
          ))}
        </div>
      </div>
    </section>
  );
}
