import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "À propos — Générateur de factures",
  description:
    "Albert Bea, développeur. Mission : simplifier la facturation pour les indépendants. Privacy by Design, outil gratuit, aucune donnée stockée.",
};

export default function AboutPage() {
  return (
    <article className="max-w-3xl mx-auto py-16 px-4">
      <h1 className="text-4xl font-bold text-gray-900 mb-2">À propos</h1>
      <p className="text-gray-600 mb-10">
        Un humain compétent derrière l&apos;outil : transparence, expertise et mission claire.
      </p>

      {/* Photo (E-E-A-T) : ajoutez une image professionnelle pour renforcer la confiance */}
      {/* Décommentez et remplacez src par le chemin de votre photo (ex. /images/albert.jpg) */}
      {/* <div className="mb-10">
        <img
          src="/images/albert.jpg"
          alt="Albert Biboum Bi Bea"
          className="w-32 h-32 rounded-full object-cover border-4 border-blue-100"
        />
      </div> */}

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          La mission derrière ce projet
        </h2>
        <h3 className="text-lg font-semibold text-gray-800 mb-3">
          Pourquoi avoir créé ce générateur ?
        </h3>
        <div className="text-gray-700 leading-relaxed space-y-4">
          <p>
            Je m&apos;appelle <strong>Albert Bea</strong>. En tant que
            développeur, j&apos;ai souvent vu des freelances, des consultants et
            de petites entreprises perdre un temps précieux sur des outils de
            facturation complexes ou des tableurs Excel mal formatés.
          </p>
          <p>
            J&apos;ai décidé de créer cet outil pour répondre à un besoin
            universel : pouvoir générer une facture professionnelle, conforme aux
            normes 2026, en moins de 2 minutes et sans débourser un centime.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Ma philosophie : la &laquo;&nbsp;Privacy by Design&nbsp;&raquo;
        </h2>
        <div className="text-gray-700 leading-relaxed space-y-4">
          <p>
            Sur internet, la confiance est primordiale, surtout quand il s&apos;agit
            de vos revenus. C&apos;est pourquoi j&apos;ai conçu ce générateur avec
            une règle d&apos;or : <strong>vos données vous appartiennent</strong>.
          </p>
          <p>
            Contrairement à d&apos;autres services, aucune information saisie dans
            vos factures n&apos;est stockée sur mes serveurs. Tout le processus de
            création et de génération du PDF se passe localement, dans votre
            propre navigateur. C&apos;est la garantie d&apos;une confidentialité
            totale.
          </p>
        </div>
      </section>

      <section className="mb-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          Pourquoi est-ce gratuit ?
        </h2>
        <p className="text-gray-700 leading-relaxed">
          Mon objectif est de bâtir une ressource de référence pour les
          entrepreneurs. Ce site est financé par la publicité et l&apos;affiliation,
          ce qui me permet de maintenir l&apos;outil gratuit pour tous, tout en
          continuant à publier des guides légaux et des conseils de gestion pour
          vous aider à développer votre activité.
        </p>
      </section>

      {/* Ancrage local : décommentez et adaptez [Votre Ville/Région] */}
      {/* <section className="mb-12 p-4 bg-blue-50 rounded-xl border border-blue-100">
        <p className="text-gray-700 italic">
          J&apos;ai à cœur d&apos;aider les entrepreneurs de [Votre Ville/Région] à
          se professionnaliser grâce au numérique.
        </p>
      </section> */}

      {/* LinkedIn : remplacez l&apos;URL par votre profil */}
      {/*<section className="mb-12">
        <p className="text-gray-600 text-sm mb-3">
          Pour en savoir plus sur moi :
        </p>
        <a
          href="mailto:albert.bea@gmail.com"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-[#0A66C2] px-4 py-2.5 text-sm font-medium text-white hover:bg-[#004182] transition-colors"
        >
          <svg
            className="h-5 w-5"
            fill="currentColor"
            viewBox="0 0 24 24"
            aria-hidden
          >
            <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
          </svg>
          Me suivre sur LinkedIn
        </a>
       
      </section>*/}

      <p className="text-gray-500 text-sm border-t border-gray-200 pt-8">
        Merci de votre confiance. Bonne facturation.
      </p>
    </article>
  );
}
