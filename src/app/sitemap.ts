import type { MetadataRoute } from "next";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://votre-site.com";

  let posts: { slug: string; updatedAt: Date }[] = [];
  let templates: { slug: string }[] = [];
  try {
    posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true, updatedAt: true },
    });
    templates = await prisma.templatePage.findMany({
      select: { slug: true },
    });
  } catch {
    // Base indisponible au build : on retourne uniquement les pages statiques
  }

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
