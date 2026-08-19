type Category = { id: string; name: string };

type Product = {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: string;
  images: string[];
  published: boolean;
};

export function ProductForm({
  categories,
  product,
  action,
}: {
  categories: Category[];
  product?: Product;
  action: (formData: FormData) => void;
}) {
  return (
    <form action={action} className="flex flex-col gap-4 max-w-lg">
      <div className="flex flex-col gap-1">
        <label className="text-sm text-neutral-600">Name</label>
        <input
          name="name"
          required
          defaultValue={product?.name}
          className="border border-neutral-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-neutral-600">Description</label>
        <textarea
          name="description"
          rows={3}
          defaultValue={product?.description}
          className="border border-neutral-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-600">Price (GH₵)</label>
          <input
            name="price"
            type="number"
            step="0.01"
            min="0"
            required
            defaultValue={product ? (product.price / 100).toFixed(2) : undefined}
            className="border border-neutral-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-sm text-neutral-600">Stock</label>
          <input
            name="stock"
            type="number"
            min="0"
            required
            defaultValue={product?.stock}
            className="border border-neutral-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-sm text-neutral-600">Category</label>
        <select
          name="categoryId"
          required
          defaultValue={product?.categoryId}
          className="border border-neutral-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
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

      <div className="flex flex-col gap-1">
        <label className="text-sm text-neutral-600">Image URL (optional)</label>
        <input
          name="imageUrl"
          type="url"
          defaultValue={product?.images[0]}
          placeholder="https://..."
          className="border border-neutral-300 rounded-md p-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-neutral-600">
        <input name="published" type="checkbox" defaultChecked={product?.published ?? true} />
        Published (visible in store)
      </label>

      <button
        type="submit"
        className="bg-neutral-900 text-white rounded-md py-2.5 text-sm font-medium hover:bg-neutral-800 w-fit px-6"
      >
        Save
      </button>
    </form>
  );
}
