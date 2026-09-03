import { Link } from 'react-router-dom';
import { formatPrice } from '@/lib/money';
import { CategoryIcon } from '@/components/CategoryIcon';

type Props = {
  slug: string;
  name: string;
  description: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  categorySlug: string;
  stock: number;
};

export function ProductCard({ slug, name, description, price, compareAtPrice, image, categorySlug, stock }: Props) {
  const onSale = compareAtPrice != null && compareAtPrice > price;
  const percentOff = onSale ? Math.round((1 - price / compareAtPrice) * 100) : 0;

  return (
    <Link
      to={`/product/${slug}`}
      className="group flex flex-col bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all"
    >
      <div className="relative aspect-square bg-brand-50 flex items-center justify-center overflow-hidden">
        {onSale && (
          <span className="absolute top-2 left-2 z-10 bg-red-600 text-white text-[10px] font-bold uppercase tracking-wide px-1.5 py-0.5 rounded">
            -{percentOff}%
          </span>
        )}
        {image ? (
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <CategoryIcon slug={categorySlug} className="w-16 h-16 text-brand-300" />
        )}
      </div>
      <div className="p-3 flex flex-col gap-1">
        <span className="text-sm text-neutral-900 font-medium line-clamp-2">{name}</span>
        {description && <p className="text-xs text-neutral-500 line-clamp-2">{description}</p>}
        <div className="flex items-center justify-between mt-0.5">
          <span className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-brand-600">{formatPrice(price)}</span>
            {onSale && (
              <span className="text-xs text-neutral-400 line-through">{formatPrice(compareAtPrice)}</span>
            )}
          </span>
          {stock <= 0 && <span className="text-xs text-red-500">Out of stock</span>}
        </div>
      </div>
    </Link>
  );
}
