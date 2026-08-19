import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/lib/supabase';
import { formatPrice } from '@/lib/money';

async function getStats() {
  const [{ count: productCount }, { count: orderCount }, { count: pendingCount }, revenueRes] = await Promise.all([
    supabase.from('products').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }),
    supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
    supabase.from('orders').select('total_pesewas').neq('status', 'pending'),
  ]);
  const revenue = (revenueRes.data ?? []).reduce((sum, o) => sum + o.total_pesewas, 0);
  return {
    productCount: productCount ?? 0,
    orderCount: orderCount ?? 0,
    pendingCount: pendingCount ?? 0,
    revenue,
  };
}

const SHORTCUTS = [
  {
    label: 'New product',
    href: '/admin/products/new',
    icon: <path d="M12 5v14m-7-7h14" strokeLinecap="round" />,
  },
  {
    label: 'New category',
    href: '/admin/categories',
    icon: <path d="M4 6h7l2 2h7v10a1 1 0 0 1-1 1H4a1 1 0 0 1-1-1V7a1 1 0 0 1 1-1Z" strokeLinecap="round" strokeLinejoin="round" />,
  },
  {
    label: 'Review pending orders',
    href: '/admin/orders',
    icon: <path d="M9 5h6m-8 0h10a1 1 0 0 1 1 1v14l-3-2-2 2-2-2-2 2-3-2V6a1 1 0 0 1 1-1Z" strokeLinecap="round" strokeLinejoin="round" />,
  },
];

export function DashboardPage() {
  const { data } = useQuery({ queryKey: ['admin', 'stats'], queryFn: getStats });

  const stats = [
    { label: 'Products', value: data?.productCount ?? '—', href: '/admin/products' },
    { label: 'Orders', value: data?.orderCount ?? '—', href: '/admin/orders' },
    { label: 'Pending orders', value: data?.pendingCount ?? '—', href: '/admin/orders' },
    { label: 'Revenue', value: data ? formatPrice(data.revenue) : '—', href: '/admin/orders' },
  ];

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl font-bold text-ink">Welcome back</h1>
        <p className="text-sm text-neutral-500">
          {data?.pendingCount
            ? `You have ${data.pendingCount} order${data.pendingCount === 1 ? '' : 's'} waiting on you.`
            : "Here's how the store is doing."}
        </p>
      </div>

      <div className="flex flex-wrap gap-3">
        {SHORTCUTS.map((s) => (
          <Link
            key={s.label}
            to={s.href}
            className="flex items-center gap-2 bg-white border border-neutral-200 rounded-lg px-4 py-2.5 text-sm font-medium text-neutral-700 hover:border-ink hover:text-ink transition-colors"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.75} className="w-4 h-4">
              {s.icon}
            </svg>
            {s.label}
          </Link>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <span className="text-xs font-semibold uppercase tracking-wide text-neutral-400">At a glance</span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {stats.map((s) => (
            <Link
              key={s.label}
              to={s.href}
              className="bg-white border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-colors"
            >
              <p className="text-sm text-neutral-500">{s.label}</p>
              <p className="text-xl font-semibold text-neutral-900 mt-1 tabular-nums">{s.value}</p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
