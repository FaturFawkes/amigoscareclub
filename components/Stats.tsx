"use client";

import { useEffect, useRef } from "react";

interface StatItemProps {
  target: number;
  label: string;
  accent?: "orange" | "lime" | "default";
}

function StatCounter({ target, label, accent = "default" }: StatItemProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return;
          observer.unobserve(e.target);

          const duration = 1800;
          const start = performance.now();
          const tick = (now: number) => {
            const p = Math.min((now - start) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            el.textContent = Math.floor(eased * target).toLocaleString();
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        });
      },
      { threshold: 0.5 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [target]);

  const colorClass =
    accent === "orange" ? "text-orange" : accent === "lime" ? "text-lime" : "";

  return (
    <div className="reveal">
      <div
        ref={ref}
        className={`font-display text-6xl md:text-7xl stat-num ${colorClass}`}
      >
        0
      </div>
      <div className="mono text-xs text-cream/60 mt-2">{label}</div>
    </div>
  );
}

const stats: StatItemProps[] = [
  { target: 547, label: "Active Members" },
  { target: 1280, label: "Group Runs", accent: "orange" },
  { target: 38420, label: "KM Run Together" },
  { target: 24, label: "Events Hosted", accent: "lime" },
];

export default function Stats() {
  return (
    <section className="bg-ink text-cream py-16 md:py-20 diagonal-top diagonal-bottom relative overflow-hidden">
      <div className="absolute inset-0 opacity-20 pointer-events-none">
        <div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(600px circle at 20% 50%, #FF5B1F, transparent 40%), radial-gradient(400px circle at 80% 30%, #D6FF4B, transparent 40%)",
          }}
        />
      </div>
      <div className="mx-auto max-w-7xl px-5 md:px-8 relative">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          {stats.map((stat) => (
            <StatCounter key={stat.label} {...stat} />
          ))}
        </div>
      </div>
    </section>
  );
}
