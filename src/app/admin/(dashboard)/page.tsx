import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/money';

export default async function AdminDashboard() {
  const [productCount, orderCount, pendingCount, revenue] = await Promise.all([
    prisma.product.count(),
    prisma.order.count(),
    prisma.order.count({ where: { status: 'PENDING' } }),
    prisma.order.aggregate({ where: { status: { not: 'PENDING' } }, _sum: { totalAmount: true } }),
  ]);

  const stats = [
    { label: 'Products', value: productCount, href: '/admin/products' },
    { label: 'Orders', value: orderCount, href: '/admin/orders' },
    { label: 'Pending orders', value: pendingCount, href: '/admin/orders' },
    { label: 'Revenue', value: formatPrice(revenue._sum.totalAmount ?? 0), href: '/admin/orders' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-neutral-900">Dashboard</h1>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {stats.map((s) => (
          <Link
            key={s.label}
            href={s.href}
            className="bg-white border border-neutral-200 rounded-lg p-4 hover:border-neutral-300 transition-colors"
          >
            <p className="text-sm text-neutral-500">{s.label}</p>
            <p className="text-xl font-semibold text-neutral-900 mt-1">{s.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
