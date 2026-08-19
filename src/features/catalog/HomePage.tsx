import { useQuery } from '@tanstack/react-query';
import { useSearchParams } from 'react-router-dom';
import { getCategories, getPublishedProducts } from '@/features/catalog/api';
import { ProductBrowser } from '@/features/catalog/ProductBrowser';
import heroImage from '@/assets/stock/ringlight-1.jpg';

const VALUE_PROPS = [
  {
    label: 'Fast delivery across Ghana',
    icon: <path d="M3 16V6a1 1 0 0 1 1-1h9v11M3 16h10m0 0h5.5M3 16a2 2 0 1 0 4 0m6-.0h4M17 16a2 2 0 1 0 4 0M13 8h4l3 3.5V16" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    label: 'Genuine, quality-checked products',
    icon: <path d="M12 3l7 3v5c0 4.5-3 7.5-7 9-4-1.5-7-4.5-7-9V6l7-3Zm-3 8 2 2 4-4" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    label: 'Secure payment — MoMo & card via Paystack',
    icon: <path d="M3 8h18M3 6h18a1 1 0 0 1 1 1v10a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Zm3 8h4" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

export function HomePage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const categoriesQuery = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  const productsQuery = useQuery({ queryKey: ['products'], queryFn: getPublishedProducts });

  return (
    <div className="flex flex-col">
      <section className="relative overflow-hidden text-white">
        <img src={heroImage} alt="" className="absolute inset-0 w-full h-full object-cover" />
        <div className="hero-glow absolute inset-0" />
        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 py-16 sm:py-24 flex flex-col gap-4">
          <h1 className="font-display font-extrabold text-4xl sm:text-5xl leading-[1.05] tracking-tight text-balance max-w-lg">
            IT &amp; content-creation gear, sorted.
          </h1>
          <p className="text-neutral-300 text-base sm:text-lg max-w-sm">
            Genuine accessories, fair prices, fast delivery across Ghana.
          </p>
        </div>
      </section>

      <div className="border-b border-neutral-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-5 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {VALUE_PROPS.map((v) => (
            <div key={v.label} className="flex items-center gap-3">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.6} className="w-6 h-6 shrink-0 text-brand-600">
                {v.icon}
              </svg>
              <span className="text-sm text-neutral-700">{v.label}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 w-full">
        {productsQuery.isLoading || categoriesQuery.isLoading ? (
          <p className="text-neutral-500 text-sm py-12 text-center">Loading products…</p>
        ) : productsQuery.isError || categoriesQuery.isError ? (
          <p className="text-red-600 text-sm py-12 text-center">Couldn't load products. Try refreshing.</p>
        ) : (
          <ProductBrowser
            products={productsQuery.data ?? []}
            categories={categoriesQuery.data ?? []}
            activeCategory={searchParams.get('category')}
            onCategoryChange={(slug) => setSearchParams(slug ? { category: slug } : {})}
            initialQuery={searchParams.get('q')}
          />
        )}
      </div>
    </div>
  );
}
