import Link from "next/link";

export default function Header() {
  return (
    <header role="banner" className="border-b border-slate-200 bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/80">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-4">
        <Link
          href="/"
          className="text-lg font-semibold text-slate-800 hover:text-primary-600 transition-colors"
        >
          Générateur Factures
        </Link>
        <nav aria-label="Navigation principale" className="flex flex-wrap items-center gap-4">
          <Link
            href="/"
            className="text-slate-600 hover:text-primary-600 transition-colors"
          >
            Accueil
          </Link>
          <Link
            href="/generateur-facture"
            className="rounded-lg bg-primary-600 px-4 py-2 text-sm font-medium text-white hover:bg-primary-700 transition-colors min-h-[44px] min-w-[44px] inline-flex items-center justify-center"
          >
            Créer une facture
          </Link>
          <Link
            href="/blog"
            className="text-slate-600 hover:text-primary-600 transition-colors"
          >
            Blog
          </Link>
          <Link
            href="/guide-facturation"
            className="text-slate-600 hover:text-primary-600 transition-colors"
          >
            Guide
          </Link>
        </nav>
      </div>
    </header>
  );
}
