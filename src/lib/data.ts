import { prisma } from '@/lib/prisma';

export function getCategories() {
  return prisma.category.findMany({ orderBy: { name: 'asc' } });
}

export function getCategoryBySlug(slug: string) {
  return prisma.category.findUnique({ where: { slug } });
}

export function getPublishedProducts(categoryId?: string) {
  return prisma.product.findMany({
    where: { published: true, ...(categoryId ? { categoryId } : {}) },
    include: { category: true },
    orderBy: { createdAt: 'desc' },
  });
}

export function getProductBySlug(slug: string) {
  return prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });
}
