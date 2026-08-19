'use client';

import { useState } from 'react';
import { useCartStore } from '@/lib/cart-store';

type Props = {
  productId: string;
  name: string;
  slug: string;
  price: number;
  image: string | null;
  stock: number;
};

export function AddToCartButton({ productId, name, slug, price, image, stock }: Props) {
  const addItem = useCartStore((s) => s.addItem);
  const [added, setAdded] = useState(false);

  if (stock <= 0) {
    return (
      <button disabled className="bg-neutral-200 text-neutral-500 rounded-md px-6 py-3 text-sm font-medium cursor-not-allowed">
        Out of stock
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        addItem({ productId, name, slug, price, image, stock });
        setAdded(true);
      }}
      className="bg-neutral-900 text-white rounded-md px-6 py-3 text-sm font-medium hover:bg-neutral-800"
    >
      {added ? 'Added ✓' : 'Add to cart'}
    </button>
  );
}
