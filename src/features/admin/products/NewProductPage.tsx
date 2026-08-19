import { useNavigate } from 'react-router-dom';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCategories } from '@/features/catalog/api';
import { createProduct } from '@/features/admin/products/api';
import { ProductForm } from '@/features/admin/products/ProductForm';

export function NewProductPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: categories } = useQuery({ queryKey: ['categories'], queryFn: getCategories });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="font-display text-2xl font-bold text-ink">New product</h1>
      <ProductForm
        categories={categories ?? []}
        onSubmit={async (values) => {
          await createProduct(values);
          queryClient.invalidateQueries({ queryKey: ['admin', 'products'] });
          queryClient.invalidateQueries({ queryKey: ['products'] });
          navigate('/admin/products');
        }}
      />
    </div>
  );
}
