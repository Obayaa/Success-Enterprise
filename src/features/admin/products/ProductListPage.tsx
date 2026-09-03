import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { deleteProduct, getAllProducts } from '@/features/admin/products/api';
import { formatPrice } from '@/lib/money';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export function ProductListPage() {
  const queryClient = useQueryClient();
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);
  const { data: products, isLoading, error } = useQuery({
    queryKey: ['admin', 'products'],
    queryFn: getAllProducts,
  });
  const deleteMutation = useMutation({
    mutationFn: deleteProduct,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
      queryClient.invalidateQueries({ queryKey: ['products'] });
    },
  });

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-ink">Products</h1>
        <Link
          to="/admin/products/new"
          className="bg-neutral-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-neutral-800"
        >
          New product
        </Link>
      </div>

      {deleteMutation.isError && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">
          {deleteMutation.error instanceof Error ? deleteMutation.error.message : 'Could not delete product.'}
        </p>
      )}

      <div className="bg-white border border-neutral-200 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
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
            {isLoading && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-neutral-500">
                  Loading…
                </td>
              </tr>
            )}
            {error && (
              <tr>
                <td colSpan={6} className="px-4 py-6 text-center text-red-600">
                  Couldn't load products.
                </td>
              </tr>
            )}
            {products?.map((p) => (
              <tr key={p.id} className="border-t border-neutral-100">
                <td className="px-4 py-2 text-neutral-900">{p.name}</td>
                <td className="px-4 py-2 text-neutral-600">{p.category?.name}</td>
                <td className="px-4 py-2 text-neutral-600">
                  {formatPrice(p.price_pesewas)}
                  {p.compare_at_price_pesewas != null && p.compare_at_price_pesewas > p.price_pesewas && (
                    <span className="ml-1.5 text-xs text-neutral-400 line-through">
                      {formatPrice(p.compare_at_price_pesewas)}
                    </span>
                  )}
                </td>
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
                  <Link to={`/admin/products/${p.id}/edit`} className="text-brand-600 hover:text-brand-700 mr-3">
                    Edit
                  </Link>
                  <button
                    onClick={() => setPendingDelete({ id: p.id, name: p.name })}
                    className="text-red-500 hover:text-red-600"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {products?.length === 0 && (
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

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete "${pendingDelete?.name}"?`}
        description="This can't be undone. Products with existing orders can't be deleted — hide them instead by unpublishing."
        confirmLabel="Delete"
        danger
        onConfirm={() => {
          if (pendingDelete) deleteMutation.mutate(pendingDelete.id);
          setPendingDelete(null);
        }}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
}
