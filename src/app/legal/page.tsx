import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Mentions légales",
  description:
    "Mentions légales du site : éditeur, hébergement, propriété intellectuelle, protection des données (RGPD).",
};

export default function LegalPage() {
  return (
    <div className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-8">Mentions légales</h1>
      <p className="text-gray-600 text-sm mb-12">
        Conformément aux dispositions légales en vigueur, les informations ci-dessous sont portées à la connaissance des utilisateurs du site.
      </p>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          A. Éditeur du site
        </h2>
        <ul className="text-gray-700 space-y-2 list-none">
          <li><strong>Nom :</strong> Albert Bea</li>
          <li><strong>Statut :</strong> Auto-entrepreneur / Particulier</li>
          <li><strong>Siège social :</strong> Colombes, Douala, France/Cameroun</li>
          <li><strong>Contact :</strong> [Votre email professionnel]</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          B. Hébergement
        </h2>
        <ul className="text-gray-700 space-y-2 list-none">
          <li><strong>Hébergeur :</strong> Vercel Inc.</li>
          <li>
            <strong>Adresse :</strong> 440 N Barranca Ave #4133, Covina, CA 91723, USA
          </li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          C. Propriété intellectuelle
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Tous les contenus (textes, logos, générateur) sont la propriété exclusive de
          Générateur Factures. Toute reproduction, représentation ou exploitation, totale ou
          partielle, sans autorisation préalable écrite est interdite et constitue une
          contrefaçon.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-xl font-bold text-gray-900 mb-4">
          D. Protection des données (RGPD)
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Le générateur de factures fonctionne côté client. Aucune donnée saisie dans les
          formulaires de facturation n&apos;est stockée sur nos serveurs. Nous utilisons Google
          AdSense pour la publicité, qui peut collecter des cookies pour personnaliser les
          annonces. Vous pouvez gérer vos préférences de cookies via les paramètres de votre
          navigateur ou la bannière de consentement affichée sur le site.
        </p>
      </section>

      <p className="text-gray-500 text-sm border-t border-gray-200 pt-8">
        Dernière mise à jour : {new Date().toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
      </p>
    </div>
  );
}
