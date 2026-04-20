import Image from "next/image";
import Link from "next/link";

// Source image: 1280×720 (16:9)
const LOGO_W = 1280;
const LOGO_H = 720;
const RATIO = LOGO_W / LOGO_H; // ≈ 1.778

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
}

// Height-based sizing — width is derived from the real aspect ratio
const heights = {
  sm: { h: 36, text: "text-xl" },
  md: { h: 44, text: "text-2xl" },
  lg: { h: 56, text: "text-3xl" },
};

export default function Logo({ size = "sm", href = "#top" }: LogoProps) {
  const { h, text } = heights[size];
  const w = Math.round(h * RATIO); // e.g. 36 → 64, 44 → 78, 56 → 100

  const inner = (
    <div className="flex items-center gap-2.5">
      <div
        className="rounded-xl overflow-hidden flex-shrink-0 bg-black"
        style={{ width: w, height: h }}
      >
        <Image
          src="/amigos-logo.jpeg"
          alt="Amigos Care Club logo"
          width={LOGO_W}
          height={LOGO_H}
          style={{ width: w, height: h }}
          className="object-contain"
          priority
        />
      </div>
      <span className={`display ${text} tracking-wide leading-none`}>
        AMIGOS CARE CLUB<span className="text-orange">.</span>
      </span>
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="inline-flex">
        {inner}
      </Link>
    );
  }

  return inner;
}
