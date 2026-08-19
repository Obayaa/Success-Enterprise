'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';
import { slugify } from '@/lib/slugify';
import { OrderStatus } from '@/generated/prisma/enums';

async function requireAdmin() {
  const session = await auth();
  if (!session?.user) redirect('/admin/login');
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const baseSlug = slugify(base) || 'item';
  let slug = baseSlug;
  let n = 1;
  while (true) {
    const existing = await prisma.product.findUnique({ where: { slug } });
    if (!existing || existing.id === ignoreId) return slug;
    n += 1;
    slug = `${baseSlug}-${n}`;
  }
}

function toPesewas(value: FormDataEntryValue | null): number {
  const n = Number(value);
  return Math.round((Number.isFinite(n) ? n : 0) * 100);
}

export async function createProduct(formData: FormData) {
  await requireAdmin();

  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const price = toPesewas(formData.get('price'));
  const stock = Number(formData.get('stock') ?? 0);
  const categoryId = String(formData.get('categoryId') ?? '');
  const imageUrl = String(formData.get('imageUrl') ?? '').trim();
  const published = formData.get('published') === 'on';

  if (!name || !categoryId) throw new Error('Name and category are required.');

  const slug = await uniqueSlug(name);

  await prisma.product.create({
    data: {
      name,
      slug,
      description,
      price,
      stock,
      categoryId,
      images: imageUrl ? [imageUrl] : [],
      published,
    },
  });

  revalidatePath('/admin/products');
  revalidatePath('/');
  redirect('/admin/products');
}

export async function updateProduct(id: string, formData: FormData) {
  await requireAdmin();

  const name = String(formData.get('name') ?? '').trim();
  const description = String(formData.get('description') ?? '').trim();
  const price = toPesewas(formData.get('price'));
  const stock = Number(formData.get('stock') ?? 0);
  const categoryId = String(formData.get('categoryId') ?? '');
  const imageUrl = String(formData.get('imageUrl') ?? '').trim();
  const published = formData.get('published') === 'on';

  if (!name || !categoryId) throw new Error('Name and category are required.');

  const slug = await uniqueSlug(name, id);

  await prisma.product.update({
    where: { id },
    data: {
      name,
      slug,
      description,
      price,
      stock,
      categoryId,
      images: imageUrl ? [imageUrl] : [],
      published,
    },
  });

  revalidatePath('/admin/products');
  revalidatePath('/');
  redirect('/admin/products');
}

export async function deleteProduct(id: string) {
  await requireAdmin();
  try {
    await prisma.product.delete({ where: { id } });
  } catch {
    redirect('/admin/products?error=' + encodeURIComponent('Cannot delete a product that has existing orders.'));
  }
  revalidatePath('/admin/products');
  revalidatePath('/');
  redirect('/admin/products');
}

export async function createCategory(formData: FormData) {
  await requireAdmin();
  const name = String(formData.get('name') ?? '').trim();
  if (!name) throw new Error('Name is required.');

  const baseSlug = slugify(name) || 'category';
  let slug = baseSlug;
  let n = 1;
  while (await prisma.category.findUnique({ where: { slug } })) {
    n += 1;
    slug = `${baseSlug}-${n}`;
  }

  await prisma.category.create({ data: { name, slug } });
  revalidatePath('/admin/categories');
  revalidatePath('/');
  redirect('/admin/categories');
}

export async function deleteCategory(id: string) {
  await requireAdmin();
  try {
    await prisma.category.delete({ where: { id } });
  } catch {
    redirect('/admin/categories?error=' + encodeURIComponent('Cannot delete a category that still has products.'));
  }
  revalidatePath('/admin/categories');
  revalidatePath('/');
  redirect('/admin/categories');
}

export async function updateOrderStatus(orderId: string, status: string) {
  await requireAdmin();
  const valid = Object.values(OrderStatus);
  if (!valid.includes(status as OrderStatus)) throw new Error('Invalid status.');

  await prisma.order.update({ where: { id: orderId }, data: { status: status as OrderStatus } });
  revalidatePath('/admin/orders');
  revalidatePath(`/admin/orders/${orderId}`);
}
