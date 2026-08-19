import { useEffect, useMemo, useRef, useState } from 'react';
import { ProductCard } from '@/features/catalog/ProductCard';
import { CategoryIcon } from '@/components/CategoryIcon';
import type { Category, ProductWithCategory } from '@/types';

export function ProductBrowser({
  products,
  categories,
  activeCategory,
  onCategoryChange,
  initialQuery,
}: {
  products: ProductWithCategory[];
  categories: Category[];
  activeCategory: string | null;
  onCategoryChange: (slug: string | null) => void;
  initialQuery?: string | null;
}) {
  const [query, setQuery] = useState(initialQuery ?? '');
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  function updateScrollState() {
    const el = scrollerRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 4);
    setCanScrollRight(el.scrollLeft + el.clientWidth < el.scrollWidth - 4);
  }

  useEffect(() => {
    updateScrollState();
    window.addEventListener('resize', updateScrollState);
    return () => window.removeEventListener('resize', updateScrollState);
  }, [categories]);

  function scrollByAmount(amount: number) {
    scrollerRef.current?.scrollBy({ left: amount, behavior: 'smooth' });
  }

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
          className="w-full border border-neutral-300 rounded-lg pl-10 pr-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent bg-white"
        />
      </div>

      <div className="relative -mx-4 sm:mx-0">
        {canScrollLeft && (
          <button
            type="button"
            onClick={() => scrollByAmount(-240)}
            aria-label="Scroll categories left"
            className="flex absolute left-0 top-0 bottom-1 z-10 items-center pl-1 pr-4 bg-linear-to-r from-neutral-50 to-transparent"
          >
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-neutral-300 text-neutral-600 hover:text-ink shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        )}
        <div
          ref={scrollerRef}
          onScroll={updateScrollState}
          className="flex gap-2 overflow-x-auto scrollbar-hide px-4 sm:px-0 pb-1"
        >
          <button
            onClick={() => onCategoryChange(null)}
            className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
              activeCategory === null
                ? 'bg-ink text-white border-ink'
                : 'border-neutral-300 text-neutral-700 hover:border-ink hover:text-ink'
            }`}
          >
            All
          </button>
          {categories.map((c) => (
            <button
              key={c.slug}
              onClick={() => onCategoryChange(c.slug)}
              className={`shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-full text-sm font-medium border transition-colors ${
                activeCategory === c.slug
                  ? 'bg-ink text-white border-ink'
                  : 'border-neutral-300 text-neutral-700 hover:border-ink hover:text-ink'
              }`}
            >
              <CategoryIcon slug={c.slug} className="w-4 h-4" />
              {c.name}
            </button>
          ))}
        </div>
        {canScrollRight && (
          <button
            type="button"
            onClick={() => scrollByAmount(240)}
            aria-label="Scroll categories right"
            className="flex absolute right-0 top-0 bottom-1 z-10 items-center pr-1 pl-4 bg-linear-to-l from-neutral-50 to-transparent"
          >
            <span className="w-7 h-7 flex items-center justify-center rounded-full bg-white border border-neutral-300 text-neutral-600 hover:text-ink shadow-sm">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
                <path d="M9 5l7 7-7 7" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </button>
        )}
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
              description={p.description}
              price={p.price_pesewas}
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
