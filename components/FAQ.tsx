import Kicker from "./ui/Kicker";
import RevealOnScroll from "./ui/RevealOnScroll";

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: "Apakah harus sudah jago lari?",
    answer:
      "Nggak sama sekali. Kami menerima semua level — dari yang baru pertama kali lari sampai yang sudah pernah maraton. Beginner Squad kami dirancang khusus untuk pemula, dengan struktur jalan-lari santai dan tanpa tekanan.",
  },
  {
    question: "Ada biaya keanggotaan nggak?",
    answer:
      "Group run bulanan selalu gratis. Kami hanya mengenakan biaya kecil untuk event khusus seperti Fun Run, yang mencakup bib, snack, dan biaya venue. Transparan, tanpa biaya tersembunyi.",
  },
  {
    question: "Apa yang perlu dibawa?",
    answer:
      "Sepatu lari, botol minum, baju nyaman, dan mood yang baik. Itu aja. Sisanya kami yang urus — rute, playlist, dan rencana ngopi setelah lari.",
  },
  {
    question: "Cara gabungnya gimana?",
    answer:
      "Gampang banget: kirim pesan lewat form kontak di bawah atau DM kami di Instagram/WhatsApp. Kami akan tambahkan kamu ke grup komunitas dan kirimkan jadwal lari pertamamu. Tanpa formulir ribet, tanpa waiting list.",
  },
  {
    question: "Biasanya lari di mana?",
    answer:
      "Meetup utama kami di area Jonggol dan Citra Indah, Bogor. Kami juga rutin mengadakan destination run per 3 bulan — trail run atau rute yang beda dari biasanya. Jadwal selalu di-update di grup komunitas kami.",
  },
];

export default function FAQ() {
  return (
    <section id="faq" className="py-24 md:py-32 bg-ink text-cream">
      <div className="mx-auto max-w-5xl px-5 md:px-8">
        <RevealOnScroll>
          <div className="text-center">
            <Kicker center light>
              FAQ
            </Kicker>
            <h2 className="display text-5xl md:text-7xl mt-5">
              Everything you
              <br />
              <span style={{ WebkitTextStroke: "2px #FFF6EC", color: "transparent" }}>need</span>{" "}
              to know.
            </h2>
          </div>
        </RevealOnScroll>

        <div className="mt-14 space-y-3">
          {faqs.map((faq) => (
            <RevealOnScroll key={faq.question}>
              <details className="group bg-ink-soft/60 rounded-2xl border border-cream/10 hover:border-orange/60 transition-colors">
                <summary className="flex items-center justify-between p-6">
                  <span className="font-bold text-lg md:text-xl">{faq.question}</span>
                  <span className="faq-icon text-3xl text-orange leading-none">+</span>
                </summary>
                <div className="faq-body">
                  <p className="px-6 pb-6 text-cream/75 leading-relaxed">{faq.answer}</p>
                </div>
              </details>
            </RevealOnScroll>
          ))}
        </div>
      </div>
    </section>
  );
}
