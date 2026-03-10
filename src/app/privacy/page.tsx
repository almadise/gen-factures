import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Politique de confidentialité",
  description:
    "Données de facturation traitées localement, aucun stockage sur nos serveurs. Cookies et AdSense. Conforme RGPD.",
};

export default function PrivacyPolicy() {
  return (
    <article className="max-w-4xl mx-auto py-16 px-4 text-left">
      <h1 className="text-3xl font-bold mb-8 text-gray-900">
        Politique de Confidentialité
      </h1>

      <section className="prose prose-blue max-w-none space-y-6 text-gray-700">
        <div>
          <h2 className="text-xl font-bold text-gray-900">
            1. Collecte des données de facturation
          </h2>
          <p>
            <strong>Protection absolue :</strong> Les données que vous saisissez
            dans notre générateur de factures (noms, adresses, montants,
            descriptions) sont traitées exclusivement localement dans votre
            navigateur via JavaScript.
          </p>
          <p className="bg-blue-50 p-4 border-l-4 border-blue-500 italic">
            Aucune donnée de facture n&apos;est transmise, stockée ou enregistrée
            sur nos serveurs. Nous ne voyons ni n&apos;enregistrons aucune donnée
            bancaire ou personnelle saisie. Une fois que vous fermez votre onglet,
            ces données sont effacées.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            2. Cookies et Publicités (Google AdSense)
          </h2>
          <p>
            Ce site utilise Google AdSense pour diffuser des annonces. Google
            utilise des cookies pour diffuser des annonces basées sur vos visites
            précédentes sur ce site ou sur d&apos;autres sites Web.
          </p>
          <ul className="list-disc pl-5 space-y-2">
            <li>
              L&apos;utilisation des cookies publicitaires par Google lui
              permet, ainsi qu&apos;à ses partenaires, de diffuser des annonces
              basées sur votre navigation.
            </li>
            <li>
              Vous pouvez choisir de désactiver la publicité personnalisée dans
              les{" "}
              <a
                href="https://www.google.com/settings/ads"
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                Paramètres des annonces Google
              </a>
              .
            </li>
          </ul>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">
            3. Fichiers journaux (Logs)
          </h2>
          <p>
            Comme la plupart des sites, nous pouvons collecter des données non
            identifiables telles que l&apos;adresse IP anonymisée, le type de
            navigateur et les pages visitées pour analyser l&apos;audience via
            des outils tels que Vercel Analytics ou Google Analytics, si ces
            services sont activés.
          </p>
        </div>

        <div>
          <h2 className="text-xl font-bold text-gray-900">4. Contact</h2>
          <p>
            Pour toute question concernant vos données, vous pouvez contacter{" "}
            <strong>Albert Biboum Bi Bea</strong> à l&apos;adresse suivante :{" "}
            <a
              href="mailto:[Votre email professionnel]"
              className="text-blue-600 underline"
            >
              [Votre email professionnel]
            </a>
            .
          </p>
        </div>
      </section>

      <p className="text-gray-500 text-sm mt-12 border-t border-gray-200 pt-6">
        Dernière mise à jour :{" "}
        {new Date().toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}
      </p>
    </article>
  );
}
