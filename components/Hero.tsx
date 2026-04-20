import Image from "next/image";
import Button from "./ui/Button";
import Kicker from "./ui/Kicker";
import RevealOnScroll from "./ui/RevealOnScroll";

const tickerItems = [
  "RUN WITH FUN",
  "AMIGOS CARE CLUB",
  "EVERY PACE WELCOME",
  "MOVE · LAUGH · REPEAT",
];

export default function Hero() {
  return (
    <section id="top" className="relative pt-32 md:pt-36 pb-0 overflow-hidden">
      {/* decorative dot grids */}
      <div className="hidden md:block absolute right-[-80px] top-[180px] w-[260px] h-[260px] dots opacity-30 -z-0" />
      <div className="hidden md:block absolute left-[-40px] bottom-[120px] w-[140px] h-[140px] dots opacity-20 -z-0" />

      <div className="mx-auto max-w-7xl px-5 md:px-8 relative z-10">
        <div className="grid lg:grid-cols-12 gap-10 items-center">
          {/* Left copy */}
          <div className="lg:col-span-7">
            <RevealOnScroll>
              <Kicker>Est. 2026 · Bogor</Kicker>
            </RevealOnScroll>

            <RevealOnScroll className="mt-6">
              <h1 className="display display-hero text-[clamp(3.5rem,11vw,9rem)]">
                RUN
                <br />
                WITH <span className="text-orange">FUN</span>
                <span className="text-orange">.</span>
              </h1>
            </RevealOnScroll>

            <RevealOnScroll className="mt-7">
              <p className="max-w-xl text-lg md:text-xl text-ink/75 leading-relaxed">
                Welcome to <strong className="text-ink">Amigos Care Club</strong> — building a
                healthy lifestyle through fun and supportive running experiences. From your first
                kilometer to your next PB.
              </p>
            </RevealOnScroll>

            <RevealOnScroll className="mt-9">
              <div className="flex flex-wrap gap-3">
                <Button href="#contact" variant="primary">
                  Join Our Community <span className="btn-arrow">→</span>
                </Button>
                <Button href="#events" variant="ghost">
                  See Upcoming Events
                </Button>
              </div>
            </RevealOnScroll>

            {/* Social proof strip */}
            <RevealOnScroll className="mt-10">
              <div className="flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
                <div className="flex items-center gap-2">
                  <div className="flex -space-x-2">
                    <div className="w-8 h-8 rounded-full border-2 border-cream bg-gradient-to-br from-orange to-ember" />
                    <div className="w-8 h-8 rounded-full border-2 border-cream bg-gradient-to-br from-ink to-ink-soft" />
                    <div className="w-8 h-8 rounded-full border-2 border-cream bg-gradient-to-br from-lime to-orange" />
                    <div className="w-8 h-8 rounded-full border-2 border-cream bg-ink flex items-center justify-center text-cream text-[10px] font-bold">
                      +200
                    </div>
                  </div>
                  <span className="text-ink/70">
                    <strong className="text-ink">200+ runners</strong> already moving
                  </span>
                </div>
                <div className="flex items-center gap-2 text-ink/70">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="#FF5B1F">
                    <path d="M12 2l2.4 7.4H22l-6.2 4.5 2.4 7.4L12 16.8l-6.2 4.5 2.4-7.4L2 9.4h7.6z" />
                  </svg>
                  <span>
                    Rated <strong className="text-ink">4.9</strong> by members
                  </span>
                </div>
              </div>
            </RevealOnScroll>
          </div>

          {/* Right visual */}
          <RevealOnScroll className="lg:col-span-5">
            <div className="relative">
              {/* main hero image */}
              <div className="hero-img-wrap aspect-[4/5] shadow-[0_30px_60px_-30px_rgba(11,31,58,0.5)]">
                <Image
                  className="hero-img"
                  src="https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&w=1200&q=80"
                  alt="Group of runners at sunrise"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              </div>

              {/* floating bib card */}
              <div className="absolute -top-6 -left-6 bg-cream rounded-2xl p-4 shadow-xl border border-ink/10 rotate-[-6deg] hidden sm:block">
                <div className="mono text-xs text-ink/60">Bib No.</div>
                <div className="display text-4xl text-orange leading-none">042</div>
                <div className="mono text-[10px] mt-1 text-ink/60">Amigos Care Club</div>
              </div>

              {/* floating stat card */}
              <div className="absolute -bottom-6 -right-6 bg-ink text-cream rounded-2xl p-5 shadow-xl rotate-[4deg] max-w-[180px]">
                <div className="mono text-xs text-lime">This Week</div>
                <div className="display text-3xl mt-1">128 km</div>
                <div className="text-xs mt-1 text-cream/70">Logged by our Amigos together.</div>
              </div>
            </div>
          </RevealOnScroll>
        </div>
      </div>

      {/* Marquee ticker */}
      <div className="ticker marquee mt-20 py-5 border-y border-ink/20">
        <div className="marquee__inner display text-4xl md:text-5xl">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span key={i} className="ticker-item">
              {item} <span className="text-orange">✦</span>
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
