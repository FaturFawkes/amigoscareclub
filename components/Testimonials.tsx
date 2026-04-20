import Kicker from "./ui/Kicker";
import RevealOnScroll from "./ui/RevealOnScroll";

interface Testimonial {
  quote: string;
  name: string;
  squad: string;
  variant: "light" | "dark";
  avatarGradient: string;
}

const testimonials: Testimonial[] = [
  {
    quote:
      "Awalnya gabisa lari 5 km. Tiga bulan kemudian, gue berhasil selesain 10K pertama sama temen-temen yang teriak di garis finish.",
    name: "Firly.",
    squad: "Beginner Squad",
    variant: "light",
    avatarGradient: "from-orange to-ember",
  },
  {
    quote:
      "Komunitasnya gila sih. Larinya santai, tapi ketawanya gabisa dikontrol. Ngopi habis lari itu udah kayak ritual wajib. Keputusan terbaik tahun ini.",
    name: "Bintang.",
    squad: "Advanced Squad",
    variant: "dark",
    avatarGradient: "from-lime to-orange",
  },
  {
    quote:
      "Inklusif, hangat, dan seru banget. Lutut rasanya makin muda, hari Minggu makin bermakna, dan dapet temen baru jadi bikin semangat hidup.",
    name: "Gusti.",
    squad: "Social Run Regular",
    variant: "light",
    avatarGradient: "from-ink to-ink-soft",
  },
];

function TestimonialCard({ t }: { t: Testimonial }) {
  const starsColor = t.variant === "dark" ? "text-lime" : "text-orange";
  const wrapper =
    t.variant === "dark"
      ? "bg-ink text-cream"
      : "bg-cream border-2 border-ink/10 hover:border-orange";
  const quoteColor = t.variant === "dark" ? "text-cream/85" : "text-ink/80";
  const squadColor = t.variant === "dark" ? "text-cream/50" : "text-ink/50";

  return (
    <RevealOnScroll>
      <div className={`card rounded-3xl p-8 ${wrapper}`}>
        <div className={`flex text-lg ${starsColor}`}>★★★★★</div>
        <p className={`mt-4 leading-relaxed ${quoteColor}`}>{t.quote}</p>
        <div className="mt-6 flex items-center gap-3">
          <div className={`w-11 h-11 rounded-full bg-gradient-to-br ${t.avatarGradient}`} />
          <div>
            <div className="font-bold">{t.name}</div>
            <div className={`mono text-[10px] ${squadColor}`}>{t.squad}</div>
          </div>
        </div>
      </div>
    </RevealOnScroll>
  );
}

export default function Testimonials() {
  return (
    <section className="py-24 md:py-32">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <RevealOnScroll>
          <div className="text-center max-w-2xl mx-auto">
            <Kicker center>Amigo Stories</Kicker>
            <h2 className="display text-5xl md:text-7xl mt-5">
              True Runners.
              <br />
              True <span className="text-orange">stories.</span>
            </h2>
          </div>
        </RevealOnScroll>

        <div className="mt-14 grid md:grid-cols-3 gap-5">
          {testimonials.map((t) => (
            <TestimonialCard key={t.name} t={t} />
          ))}
        </div>
      </div>
    </section>
  );
}
