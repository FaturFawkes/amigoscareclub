import Kicker from "./ui/Kicker";
import RevealOnScroll from "./ui/RevealOnScroll";

interface ValueCardProps {
  number: string;
  title: string;
  description: string;
  variant?: "light" | "dark" | "orange";
}

function ValueCard({ number, title, description, variant = "light" }: ValueCardProps) {
  const wrapperClasses: Record<string, string> = {
    light: "bg-cream border-2 border-ink/10 hover:border-orange",
    dark: "bg-ink text-cream",
    orange: "bg-orange text-cream",
  };
  const numClasses: Record<string, string> = {
    light: "text-ink/40",
    dark: "text-cream/40",
    orange: "text-cream/50",
  };
  const descClasses: Record<string, string> = {
    light: "text-ink/70",
    dark: "text-cream/70",
    orange: "text-cream/80",
  };
  const iconBg: Record<string, string> = {
    light: "bg-orange/10 text-orange",
    dark: "bg-lime/20 text-lime",
    orange: "bg-cream/20 text-cream",
  };

  return (
    <RevealOnScroll>
      <div className={`card rounded-3xl p-7 ${wrapperClasses[variant]}`}>
        <div className="flex items-start justify-between">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${iconBg[variant]}`}>
            {variant === "dark" ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            ) : variant === "orange" ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" /><polyline points="12 6 12 12 16 14" />
              </svg>
            ) : number === "01" ? (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 9l-5 5-3-3" /><circle cx="12" cy="12" r="10" />
              </svg>
            ) : (
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" /><path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
            )}
          </div>
          <span className={`mono text-xs ${numClasses[variant]}`}>{number}</span>
        </div>
        <h3 className="display text-3xl mt-5">{title}</h3>
        <p className={`mt-2 text-sm leading-relaxed ${descClasses[variant]}`}>{description}</p>
      </div>
    </RevealOnScroll>
  );
}

const values: ValueCardProps[] = [
  {
    number: "01",
    title: "Fun First",
    description: "Laughter is part of training. If it's not fun, we're not doing it right.",
    variant: "light",
  },
  {
    number: "02",
    title: "Health Always",
    description: "Mind, body, and heart. We run to feel better, not just go faster.",
    variant: "dark",
  },
  {
    number: "03",
    title: "Consistency",
    description: "Small steps, every week. Progress is built by showing up — again and again.",
    variant: "orange",
  },
  {
    number: "04",
    title: "Community",
    description: "Your crew, your cheer squad. Friends made at sunrise last a lifetime.",
    variant: "light",
  },
];

const highlights = [
  "Monthly group runs",
  "Supportive environment",
  "Social connections",
  "Healthy lifestyle",
];

export default function About() {
  return (
    <section id="about" className="py-24 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid lg:grid-cols-12 gap-12">
          {/* Left copy */}
          <RevealOnScroll className="lg:col-span-5">
            <Kicker>About the Club</Kicker>
            <h2 className="display text-6xl md:text-7xl mt-5">
              More than
              <br />a <span className="stroke-text">run.</span>
            </h2>
            <p className="mt-6 text-lg text-ink/75 leading-relaxed">
              Amigos Care Club is a friendly, inclusive running community built for every level —
              from first-time joggers to ultra-marathoners. We believe running is better together:
              a shared sunrise, a shared finish line, a shared high-five.
            </p>
            <div className="mt-8 space-y-5">
              <div>
                <div className="mono text-xs text-orange">Our Vision</div>
                <p className="mt-1 font-medium">
                  A healthier, happier community — one kilometer at a time.
                </p>
              </div>
              <div>
                <div className="mono text-xs text-orange">Our Mission</div>
                <p className="mt-1 font-medium">
                  To make running joyful, social, and accessible for everyone, everywhere.
                </p>
              </div>
            </div>
          </RevealOnScroll>

          {/* Right value cards */}
          <div className="lg:col-span-7">
            <div className="grid sm:grid-cols-2 gap-5">
              {values.map((v) => (
                <ValueCard key={v.number} {...v} />
              ))}
            </div>

            {/* Highlights list */}
            <RevealOnScroll className="mt-8">
              <div className="grid sm:grid-cols-2 gap-3">
                {highlights.map((item) => (
                  <div key={item} className="flex items-center gap-3 p-4 bg-sand/60 rounded-2xl">
                    <span className="text-orange">●</span>
                    <span className="font-semibold">{item}</span>
                  </div>
                ))}
              </div>
            </RevealOnScroll>
          </div>
        </div>
      </div>
    </section>
  );
}
