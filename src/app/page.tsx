import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  // 1. Récupération des niches mises en avant (isFeatured)
  const featuredTemplates = await prisma.templatePage.findMany({
    where: { isFeatured: true },
    take: 4, // On en prend 4 pour l'affichage
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* SECTION HÉRO : L'outil principal */}
      <section className="bg-white border-b py-16 px-4 text-center">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6">
          Générateur de Facture <span className="text-blue-600">Gratuit</span>
        </h1>
        <p className="text-xl text-gray-600 max-w-2xl mx-auto mb-10">
          Créez, personnalisez et téléchargez vos factures professionnelles en PDF en moins de 2 minutes.
          Sans inscription, conforme aux normes 2026.
        </p>

        {/* BOUTON D'ACTION PRINCIPAL */}
        <Link
          href="/generateur-facture"
          className="inline-block bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition-colors shadow-lg"
        >
          Créer ma facture maintenant
        </Link>
      </section>

      {/* SECTION NICHES : Vos pages métiers dynamiques */}
      <section className="max-w-6xl mx-auto py-16 px-4">
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Modèles adaptés à votre métier
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredTemplates.map((template) => (
            <Link
              key={template.id}
              href={`/${template.slug}`}
              className="group p-6 bg-white rounded-xl border border-gray-200 hover:border-blue-400 hover:shadow-md transition-all"
            >
              <div className="text-sm font-semibold text-blue-500 mb-2 uppercase tracking-wide">
                {template.industry}
              </div>
              <h3 className="text-lg font-bold text-gray-900 group-hover:text-blue-600">
                {template.title}
              </h3>
              <p className="text-gray-500 text-sm mt-2 line-clamp-2">
                {template.description}
              </p>
              <div className="mt-4 text-blue-600 text-sm font-medium flex items-center">
                Utiliser ce modèle →
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* SECTION RÉASSURANCE (SEO & AdSense) */}
      <section className="bg-gray-100 py-12">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Pourquoi utiliser notre outil ?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <div className="text-2xl mb-2">⚡</div>
              <h4 className="font-bold">Rapide</h4>
              <p className="text-sm text-gray-600">Pas de compte à créer, PDF généré instantanément.</p>
            </div>
            <div>
              <div className="text-2xl mb-2">🛡️</div>
              <h4 className="font-bold">Privé</h4>
              <p className="text-sm text-gray-600">Vos données restent dans votre navigateur.</p>
            </div>
            <div>
              <div className="text-2xl mb-2">✅</div>
              <h4 className="font-bold">Légal</h4>
              <p className="text-sm text-gray-600">Mentions obligatoires 2026 incluses par défaut.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
