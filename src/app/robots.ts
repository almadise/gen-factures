import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? "https://votre-site.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: "/private/", // Zone admin ou pages sensibles (à créer si besoin)
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
