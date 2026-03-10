import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://votre-site.com";

  // 1. Récupérer tous les articles de blog
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true, updatedAt: true },
  });

  // 2. Récupérer toutes les pages de niches
  const templates = await prisma.templatePage.findMany({
    select: { slug: true },
  });

  // 3. Pages statiques (Accueil, Blog, À propos, Contact, Mentions légales, Confidentialité)
  const staticPages: MetadataRoute.Sitemap = [
    { url: baseUrl, lastModified: new Date() },
    { url: `${baseUrl}/blog`, lastModified: new Date() },
    { url: `${baseUrl}/about`, lastModified: new Date() },
    { url: `${baseUrl}/contact`, lastModified: new Date() },
    { url: `${baseUrl}/legal`, lastModified: new Date() },
    { url: `${baseUrl}/privacy`, lastModified: new Date() },
    { url: `${baseUrl}/generateur-facture`, lastModified: new Date() },
  ];

  // 4. Articles de blog
  const postEntries: MetadataRoute.Sitemap = posts.map((post) => ({
    url: `${baseUrl}/blog/${post.slug}`,
    lastModified: post.updatedAt,
  }));

  // 5. Pages de niches (templates)
  const templateEntries: MetadataRoute.Sitemap = templates.map((template) => ({
    url: `${baseUrl}/${template.slug}`,
    lastModified: new Date(),
  }));

  return [...staticPages, ...postEntries, ...templateEntries];
}
