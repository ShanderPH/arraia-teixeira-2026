import type { Metadata } from "next";
import { Alfa_Slab_One, Caveat, Nunito } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import MobileBottomBar from "@/components/MobileBottomBar";
import BackgroundMusic from "@/components/BackgroundMusic";

const nunito = Nunito({
  subsets: ["latin"],
  variable: "--font-nunito",
  display: "swap",
});

const alfaSlabOne = Alfa_Slab_One({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-alfa",
  display: "swap",
});

const caveat = Caveat({
  subsets: ["latin"],
  variable: "--font-caveat",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Arraia Teixeira 🎉",
    template: "%s | Arraia Teixeira",
  },
  description:
    "Confirme sua presença e escolha o prato que vai trazer para a melhor festa junina do pedaço!",
  keywords: ["festa junina", "arraia", "teixeira", "RSVP", "confirmação de presença"],
  openGraph: {
    title: "Arraia Teixeira 🎉",
    description: "A melhor festa junina do pedaço!",
    type: "website",
    locale: "pt_BR",
  },
  icons: {
    icon: [{ url: "/arraia-teixeira-logo.png", type: "image/png" }],
    shortcut: ["/arraia-teixeira-logo.png"],
    apple: ["/arraia-teixeira-logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="pt-BR"
      className={`${nunito.variable} ${alfaSlabOne.variable} ${caveat.variable} h-full`}
      data-theme="arraia"
    >
      <body
        className="min-h-full flex flex-col bg-background text-foreground font-[var(--font-nunito)] antialiased"
      >
        <Header />
        <main className="flex-1 w-full pb-20 md:pb-0">{children}</main>
        <Footer />
        {/* Bottom navigation bar — mobile only */}
        <MobileBottomBar />
        {/* Background music player — hidden YouTube audio */}
        <BackgroundMusic />
      </body>
    </html>
  );
}
