import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import InvoiceForm from "@/components/InvoiceForm";

const RESERVED_SLUGS = [
  "blog",
  "generateur-facture",
  "guide-facturation",
  "mentions-legales",
  "politique-confidentialite",
  "contact",
  "cgu",
  "api",
];

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  if (RESERVED_SLUGS.includes(slug)) return {};
  const template = await prisma.templatePage.findUnique({ where: { slug } });
  if (!template) return { title: "Page introuvable" };
  return {
    title: template.metaTitle ?? template.title,
    description: template.metaDesc ?? template.description.slice(0, 160),
  };
}

export default async function TemplatePage({ params }: Props) {
  const { slug } = await params;

  if (RESERVED_SLUGS.includes(slug)) {
    notFound();
  }

  // 1. Récupérer les données spécifiques à cette niche via le slug
  const template = await prisma.templatePage.findUnique({
    where: { slug },
  });

  // Si le slug n'existe pas en base, on renvoie une erreur 404 propre
  if (!template) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-white">
      {/* HEADER DE LA PAGE DE NICHE */}
      <header className="bg-blue-50 border-b py-12 px-4">
        <div className="max-w-5xl mx-auto">
          <Link href="/" className="text-blue-600 text-sm font-medium hover:underline">
            ← Retour à l&apos;accueil
          </Link>
          <h1 className="text-3xl md:text-5xl font-bold text-gray-900 mt-4">
            {template.title}
          </h1>
          <p className="text-lg text-gray-700 mt-4 max-w-3xl">
            {template.description}
          </p>
        </div>
      </header>

      {/* ZONE DU GÉNÉRATEUR */}
      <section className="max-w-5xl mx-auto py-12 px-4">
        <InvoiceForm />
        {template.defaultNotes && (
          <div className="mt-6 p-4 bg-blue-100 text-blue-800 rounded text-left text-sm max-w-2xl">
            <strong>Note suggérée pour ce modèle :</strong> {template.defaultNotes}
          </div>
        )}
      </section>

      {/* SECTION SEO / CONSEILS (Pour AdSense et l'utilisateur) */}
      <section className="max-w-3xl mx-auto py-12 px-4 border-t">
        <h2 className="text-2xl font-bold mb-6">Comment utiliser ce modèle de facture ?</h2>
        <div className="prose prose-blue text-gray-600">
          <p className="mb-4">
            Ce modèle est spécifiquement conçu pour les professionnels du secteur{" "}
            <strong>{template.industry}</strong>. Il inclut toutes les mentions légales
            obligatoires pour l&apos;année 2026.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>Vérifiez vos coordonnées et celles de votre client.</li>
            <li>Détaillez chaque prestation de service avec son prix HT.</li>
            <li>Le calcul de la TVA et du Total TTC est automatique.</li>
            <li>Téléchargez votre facture au format PDF sécurisé.</li>
          </ul>
        </div>
      </section>
    </div>
  );
}
