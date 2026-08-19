'use client';

import Link from 'next/link';
import { useCartStore } from '@/lib/cart-store';

export function Header() {
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  return (
    <header className="border-b border-neutral-200 bg-white sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="font-semibold text-lg text-neutral-900">
          Success Enterprise
        </Link>
        <Link href="/cart" className="text-sm font-medium text-neutral-900">
          Cart{itemCount > 0 ? ` (${itemCount})` : ''}
        </Link>
      </div>
    </header>
  );
}
