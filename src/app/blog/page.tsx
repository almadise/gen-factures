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
        <div className="rounded-xl border border-gray-200 bg-gray-50 p-8 text-center">
          <p className="text-gray-600">Aucun article publié pour le moment.</p>
          <p className="mt-2">
            <Link href="/generateur-facture" className="text-blue-600 hover:underline">
              Créer une facture
            </Link>
            {" · "}
            <Link href="/" className="text-blue-600 hover:underline">
              Accueil
            </Link>
          </p>
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
