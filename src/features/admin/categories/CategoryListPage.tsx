import { useState } from 'react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { createCategory, deleteCategory, getCategoriesWithCounts } from '@/features/admin/categories/api';
import { ConfirmDialog } from '@/components/ConfirmDialog';

export function CategoryListPage() {
  const queryClient = useQueryClient();
  const { data: categories, isLoading } = useQuery({
    queryKey: ['admin', 'categories'],
    queryFn: getCategoriesWithCounts,
  });
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pendingDelete, setPendingDelete] = useState<{ id: string; name: string } | null>(null);

  function invalidate() {
    queryClient.invalidateQueries({ queryKey: ['admin', 'categories'] });
    queryClient.invalidateQueries({ queryKey: ['categories'] });
  }

  const createMutation = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      setName('');
      invalidate();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteCategory,
    onSuccess: invalidate,
    onError: (err) => setError(err instanceof Error ? err.message : 'Could not delete category.'),
  });

  return (
    <div className="flex flex-col gap-6 max-w-lg">
      <h1 className="font-display text-2xl font-bold text-ink">Categories</h1>

      {error && <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-md p-3">{error}</p>}

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (name.trim()) createMutation.mutate(name.trim());
        }}
        className="flex gap-2"
      >
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
          placeholder="New category name"
          className="flex-1 border border-neutral-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
        />
        <button
          type="submit"
          className="bg-neutral-900 text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-neutral-800"
        >
          Add
        </button>
      </form>

      <div className="bg-white border border-neutral-200 rounded-lg divide-y divide-neutral-100">
        {isLoading && <p className="px-4 py-6 text-center text-neutral-500 text-sm">Loading…</p>}
        {categories?.map((c) => (
          <div key={c.id} className="flex items-center justify-between px-4 py-3 text-sm">
            <span className="text-neutral-900">{c.name}</span>
            <div className="flex items-center gap-3">
              <span className="text-neutral-400">{c.productCount} products</span>
              <button
                onClick={() => {
                  setError(null);
                  setPendingDelete({ id: c.id, name: c.name });
                }}
                className="text-red-500 hover:text-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {categories?.length === 0 && (
          <p className="px-4 py-6 text-center text-neutral-500 text-sm">No categories yet.</p>
        )}
      </div>

      <ConfirmDialog
        open={pendingDelete !== null}
        title={`Delete "${pendingDelete?.name}"?`}
        description="This can't be undone. Categories that still have products in them can't be deleted."
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
