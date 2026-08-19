import { NavLink } from 'react-router-dom';
import { useCartStore } from '@/lib/cart-store';
import { useAuth } from '@/features/admin/AuthContext';

export function Header() {
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const { session } = useAuth();

  return (
    <header className="border-b border-neutral-200 bg-white/90 backdrop-blur sticky top-0 z-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3.5 flex items-center justify-between">
        <NavLink to="/" className="font-display font-extrabold text-lg tracking-tight text-ink">
          Success Enterprise
        </NavLink>
        <div className="flex items-center gap-1">
        {session && (
          <NavLink
            to="/admin"
            className="flex items-center gap-1.5 px-3 h-10 rounded-full text-sm font-medium text-neutral-700 hover:text-ink hover:bg-neutral-100 transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4">
              <path d="M4 20v-1a6 6 0 0 1 6-6h0a6 6 0 0 1 6 6v1M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8Z" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Admin
          </NavLink>
        )}
        <NavLink
          to="/cart"
          aria-label={`Cart${itemCount > 0 ? `, ${itemCount} item${itemCount === 1 ? '' : 's'}` : ''}`}
          className={({ isActive }) =>
            `relative flex items-center justify-center w-10 h-10 rounded-full transition-colors ${
              isActive ? 'text-brand-600 bg-brand-50' : 'text-neutral-700 hover:text-ink hover:bg-neutral-100'
            }`
          }
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-5 h-5">
            <path
              d="M3 4h2l1.4 10.6a2 2 0 0 0 2 1.7h8.4a2 2 0 0 0 2-1.6L20.5 8H6.2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9.5" cy="20" r="1.4" fill="currentColor" stroke="none" />
            <circle cx="17" cy="20" r="1.4" fill="currentColor" stroke="none" />
          </svg>
          {itemCount > 0 && (
            <span className="absolute top-0 right-0 inline-flex items-center justify-center min-w-4.5 h-4.5 px-1 rounded-full bg-ink text-white text-[10px] font-bold leading-none">
              {itemCount}
            </span>
          )}
        </NavLink>
        </div>
      </div>
    </header>
  );
}
