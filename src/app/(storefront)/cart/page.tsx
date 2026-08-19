'use client';

import Link from 'next/link';
import { useCartStore, cartTotal } from '@/lib/cart-store';
import { formatPrice } from '@/lib/money';
import { CategoryIcon } from '@/components/CategoryIcon';

export default function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = cartTotal(items);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center flex flex-col items-center gap-4">
        <p className="text-neutral-500">Your cart is empty.</p>
        <Link href="/" className="text-indigo-600 font-medium hover:text-indigo-700">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <h1 className="text-xl font-semibold text-neutral-900">Your Cart</h1>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 bg-white border border-neutral-200 rounded-lg p-3"
          >
            <div className="w-16 h-16 shrink-0 bg-indigo-50 rounded-md flex items-center justify-center overflow-hidden">
              {item.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <CategoryIcon slug="" className="w-8 h-8 text-indigo-300" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link href={`/product/${item.slug}`} className="text-sm font-medium text-neutral-900 hover:text-indigo-600 line-clamp-1">
                {item.name}
              </Link>
              <p className="text-sm text-neutral-500">{formatPrice(item.price)}</p>
            </div>

            <div className="flex items-center gap-2">
              <select
                value={item.quantity}
                onChange={(e) => setQuantity(item.productId, Number(e.target.value))}
                className="border border-neutral-300 rounded-md text-sm px-2 py-1"
              >
                {Array.from({ length: item.stock }, (_, i) => i + 1).map((n) => (
                  <option key={n} value={n}>
                    {n}
                  </option>
                ))}
              </select>
              <button
                onClick={() => removeItem(item.productId)}
                className="text-sm text-neutral-400 hover:text-red-500"
                aria-label="Remove item"
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t border-neutral-200 pt-4">
        <span className="text-neutral-600">Total</span>
        <span className="text-lg font-semibold text-neutral-900">{formatPrice(total)}</span>
      </div>

      <Link
        href="/checkout"
        className="bg-neutral-900 text-white text-center rounded-md py-3 text-sm font-medium hover:bg-neutral-800"
      >
        Checkout
      </Link>
    </div>
  );
}
