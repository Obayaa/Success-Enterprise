import { prisma } from '@/lib/prisma';
import { createCategory, deleteCategory } from '../actions';

export default async function AdminCategoriesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const categories = await prisma.category.findMany({
    include: { _count: { select: { products: true } } },
    orderBy: { name: 'asc' },
  });

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <h1 className="text-2xl font-semibold text-neutral-900">Categories</h1>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</p>}

      <form action={createCategory} className="flex gap-2">
        <input
          name="name"
          required
          placeholder="New category name"
          className="flex-1 border border-neutral-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
        <button
          type="submit"
          className="bg-neutral-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-neutral-800"
        >
          Add
        </button>
      </form>

      <div className="bg-white border border-neutral-200 rounded-lg divide-y divide-neutral-100">
        {categories.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="text-neutral-900">{c.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-neutral-400">{c._count.products} products</span>
              <form action={deleteCategory.bind(null, c.id)}>
                <button type="submit" className="text-red-500 hover:text-red-600">
                  Delete
                </button>
              </form>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <p className="px-4 py-6 text-center text-neutral-500 text-sm">No categories yet.</p>
        )}
      </div>
    </div>
  );
}
