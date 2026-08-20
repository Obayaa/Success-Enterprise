import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';

const navLinkClass = ({ isActive }: { isActive: boolean }) =>
  `flex items-center gap-2.5 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
    isActive ? 'bg-ink text-white' : 'text-neutral-600 hover:text-ink hover:bg-neutral-100'
  }`;

function Icon({ path }: { path: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4 shrink-0">
      <path d={path} strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const NAV_ITEMS = [
  { to: '/admin', label: 'Dashboard', icon: 'M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9Z M9 22V12h6v10', end: true },
  { to: '/admin/products', label: 'Products', icon: 'M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16ZM3.27 6.96 12 12.01l8.73-5.05M12 22.08V12' },
  { to: '/admin/categories', label: 'Categories', icon: 'M20.59 13.41 13.42 20.58a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82ZM7 7h.01' },
  { to: '/admin/orders', label: 'Orders', icon: 'M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01' },
];

function SidebarNav({ onSignOut }: { onSignOut: () => void }) {
  return (
    <>
      <nav className="flex flex-col gap-1 px-3">
        {NAV_ITEMS.map((item) => (
          <NavLink key={item.to} to={item.to} end={item.end} className={navLinkClass}>
            <Icon path={item.icon} />
            {item.label}
          </NavLink>
        ))}
      </nav>
      <div className="mt-auto flex flex-col gap-1 px-3 pb-4 pt-3 border-t border-neutral-200">
        <Link to="/" className="px-3 py-2 rounded-md text-sm text-neutral-500 hover:text-ink hover:bg-neutral-100">
          View store
        </Link>
        <button
          type="button"
          onClick={onSignOut}
          className="text-left px-3 py-2 rounded-md text-sm text-neutral-500 hover:text-ink hover:bg-neutral-100"
        >
          Sign out
        </button>
      </div>
    </>
  );
}

function Brand() {
  return (
    <>
      <span className="font-display font-extrabold text-ink">
        <span className="sm:hidden">SE</span>
        <span className="hidden sm:inline">Success Enterprise</span>
      </span>
      <span className="text-[10px] font-semibold uppercase tracking-wide text-neutral-500 bg-neutral-100 px-1.5 py-0.5 rounded">
        Admin
      </span>
    </>
  );
}

export function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  useEffect(() => {
    setMobileNavOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    if (!mobileNavOpen) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setMobileNavOpen(false);
    }
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [mobileNavOpen]);

  async function handleSignOut() {
    await supabase.auth.signOut();
    navigate('/admin/login');
  }

  return (
    <div className="min-h-screen flex bg-neutral-50">
      <aside className="hidden sm:flex sm:flex-col w-56 shrink-0 border-r border-neutral-200 bg-white">
        <div className="flex items-center gap-2 px-4 py-4">
          <Brand />
        </div>
        <SidebarNav onSignOut={handleSignOut} />
      </aside>

      {mobileNavOpen && (
        <div className="fixed inset-0 z-40 sm:hidden">
          <div className="absolute inset-0 bg-ink/50" onClick={() => setMobileNavOpen(false)} />
          <aside className="absolute inset-y-0 left-0 w-64 max-w-[80vw] bg-white flex flex-col shadow-xl">
            <div className="flex items-center justify-between px-4 pt-4 pb-1">
              <div className="flex items-center gap-2">
                <Brand />
              </div>
              <button
                type="button"
                onClick={() => setMobileNavOpen(false)}
                aria-label="Close menu"
                className="p-1.5 -mr-1.5 rounded-md text-neutral-500 hover:text-ink hover:bg-neutral-100"
              >
                <Icon path="M18 6 6 18M6 6l12 12" />
              </button>
            </div>
            <div className="pt-3 flex flex-col flex-1">
              <SidebarNav onSignOut={handleSignOut} />
            </div>
          </aside>
        </div>
      )}

      <div className="flex-1 flex flex-col min-w-0">
        <header className="border-b border-neutral-200 bg-white sm:hidden">
          <div className="px-4 py-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => setMobileNavOpen(true)}
              aria-label="Open menu"
              className="p-2 -ml-2 rounded-md text-neutral-600 hover:text-ink hover:bg-neutral-100"
            >
              <Icon path="M4 6h16M4 12h16M4 18h16" />
            </button>
            <Brand />
          </div>
        </header>
        <main className="flex-1 w-full px-4 sm:px-6 py-8 max-w-5xl mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
