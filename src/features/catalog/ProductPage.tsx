import { useQuery } from '@tanstack/react-query';
import { Link, Navigate, useParams } from 'react-router-dom';
import { getProductBySlug } from '@/features/catalog/api';
import { formatPrice } from '@/lib/money';
import { CategoryIcon } from '@/components/CategoryIcon';
import { AddToCartButton } from '@/features/cart/AddToCartButton';

export function ProductPage() {
  const { slug = '' } = useParams();
  const { data: product, isLoading, isError } = useQuery({
    queryKey: ['product', slug],
    queryFn: () => getProductBySlug(slug),
  });

  if (isLoading) {
    return <p className="text-neutral-500 text-sm py-16 text-center">Loading…</p>;
  }
  if (isError) {
    return <p className="text-red-600 text-sm py-16 text-center">Couldn't load this product.</p>;
  }
  if (!product) {
    return <Navigate to="/" replace />;
  }

  const image = product.images[0] ?? null;
  const onSale = product.compare_at_price_pesewas != null && product.compare_at_price_pesewas > product.price_pesewas;
  const percentOff = onSale
    ? Math.round((1 - product.price_pesewas / product.compare_at_price_pesewas!) * 100)
    : 0;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      <Link to="/" className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 w-fit">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-brand-50 rounded-lg flex items-center justify-center overflow-hidden">
          {image ? (
            <img src={image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <CategoryIcon slug={product.category.slug} className="w-24 h-24 text-brand-300" />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Link to={`/?category=${product.category.slug}`} className="text-sm text-neutral-500 hover:text-brand-600 w-fit">
            {product.category.name}
          </Link>
          <h1 className="font-display text-2xl font-bold text-ink">{product.name}</h1>
          <div className="flex items-center gap-2">
            <p className="text-xl font-semibold text-brand-600">{formatPrice(product.price_pesewas)}</p>
            {onSale && (
              <>
                <p className="text-base text-neutral-400 line-through">
                  {formatPrice(product.compare_at_price_pesewas!)}
                </p>
                <span className="bg-red-600 text-white text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded">
                  -{percentOff}%
                </span>
              </>
            )}
          </div>
          <p className="text-neutral-600 whitespace-pre-line">{product.description}</p>
          <div>
            <AddToCartButton
              productId={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price_pesewas}
              compareAtPrice={product.compare_at_price_pesewas}
              image={image}
              stock={product.stock}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
