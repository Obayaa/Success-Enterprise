import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `px-3 py-1.5 rounded-full text-sm font-medium transition-colors ${
    isActive ? 'bg-ink text-white' : 'text-neutral-600 hover:text-ink hover:bg-neutral-100'
  }`;

export function AdminLayout() {
  const navigate = useNavigate();

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50">
      <header className="border-b border-neutral-200 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-x-6 gap-y-2 justify-between">
          <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
            <Link to="/admin" className="flex items-center gap-2">
              <span className="font-display font-extrabold text-ink">Success Enterprise</span>
              <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
                Admin
              </span>
            </Link>
            <nav className="flex items-center gap-1 -ml-1">
              <NavLink to="/admin/products" className={navLinkClass}>
                Products
              </NavLink>
              <NavLink to="/admin/categories" className={navLinkClass}>
                Categories
              </NavLink>
              <NavLink to="/admin/orders" className={navLinkClass}>
                Orders
              </NavLink>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Link to="/" className="text-sm text-neutral-500 hover:text-ink">
              View store
            </Link>
            <button onClick={handleSignOut} className="text-sm text-neutral-500 hover:text-ink">
              Sign out
            </button>
          </div>
        </div>
      </header>
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 py-8">
        <Outlet />
      </main>
    </div>
  );
}
