import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 py-8 mt-20">
      <div className="max-w-6xl mx-auto px-4 text-center">
        <p className="text-gray-500 text-sm">
          © {new Date().getFullYear()} Générateur de Facture Gratuit. Tous droits réservés.
        </p>
        <p className="text-gray-400 text-xs mt-2 italic">
          Conçu avec passion par <strong>Albert Bea</strong>.
        </p>
        <p className="text-slate-600 text-sm mt-3">
          Outil gratuit, sans inscription. Aucune donnée n&apos;est stockée sur nos serveurs.
        </p>
        <nav
          className="mt-4 flex flex-wrap justify-center gap-x-6 gap-y-2 text-xs text-blue-600"
          aria-label="Pied de page"
        >
          <Link href="/about" className="hover:underline">
            À propos
          </Link>
          <Link href="/legal" className="hover:underline">
            Mentions légales
          </Link>
          <Link href="/blog" className="hover:underline">
            Blog
          </Link>
          <Link href="/contact" className="hover:underline">
            Contact
          </Link>
          <Link href="/privacy" className="hover:underline">
            Politique de confidentialité
          </Link>
        </nav>
      </div>
    </footer>
  );
}
