import Link from 'next/link';
import { prisma } from '@/lib/prisma';
import { formatPrice } from '@/lib/money';
import { deleteProduct } from '../actions';

export default async function AdminProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const products = await prisma.product.findMany({
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold text-neutral-900">Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-neutral-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-neutral-800"
        >
          New product
        </Link>
      </div>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</p>}

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-neutral-50 text-neutral-500 text-left">
            <tr>
              <th className="px-4 py-2 font-medium">Name</th>
              <th className="px-4 py-2 font-medium">Category</th>
              <th className="px-4 py-2 font-medium">Price</th>
              <th className="px-4 py-2 font-medium">Stock</th>
              <th className="px-4 py-2 font-medium">Status</th>
              <th className="px-4 py-2 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {products.map((p) => (
              <tr key={p.id} className="border-t border-neutral-100">
                <td className="px-4 py-2 text-neutral-900">{p.name}</td>
                <td className="px-4 py-2 text-neutral-600">{p.category.name}</td>
                <td className="px-4 py-2 text-neutral-600">{formatPrice(p.price)}</td>
                <td className="px-4 py-2 text-neutral-600">{p.stock}</td>
                <td className="px-4 py-2">
                  <span
                    className={`text-xs px-2 py-0.5 rounded-full ${
                      p.published ? 'bg-green-50 text-green-700' : 'bg-neutral-100 text-neutral-500'
                    }`}
                  >
                    {p.published ? 'Published' : 'Hidden'}
                  </span>
                </td>
                <td className="px-4 py-2 text-right whitespace-nowrap">
                  <Link href={`/admin/products/${p.id}/edit`} className="text-indigo-600 hover:text-indigo-700 mr-3">
                    Edit
                  </Link>
                  <form action={deleteProduct.bind(null, p.id)} className="inline">
                    <button type="submit" className="text-red-500 hover:text-red-600">
                      Delete
                    </button>
                  </form>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">
                  No products yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
