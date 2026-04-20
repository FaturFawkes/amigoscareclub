"use client";

import { useState } from "react";
import Button from "./ui/Button";
import Kicker from "./ui/Kicker";
import RevealOnScroll from "./ui/RevealOnScroll";

interface SocialLink {
  label: string;
  icon: React.ReactNode;
  link: string;
}

const socialLinks: SocialLink[] = [
  {
    label: "Instagram",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
      </svg>
    ),
    link: "https://www.instagram.com/amigoscareclub"
  },
  {
    label: "WhatsApp",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.4" />
      </svg>
    ),
    link: "https://chat.whatsapp.com/CHqUFDV46TM89ndWXPNzV6"
  },
];

export default function Contact() {
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(true);
    (e.target as HTMLFormElement).reset();
    setTimeout(() => setSuccess(false), 5000);
  };

  return (
    <section id="contact" className="py-24 md:py-32 relative">
      <div className="mx-auto max-w-7xl px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16">
          {/* Left copy */}
          <RevealOnScroll>
            <Kicker>Get in touch</Kicker>
            <h2 className="display text-5xl md:text-7xl mt-5">
              Let&apos;s run
              <br />
              <span className="text-orange">together</span>
              <br />
              and have fun!
            </h2>
            <p className="mt-6 text-lg text-ink/75 max-w-md">
              Questions, intros, event partnerships, or just want to say hi — we read everything
              and reply fast.
            </p>

            {/* Social links */}
            <div className="mt-10">
              <div className="mono text-xs text-ink/50 mb-4">Find us on</div>
              <div className="flex flex-wrap gap-3">
                {socialLinks.map(({ label, icon, link }) => (
                  <a
                    key={label}
                    href={link}
                    className="card flex items-center gap-3 px-5 py-3 bg-cream border-2 border-ink/10 rounded-full hover:border-orange hover:text-orange font-bold text-sm"
                  >
                    {icon}
                    {label}
                  </a>
                ))}
              </div>
            </div>

            {/* Quick info */}
            <div className="mt-10 grid grid-cols-2 gap-4">
              <div className="p-5 bg-sand/60 rounded-2xl">
                <div className="mono text-[10px] text-ink/50">Email</div>
                <div className="font-semibold mt-1">amigoscareclub@gmail.com</div>
              </div>
              <div className="p-5 bg-sand/60 rounded-2xl">
                <div className="mono text-[10px] text-ink/50">Base</div>
                <div className="font-semibold mt-1">Jonggol · Bogor</div>
              </div>
            </div>
          </RevealOnScroll>

          {/* Contact form */}
          <RevealOnScroll>
            <form
              onSubmit={handleSubmit}
              className="bg-cream border-2 border-ink/10 rounded-3xl p-8 md:p-10 shadow-xl"
            >
              <div className="mono text-xs text-orange">Drop us a line</div>
              <h3 className="display text-3xl md:text-4xl mt-2">Say hi, Amigo.</h3>

              <div className="mt-8 space-y-6">
                <div>
                  <label className="mono text-[10px] text-ink/50">Name</label>
                  <input
                    className="form-field"
                    type="text"
                    placeholder="Your full name"
                    required
                  />
                </div>
                <div>
                  <label className="mono text-[10px] text-ink/50">Email</label>
                  <input
                    className="form-field"
                    type="email"
                    placeholder="you@email.com"
                    required
                  />
                </div>
                <div>
                  <label className="mono text-[10px] text-ink/50">Message</label>
                  <textarea
                    className="form-field"
                    rows={4}
                    placeholder="I'd love to join the Sunday 10K..."
                    required
                  />
                </div>
              </div>

              <Button type="submit" variant="primary" className="mt-8 w-full justify-center">
                Send Message <span className="btn-arrow">→</span>
              </Button>

              {success && (
                <div className="mt-4 p-4 bg-lime/30 border border-lime text-ink rounded-xl text-sm font-semibold">
                  ✓ Message sent! We&apos;ll reply within 24 hours.
                </div>
              )}
            </form>
          </RevealOnScroll>
        </div>
      </div>
    </section>
  );
}
