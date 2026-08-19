import { prisma } from '@/lib/prisma';
import { ProductForm } from '@/components/admin/ProductForm';
import { createProduct } from '../../actions';

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({ orderBy: { name: 'asc' } });

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold text-neutral-900">New product</h1>
      <ProductForm categories={categories} action={createProduct} />
    </div>
  );
}
