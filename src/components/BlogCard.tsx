import Link from "next/link";

interface BlogCardProps {
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  category?: string;
}

export default function BlogCard({
  title,
  excerpt,
  slug,
  date,
  category = "Conseils",
}: BlogCardProps) {
  return (
    <Link href={`/blog/${slug}`} className="group">
      <div className="h-full bg-white border border-gray-200 rounded-2xl p-6 transition-all duration-300 hover:shadow-xl hover:border-blue-500 hover:-translate-y-1 flex flex-col">
        {/* Badge Catégorie */}
        <div className="mb-4">
          <span className="bg-blue-50 text-blue-600 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {category}
          </span>
        </div>

        {/* Titre */}
        <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
          {title}
        </h3>

        {/* Extrait (limité à 3 lignes) */}
        <p className="text-gray-600 text-sm mb-6 line-clamp-3 flex-grow">
          {excerpt}
        </p>

        {/* Footer de la carte */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-auto">
          <span className="text-xs text-gray-400 font-medium">
            {new Date(date).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </span>
          <span className="text-blue-600 font-bold text-sm flex items-center group-hover:translate-x-1 transition-transform">
            Lire l&apos;article
            <svg
              className="w-4 h-4 ml-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M9 5l7 7-7 7"
              />
            </svg>
          </span>
        </div>
      </div>
    </Link>
  );
}

