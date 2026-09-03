import { useState } from 'react';
import { useCartStore } from '@/lib/cart-store';

type Props = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  compareAtPrice: number | null;
  image: string | null;
  stock: number;
};

export function AddToCartButton({ productId, name, slug, price, compareAtPrice, image, stock }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);

  if (stock <= 0) {
    return (
      <button disabled className="bg-neutral-200 text-neutral-500 rounded-md px-6 py-3 text-sm font-medium cursor-not-allowed">
        Out of stock
      </button>
    );
  }

  function changeQty(next: number) {
    setQty(Math.min(Math.max(next, 1), stock));
    setAdded(false);
  }

  return (
    <div className="flex items-center gap-3">
      <div className="flex items-center border border-neutral-300 rounded-md">
        <button
          type="button"
          onClick={() => changeQty(qty - 1)}
          disabled={qty <= 1}
          aria-label="Decrease quantity"
          className="w-9 h-11 flex items-center justify-center text-neutral-600 hover:text-ink disabled:opacity-30 disabled:hover:text-neutral-600"
        >
          −
        </button>
        <span className="w-8 text-center text-sm font-medium tabular-nums">{qty}</span>
        <button
          type="button"
          onClick={() => changeQty(qty + 1)}
          disabled={qty >= stock}
          aria-label="Increase quantity"
          className="w-9 h-11 flex items-center justify-center text-neutral-600 hover:text-ink disabled:opacity-30 disabled:hover:text-neutral-600"
        >
          +
        </button>
      </div>

      <button
        onClick={() => {
          addItem({ productId, name, slug, price, compareAtPrice, image, stock }, qty);
          setAdded(true);
        }}
        className="bg-neutral-900 text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-neutral-800"
      >
        {added ? 'Added ✓' : 'Add to cart'}
      </button>
    </div>
  );
}
