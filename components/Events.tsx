import Button from "./ui/Button";
import Kicker from "./ui/Kicker";
import RevealOnScroll from "./ui/RevealOnScroll";

interface Activity {
  icon: string;
  title: string;
  description: string;
  accent: "orange" | "ink" | "lime";
}

const activities: Activity[] = [
  {
    icon: "🏃",
    title: "Monthly Group Runs",
    description: "We hit the road together every month, rain or shine. All paces welcome — no one gets left behind.",
    accent: "orange",
  },
  {
    icon: "☕",
    title: "Social Run + Coffee",
    description: "Easy-paced runs followed by coffee, snacks, and good conversation. The best part of running.",
    accent: "ink",
  },
  {
    icon: "🎗️",
    title: "Charity & Fun Runs",
    description: "Special themed events that give back to the community — costumes optional, good vibes mandatory.",
    accent: "lime",
  },
];

interface Step {
  number: string;
  title: string;
  description: string;
  variant: "light" | "dark" | "orange";
}

const steps: Step[] = [
  {
    number: "01",
    title: "Say hi",
    description: "DM us on Instagram or join our WhatsApp group. We'll welcome you like an old friend.",
    variant: "light",
  },
  {
    number: "02",
    title: "Show up",
    description: "Come to the next meetup point. Bring your shoes and a smile — we handle the rest.",
    variant: "dark",
  },
  {
    number: "03",
    title: "Run & repeat",
    description: "Make it a habit, make friends, make memories. Once you start, you won't want to stop.",
    variant: "orange",
  },
];

const accentBg: Record<string, string> = {
  orange: "bg-orange text-cream",
  ink: "bg-ink text-cream",
  lime: "bg-lime text-ink",
};

const stepStyles: Record<string, { wrapper: string; numColor: string; descColor: string }> = {
  light: {
    wrapper: "bg-cream border-2 border-ink/10 hover:border-orange",
    numColor: "text-orange",
    descColor: "text-ink/70",
  },
  dark: {
    wrapper: "bg-ink text-cream",
    numColor: "text-lime",
    descColor: "text-cream/70",
  },
  orange: {
    wrapper: "bg-orange text-cream",
    numColor: "text-cream",
    descColor: "text-cream/80",
  },
};

export default function Events() {
  return (
    <section id="events" className="py-24 md:py-32 bg-sand/40 border-y border-ink/10">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        {/* Header */}
        <RevealOnScroll>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <Kicker>What we do</Kicker>
              <h2 className="display text-5xl md:text-7xl mt-5">Run together.</h2>
            </div>
            <Button href="#contact" variant="ghost" className="self-start md:self-end">
              Join the Community
            </Button>
          </div>
        </RevealOnScroll>

        {/* Featured CTA + activity types */}
        <RevealOnScroll className="mt-14">
          <div className="grid lg:grid-cols-5 gap-8">
            {/* Featured — evergreen invite */}
            <div className="lg:col-span-3 relative bg-ink text-cream rounded-3xl overflow-hidden p-8 md:p-10 min-h-[340px] flex flex-col justify-between">
              <div
                className="absolute inset-0 opacity-30 pointer-events-none"
                style={{
                  background:
                    "radial-gradient(500px circle at 80% 20%, #FF5B1F, transparent 40%)",
                }}
              />
              <div className="relative">
                <span className="mono text-xs text-lime">Minggu, 24 Mei 2025 · All Levels</span>
                <h3 className="display text-5xl md:text-6xl mt-4">
                  40% OF
                  <br />
                  HEART RATE
                  <br />
                  RUN - VOL.2
                </h3>
                <p className="mt-4 max-w-md text-cream/80">
                  This fun run is a collaboration with Melkkops Coffee &amp; Eatry—expect good
                  vibes with live DJ music, an easy-going pace for everyone, and exciting door
                  prize giveaways.
                </p>
                <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
                  <div>
                    <div className="mono text-[10px] text-cream/50">Tempat</div>
                    <div className="font-semibold">Melkkops Coffee &amp; Eatry</div>
                  </div>
                  <div>
                    <div className="mono text-[10px] text-cream/50">Distance</div>
                    <div className="font-semibold">5 km</div>
                  </div>
                  <div>
                    <div className="mono text-[10px] text-cream/50">Pace</div>
                    <div className="font-semibold">Every pace welcome</div>
                  </div>
                </div>
                <Button href="/event/40-of-heart-rate-run" variant="primary" className="mt-8">
                  Count me in <span className="btn-arrow">→</span>
                </Button>
              </div>
            </div>

            {/* Activity types */}
            <div className="lg:col-span-2 space-y-4">
              {activities.map((a) => (
                <div
                  key={a.title}
                  className="card bg-cream rounded-3xl p-6 border-2 border-ink/10 hover:border-orange flex items-start gap-5"
                >
                  <div
                    className={`flex-shrink-0 w-16 h-16 rounded-2xl flex items-center justify-center text-2xl ${accentBg[a.accent]}`}
                  >
                    {a.icon}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-bold text-lg">{a.title}</h4>
                    <p className="text-sm text-ink/65 mt-1">{a.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </RevealOnScroll>

        {/* How to get started */}
        <RevealOnScroll className="mt-20">
          <div className="flex items-baseline justify-between">
            <h3 className="display text-3xl md:text-4xl">How to get started</h3>
            <span className="mono text-xs text-ink/50">3 easy steps</span>
          </div>
          <div className="mt-8 grid md:grid-cols-3 gap-5">
            {steps.map((step) => {
              const s = stepStyles[step.variant];
              return (
                <div
                  key={step.number}
                  className={`card rounded-3xl p-8 ${s.wrapper}`}
                >
                  <div className={`display text-6xl ${s.numColor}`}>{step.number}</div>
                  <h4 className="display text-3xl mt-4">{step.title}</h4>
                  <p className={`text-sm mt-3 leading-relaxed ${s.descColor}`}>
                    {step.description}
                  </p>
                </div>
              );
            })}
          </div>
        </RevealOnScroll>
      </div>
    </section>
  );
}
