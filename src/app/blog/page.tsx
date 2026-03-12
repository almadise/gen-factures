import { prisma } from "@/lib/prisma";
import type { Post } from "@prisma/client";
import BlogCard from "@/components/BlogCard";

type PostWithCategory = Post & { category: { name: string } | null };

export const metadata = {
  title: "Blog — Guides et articles sur la facturation",
  description:
    "Articles et guides pour bien facturer : freelance, auto-entrepreneur, TPE. Conseils et modèles.",
};

export const revalidate = 3600;

export const dynamic = "force-dynamic";

export default async function BlogPage() {
  let posts: PostWithCategory[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      orderBy: { createdAt: "desc" },
      include: { category: true },
    });
  } catch (err) {
    console.error(
      "[Blog] Impossible de charger les articles. Vérifiez DATABASE_URL sur Vercel.",
      err
    );
  }

  return (
    <div className="max-w-6xl mx-auto py-12 px-4">
      <header className="text-center mb-16">
        <h1 className="text-4xl font-black text-gray-900 mb-4">
          GUIDES & CONSEILS FACTURATION
        </h1>
        <p className="text-gray-500 max-w-2xl mx-auto">
          Apprenez à gérer votre entreprise comme un pro avec nos guides pratiques mis à jour pour 2026.
        </p>
      </header>

      {posts.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <BlogCard
              key={post.id}
              title={post.title}
              excerpt={post.excerpt}
              slug={post.slug}
              date={post.createdAt.toString()}
              category={post.category?.name}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed">
          <p className="text-gray-400 italic">
            Nos experts rédigent de nouveaux articles... Repassez bientôt !
          </p>
        </div>
      )}
    </div>
  );
}
