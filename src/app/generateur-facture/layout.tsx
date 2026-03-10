import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Créer une facture en PDF",
  description:
    "Générateur de facture gratuit : remplissez le formulaire et téléchargez votre PDF immédiatement. Sans inscription.",
};

export default function GenerateurFactureLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
