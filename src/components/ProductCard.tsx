import Link from 'next/link';
import { formatPrice } from '@/lib/money';
import { CategoryIcon } from '@/components/CategoryIcon';

type Props = {
  slug: string;
  name: string;
  price: number;
  image: string | null;
  categorySlug: string;
  stock: number;
};

export function ProductCard({ slug, name, price, image, categorySlug, stock }: Props) {
  return (
    <Link
      href={`/product/${slug}`}
      className="group flex flex-col bg-white border border-neutral-200 rounded-xl overflow-hidden hover:border-neutral-300 hover:shadow-md transition-all"
    >
      <div className="aspect-square bg-indigo-50 flex items-center justify-center overflow-hidden">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        ) : (
          <CategoryIcon slug={categorySlug} className="w-16 h-16 text-indigo-300" />
        )}
      </div>
      <div className="p-3 flex flex-col gap-1">
        <span className="text-sm text-neutral-900 font-medium line-clamp-2">{name}</span>
        <div className="flex items-center justify-between">
          <span className="text-sm font-semibold text-indigo-600">{formatPrice(price)}</span>
          {stock <= 0 && <span className="text-xs text-red-500">Out of stock</span>}
        </div>
      </div>
    </Link>
  );
}
