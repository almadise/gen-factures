import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await prisma.post.findUnique({ where: { slug } });
  if (!post) return { title: "Article introuvable" };
  return {
    title: post.metaTitle ?? post.title,
    description: post.metaDesc ?? post.excerpt,
  };
}

export default async function BlogPost({ params }: Props) {
  const { slug } = await params;
  const post = await prisma.post.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!post || !post.published) notFound();

  const contentHtml =
    post.content.trim().startsWith("<")
      ? post.content
      : formatContent(post.content);

  return (
    <article className="max-w-3xl mx-auto py-16 px-4">
      <header className="mb-10 text-left">
        {post.category && (
          <span className="text-blue-600 font-bold uppercase tracking-widest text-sm">
            {post.category.name}
          </span>
        )}
        <h1 className="text-4xl md:text-5xl font-extrabold mt-2 text-gray-900">
          {post.title}
        </h1>
        <p className="text-gray-500 mt-4 italic">
          Mis à jour le{" "}
          {new Date(post.updatedAt).toLocaleDateString("fr-FR", {
            day: "numeric",
            month: "long",
            year: "numeric",
          })}
        </p>
      </header>

      {/* ZONE PUB ADSENSE (Haut de page) */}
      <div className="w-full h-24 bg-gray-50 border border-dashed border-gray-200 flex items-center justify-center mb-8 text-gray-400 italic">
        Espace Publicitaire AdSense
      </div>

      <div className="prose prose-lg prose-blue max-w-none text-left leading-relaxed text-gray-800">
        <div dangerouslySetInnerHTML={{ __html: contentHtml }} />
      </div>

      {/* ZONE PUB ADSENSE (Bas de page) */}
      <div className="mt-12 p-8 bg-blue-600 rounded-2xl text-white text-center shadow-xl">
        <h3 className="text-2xl font-bold mb-2">
          Besoin d&apos;une facture rapide ?
        </h3>
        <p className="mb-6 opacity-90 text-sm font-medium">
          Utilisez notre générateur gratuit et exportez votre PDF en 30 secondes.
        </p>
        <Link
          href="/generateur-facture"
          className="inline-block bg-white text-blue-600 font-bold py-3 px-8 rounded-lg shadow-md hover:bg-gray-100 transition-colors"
        >
          Générer ma facture
        </Link>
      </div>
    </article>
  );
}

/** Si le contenu n'est pas du HTML, on l'échappe et on préserve les paragraphes. */
function formatContent(content: string): string {
  return content
    .split("\n\n")
    .map((p) => `<p>${escapeHtml(p.replace(/\n/g, " "))}</p>`)
    .join("\n");
}

function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    "&": "&amp;",
    "<": "&lt;",
    ">": "&gt;",
    '"': "&quot;",
    "'": "&#039;",
  };
  return text.replace(/[&<>"']/g, (c) => map[c] ?? c);
}
