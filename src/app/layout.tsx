import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: {
    default:
      "Générateur de factures en ligne gratuit | Pas d'inscription",
    template: "%s | Générateur Factures",
  },
  description:
    "Créez et téléchargez vos factures en PDF en quelques clics. Gratuit, sans inscription. Pour freelances et auto-entrepreneurs.",
  openGraph: {
    title: "Générateur de factures en ligne gratuit",
    description:
      "Créez et téléchargez vos factures en PDF en quelques clics. Gratuit, sans inscription.",
    locale: "fr_FR",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body className="min-h-screen antialiased">
        <Header />
        <main className="mx-auto max-w-6xl px-4 py-8">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
