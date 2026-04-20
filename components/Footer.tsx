const exploreLinks = [
  { href: "#about", label: "About Us" },
  { href: "#segments", label: "Segments" },
  { href: "#events", label: "Events" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

const followLinks = [
  { href: "https://www.instagram.com/amigoscareclub", label: "Instagram" },
  { href: "https://chat.whatsapp.com/CHqUFDV46TM89ndWXPNzV6", label: "WhatsApp" },
];

const legalLinks = [
  { href: "#", label: "Privacy" },
  { href: "#", label: "Terms" },
  { href: "#", label: "Code of Conduct" },
];

import Logo from "./ui/Logo";

export default function Footer() {
  return (
    <footer className="bg-ink text-cream pt-20 pb-10 relative overflow-hidden">
      {/* huge display type background */}
      <div className="absolute inset-x-0 bottom-[50px] pointer-events-none overflow-hidden opacity-[0.07]">
        <div className="display text-[15vw] leading-none text-center whitespace-nowrap">
          AMIGOSCARECLUB
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-5 md:px-8 relative">
        <div className="grid md:grid-cols-3 gap-10 pb-12 border-b border-cream/15">
          {/* Brand */}
          <div>
            <Logo size="md" />
            <p className="mt-4 text-cream/70 max-w-xs">
              A friendly, inclusive running community. Building a healthy lifestyle through fun and
              supportive running experiences.
            </p>
            <div className="mt-5 display text-3xl">
              RUN WITH <span className="text-orange">FUN.</span>
            </div>
          </div>

          {/* Explore links */}
          <div>
            <div className="mono text-xs text-cream/50 mb-4">Explore</div>
            <ul className="space-y-2.5 font-medium">
              {exploreLinks.map(({ href, label }) => (
                <li key={label}>
                  <a href={href} className="hover:text-orange transition-colors">
                    {label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Follow links */}
          <div>
            <div className="mono text-xs text-cream/50 mb-4">Follow</div>
            <ul className="space-y-2.5 font-medium">
              {followLinks.map(({ href, label }) => (
                <li key={label}>
                  <a href={href} className="hover:text-orange transition-colors">
                    {label} →
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 text-sm text-cream/60">
          <div>© 2026 Amigos Care Club. All rights reserved.</div>
          <div className="flex gap-6">
            {legalLinks.map(({ href, label }) => (
              <a key={label} href={href} className="hover:text-orange transition-colors">
                {label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
