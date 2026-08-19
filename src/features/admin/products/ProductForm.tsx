import { useState } from 'react';
import { uploadProductImage } from '@/features/admin/products/api';

type Category = { id: string; name: string };

export type ProductFormValues = {
  name: string;
  description: string;
  pricePesewas: number;
  stock: number;
  categoryId: string;
  imageUrl: string;
  published: boolean;
};

type Props = {
  categories: Category[];
  initial?: Partial<ProductFormValues>;
  submitLabel?: string;
  onSubmit: (values: ProductFormValues) => Promise<void>;
};

const fieldClass =
  'border border-neutral-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:border-transparent';
const labelClass = 'text-sm font-semibold text-neutral-700';

export function ProductForm({ categories, initial, submitLabel = 'Save', onSubmit }: Props) {
  const [imageUrl, setImageUrl] = useState(initial?.imageUrl ?? '');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleImageChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setError(null);
    try {
      setImageUrl(await uploadProductImage(file));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Image upload failed.');
    } finally {
      setUploading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    const formData = new FormData(e.currentTarget);
    setSubmitting(true);
    try {
      await onSubmit({
        name: String(formData.get('name') ?? '').trim(),
        description: String(formData.get('description') ?? '').trim(),
        pricePesewas: Math.round(Number(formData.get('price')) * 100),
        stock: Number(formData.get('stock') ?? 0),
        categoryId: String(formData.get('categoryId') ?? ''),
        imageUrl,
        published: formData.get('published') === 'on',
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
      setSubmitting(false);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="bg-white border border-neutral-200 rounded-xl p-6 sm:p-8 max-w-3xl grid grid-cols-1 sm:grid-cols-[1fr_260px] gap-8"
    >
      <div className="flex flex-col gap-4 order-2 sm:order-1">
        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Name</label>
          <input name="name" required defaultValue={initial?.name} className={fieldClass} />
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Description</label>
          <textarea name="description" rows={4} defaultValue={initial?.description} className={fieldClass} />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Price (GH₵)</label>
            <input
              name="price"
              type="number"
              step="0.01"
              min="0"
              required
              defaultValue={initial?.pricePesewas != null ? (initial.pricePesewas / 100).toFixed(2) : undefined}
              className={fieldClass}
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className={labelClass}>Stock</label>
            <input name="stock" type="number" min="0" required defaultValue={initial?.stock} className={fieldClass} />
          </div>
        </div>

        <div className="flex flex-col gap-1.5">
          <label className={labelClass}>Category</label>
          <select name="categoryId" required defaultValue={initial?.categoryId} className={fieldClass}>
            <option value="" disabled>
              Select a category
            </option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <label className="flex items-center gap-2 text-sm text-neutral-600 mt-1">
          <input name="published" type="checkbox" defaultChecked={initial?.published ?? true} className="accent-ink" />
          Published (visible in store)
        </label>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={submitting || uploading}
          className="bg-neutral-900 text-white rounded-md py-2.5 text-sm font-medium hover:bg-neutral-800 w-fit px-6 disabled:opacity-50 mt-2"
        >
          {submitting ? 'Saving…' : submitLabel}
        </button>
      </div>

      <div className="order-1 sm:order-2 flex flex-col gap-3">
        <span className={labelClass}>Product image</span>
        <div className="aspect-square w-full rounded-lg border border-dashed border-neutral-300 bg-neutral-50 flex items-center justify-center overflow-hidden">
          {imageUrl ? (
            <img src={imageUrl} alt="" className="w-full h-full object-cover" />
          ) : (
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.3} className="w-10 h-10 text-neutral-300">
              <rect x="3" y="4" width="18" height="16" rx="2" />
              <circle cx="8.5" cy="9.5" r="1.5" />
              <path d="m3 16 5-5 4 4 3-3 6 6" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </div>

        <label className="text-sm font-medium text-neutral-700 bg-white border border-neutral-300 rounded-md px-3 py-2 text-center cursor-pointer hover:bg-neutral-50">
          {uploading ? 'Uploading…' : imageUrl ? 'Replace photo' : 'Upload photo'}
          <input type="file" accept="image/*" onChange={handleImageChange} className="hidden" disabled={uploading} />
        </label>

        <input
          type="url"
          value={imageUrl}
          onChange={(e) => setImageUrl(e.target.value)}
          placeholder="or paste an image URL"
          className={`${fieldClass} text-xs`}
        />
      </div>
    </form>
  );
}
