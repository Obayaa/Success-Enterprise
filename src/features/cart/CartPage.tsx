import { Link } from 'react-router-dom';
import { useCartStore, cartTotal } from '@/lib/cart-store';
import { formatPrice } from '@/lib/money';
import { CategoryIcon } from '@/components/CategoryIcon';

export function CartPage() {
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const total = cartTotal(items);

  if (items.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center flex flex-col items-center gap-4">
        <p className="text-neutral-500">Your cart is empty.</p>
        <Link to="/" className="text-brand-600 font-medium hover:text-brand-700">
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <h1 className="font-display text-xl font-bold text-ink">Your Cart</h1>
        <Link to="/" className="flex items-center gap-1 text-sm text-neutral-500 hover:text-ink shrink-0">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
            <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Continue shopping
        </Link>
      </div>

      <div className="flex flex-col gap-3">
        {items.map((item) => (
          <div
            key={item.productId}
            className="flex items-center gap-4 bg-white border border-neutral-200 rounded-lg p-3"
          >
            <div className="w-16 h-16 shrink-0 bg-brand-50 rounded-md flex items-center justify-center overflow-hidden">
              {item.image ? (
                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <CategoryIcon slug="" className="w-8 h-8 text-brand-300" />
              )}
            </div>

            <div className="flex-1 min-w-0">
              <Link to={`/product/${item.slug}`} className="text-sm font-medium text-neutral-900 hover:text-brand-600 line-clamp-1">
                {item.name}
              </Link>
              <p className="flex items-baseline gap-1.5">
                <span className="text-sm text-neutral-500">{formatPrice(item.price)}</span>
                {item.compareAtPrice != null && item.compareAtPrice > item.price && (
                  <span className="text-xs text-neutral-400 line-through">{formatPrice(item.compareAtPrice)}</span>
                )}
              </p>
              <p className={`text-xs mt-0.5 ${item.stock <= 5 ? 'text-amber-600' : 'text-neutral-400'}`}>
                {item.stock <= 5 ? `Only ${item.stock} left in stock` : `${item.stock} in stock`}
              </p>
            </div>

            <div className="flex flex-col items-end gap-1.5">
              <div className="flex items-center border border-neutral-300 rounded-md">
                <button
                  type="button"
                  onClick={() => setQuantity(item.productId, item.quantity - 1)}
                  disabled={item.quantity <= 1}
                  aria-label={`Decrease quantity of ${item.name}`}
                  className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-ink disabled:opacity-30 disabled:hover:text-neutral-600"
                >
                  −
                </button>
                <span className="w-7 text-center text-sm font-medium tabular-nums">{item.quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(item.productId, item.quantity + 1)}
                  disabled={item.quantity >= item.stock}
                  aria-label={`Increase quantity of ${item.name}`}
                  className="w-7 h-7 flex items-center justify-center text-neutral-600 hover:text-ink disabled:opacity-30 disabled:hover:text-neutral-600"
                >
                  +
                </button>
              </div>
              <button
                onClick={() => removeItem(item.productId)}
                className="text-xs text-neutral-400 hover:text-red-500"
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
        to="/checkout"
        className="bg-neutral-900 text-white text-center rounded-md py-3 text-sm font-medium hover:bg-neutral-800"
      >
        Checkout
      </Link>
    </div>
  );
}
