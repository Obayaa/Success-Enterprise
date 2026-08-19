'use client';

import { useMemo, useState } from 'react';
import { ProductCard } from '@/components/ProductCard';
import { CategoryIcon } from '@/components/CategoryIcon';

type Product = {
  id: string;
  slug: string;
  name: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  category: { slug: string; name: string };
};

type Category = { id: string; slug: string; name: string };

export function ProductBrowser({
  products,
  categories,
  initialCategory,
  initialQuery,
}: {
  products: Product[];
  categories: Category[];
  initialCategory?: string;
  initialQuery?: string;
}) {
  const [activeCategory, setActiveCategory] = useState<string | null>(initialCategory ?? null);
  const [query, setQuery] = useState(initialQuery ?? '');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const matchesCategory = !activeCategory || p.category.slug === activeCategory;
      const matchesQuery =
        !q || p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q);
      return matchesCategory && matchesQuery;
    });
  }, [products, activeCategory, query]);

  return (
    <div className="flex flex-col gap-6">
      <div className="relative">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth={1.5}
          className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-3.5-3.5" strokeLinecap="round" />
        </svg>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search products..."
          className="w-full border border-neutral-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white"
        />
      </div>

      <div className="flex gap-2 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveCategory(null)}
          className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border transition-colors ${
            activeCategory === null
              ? 'bg-neutral-900 text-white border-neutral-900'
              : 'border-neutral-300 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900'
          }`}
        >
          All
        </button>
        {categories.map((c) => (
          <button
            key={c.slug}
            onClick={() => setActiveCategory(c.slug)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm border transition-colors ${
              activeCategory === c.slug
                ? 'bg-neutral-900 text-white border-neutral-900'
                : 'border-neutral-300 text-neutral-700 hover:border-neutral-900 hover:text-neutral-900'
            }`}
          >
            <CategoryIcon slug={c.slug} className="w-4 h-4" />
            {c.name}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="text-neutral-500 text-sm py-12 text-center">
          No products match your search.
        </p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
          {filtered.map((p) => (
            <ProductCard
              key={p.id}
              slug={p.slug}
              name={p.name}
              price={p.price}
              image={p.images[0] ?? null}
              categorySlug={p.category.slug}
              stock={p.stock}
            />
          ))}
        </div>
      )}
    </div>
  );
}
