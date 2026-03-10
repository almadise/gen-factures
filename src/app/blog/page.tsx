import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const metadata = {
  title: "Blog — Guides et articles sur la facturation",
  description:
    "Articles et guides pour bien facturer : freelance, auto-entrepreneur, TPE. Conseils et modèles.",
};

export default async function BlogIndex() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <h1 className="text-4xl font-bold mb-4 text-gray-900 text-left uppercase">
        Guides & Conseils Facturation
      </h1>
      <p className="text-gray-600 mb-10 text-left">
        Tout ce qu&apos;il faut savoir pour gérer vos factures en toute conformité en 2026.
      </p>

      {posts.length === 0 ? (
        <div className="max-w-4xl mx-auto py-20 px-4 text-center">
          <div className="bg-blue-50 rounded-2xl p-12 border border-blue-100">
            <h2 className="text-2xl font-bold text-blue-900 mb-4">Nos guides arrivent bientôt !</h2>
            <p className="text-blue-700 mb-8">
              Nous préparons des articles détaillés pour vous aider à maîtriser votre facturation. En attendant,
              vous pouvez déjà utiliser notre outil gratuit.
            </p>
            <Link
              href="/"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors"
            >
              Créer ma première facture
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {posts.map((post) => (
            <article
              key={post.id}
              className="bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-shadow"
            >
              <div className="p-6 text-left">
                {post.category && (
                  <span className="text-xs font-bold text-blue-600 bg-blue-50 px-2 py-1 rounded uppercase">
                    {post.category.name}
                  </span>
                )}
                <h2 className="text-xl font-bold mt-3 mb-2 leading-tight">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="hover:text-blue-600"
                  >
                    {post.title}
                  </Link>
                </h2>
                <p className="text-gray-500 text-sm mb-4 line-clamp-3">
                  {post.excerpt}
                </p>
                <Link
                  href={`/blog/${post.slug}`}
                  className="text-sm font-bold text-gray-900 border-b-2 border-blue-600 pb-1"
                >
                  Lire l&apos;article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
