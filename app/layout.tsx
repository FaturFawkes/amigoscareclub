import type { Metadata } from "next";
import { Anton, Manrope, Archivo } from "next/font/google";
import "./globals.css";

const anton = Anton({
  variable: "--font-anton",
  weight: "400",
  subsets: ["latin"],
});

const manrope = Manrope({
  variable: "--font-manrope",
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700", "800"],
});

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "600", "800", "900"],
});

export const metadata: Metadata = {
  title: "Amigos Care Club — Run With Fun",
  description:
    "A friendly, inclusive running community. Building a healthy lifestyle through fun and supportive running experiences.",
  other: {
    google: "notranslate",
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      translate="no"
      suppressHydrationWarning
      className={`${anton.variable} ${manrope.variable} ${archivo.variable}`}
    >
      <head suppressHydrationWarning>
        <meta name="google" content="notranslate" />
      </head>
      <body suppressHydrationWarning className="relative notranslate">
        {children}
      </body>
    </html>
  );
}
