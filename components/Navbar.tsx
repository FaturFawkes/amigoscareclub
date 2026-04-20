"use client";

import { useState, useEffect } from "react";
import Button from "./ui/Button";
import Logo from "./ui/Logo";

const navLinks = [
  { href: "#about", label: "About" },
  { href: "#segments", label: "Segments" },
  { href: "#events", label: "Events" },
  { href: "#faq", label: "FAQ" },
  { href: "#contact", label: "Contact" },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState("");

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 20);

      const sections = document.querySelectorAll<HTMLElement>("section[id]");
      let current = "";
      sections.forEach((sec) => {
        if (window.scrollY >= sec.offsetTop - 120) current = sec.id;
      });
      setActiveSection(current);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      id="nav"
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${scrolled ? "shadow-lg" : ""}`}
    >
      <div className="mx-auto max-w-7xl px-5 md:px-8 py-4">
        <nav className="flex items-center justify-between bg-cream/85 backdrop-blur-md rounded-full border border-ink/10 pl-5 pr-2 py-2 shadow-[0_8px_30px_-15px_rgba(11,31,58,0.25)]">
          {/* Logo */}
          <Logo size="sm" />

          {/* Desktop links */}
          <div className="hidden md:flex items-center gap-8 text-sm font-semibold">
            {navLinks.map(({ href, label }) => (
              <a
                key={href}
                href={href}
                className={`nav-link ${activeSection === href.slice(1) ? "active" : ""}`}
              >
                {label}
              </a>
            ))}
          </div>

          {/* CTA + hamburger */}
          <Button href="#contact" variant="primary" className="!py-2.5 !px-5 text-sm">
            Join Club <span className="btn-arrow">→</span>
          </Button>
          <button
            onClick={() => setMobileOpen((v) => !v)}
            className="md:hidden ml-2 p-2 rounded-full hover:bg-ink/5"
            aria-label="Menu"
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
              <line x1="3" y1="7" x2="21" y2="7" />
              <line x1="3" y1="17" x2="21" y2="17" />
            </svg>
          </button>
        </nav>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden mt-3 bg-cream rounded-3xl border border-ink/10 p-6 shadow-xl">
            <div className="flex flex-col gap-4 text-lg font-semibold">
              {navLinks.map(({ href, label }) => (
                <a
                  key={href}
                  href={href}
                  onClick={() => setMobileOpen(false)}
                  className="hover:text-orange transition-colors"
                >
                  {label}
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
