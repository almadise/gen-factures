import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contactez-nous pour toute question sur le générateur de factures. Réponse rapide garantie.",
};

export default function ContactPage() {
  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">Contact</h1>
      <p className="text-gray-600 mb-10">
        Une question, un retour ou une suggestion ? Vous pouvez nous joindre facilement.
      </p>

      <section className="mb-10">
        <h2 className="text-lg font-bold text-gray-900 mb-4">Par email</h2>
        <p className="text-gray-700 mb-2">
          Pour toute demande, écrivez-nous à l&apos;adresse suivante :
        </p>
        <a
          href="mailto:atoisoitlagloire@gmail.com"
          className="text-blue-600 font-medium hover:underline break-all"
        >
          M&apos;écrire ici
        </a>
        <p className="text-gray-500 text-sm mt-4">
          Nous nous efforçons de répondre sous 48 h ouvrées.
        </p>
      </section>

      <section className="pt-8 border-t border-gray-200">
        <p className="text-gray-600 text-sm">
          Vous préférez commencer par créer une facture ?{" "}
          <Link href="/generateur-facture" className="text-blue-600 hover:underline font-medium">
            Accéder au générateur
          </Link>
        </p>
      </section>
    </div>
  );
}
