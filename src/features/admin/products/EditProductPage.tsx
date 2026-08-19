import { Navigate, useNavigate, useParams } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCategories } from '@/features/catalog/api';
import { getProductById, updateProduct } from '@/features/admin/products/api';
import { ProductForm } from '@/features/admin/products/ProductForm';

export function EditProductPage() {
  const { id = '' } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });
  const { data: product, isLoading } = useQuery({
    queryKey: ['admin', 'product', id],
    queryFn: () => getProductById(id),
  });

  if (isLoading) {
    return <p className="text-neutral-500 text-sm py-16 text-center">Loading…</p>;
  }
  if (!product) {
    return <Navigate to="/admin/products" replace />;
  }

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">Edit product</h1>
      <ProductForm
        categories={categories ?? []}
        initial={{
          name: product.name,
          description: product.description,
          pricePesewas: product.price_pesewas,
          stock: product.stock,
          categoryId: product.category_id,
          imageUrl: product.images[0] ?? '',
          published: product.published,
        }}
        submitLabel="Save changes"
        onSubmit={async (values) => {
          await updateProduct(id, values);
          queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
          queryClient.invalidateQueries({ queryKey: ['products'] });
          navigate('/admin/products');
        }}
      />
    </div>
  );
}
