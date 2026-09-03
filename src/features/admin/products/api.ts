import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/slugify';
import type { Product, ProductWithCategory } from '@/types';

export async function getAllProducts(): Promise<ProductWithCategory[]> {
  const { data, error } = await supabase
    .from('products')
    .select('*, category:categories(*)')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return data as unknown as ProductWithCategory[];
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data, error } = await supabase.from('products').select('*').eq('id', id).maybeSingle();
  if (error) throw error;
  return data;
}

async function uniqueSlug(base: string, ignoreId?: string): Promise<string> {
  const baseSlug = slugify(base) || 'item';
  let slug = baseSlug;
  let n = 1;
  while (true) {
    const { data } = await supabase.from('products').select('id').eq('slug', slug).maybeSingle();
    if (!data || data.id === ignoreId) return slug;
    n += 1;
    slug = `${baseSlug}-${n}`;
  }
}

export type ProductInput = {
  name: string;
  description: string;
  pricePesewas: number;
  compareAtPricePesewas: number | null;
  stock: number;
  categoryId: string;
  imageUrl: string;
  published: boolean;
};

export async function createProduct(input: ProductInput): Promise<void> {
  const slug = await uniqueSlug(input.name);
  const { error } = await supabase.from('products').insert({
    name: input.name,
    slug,
    description: input.description,
    price_pesewas: input.pricePesewas,
    compare_at_price_pesewas: input.compareAtPricePesewas,
    stock: input.stock,
    category_id: input.categoryId,
    images: input.imageUrl ? [input.imageUrl] : [],
    published: input.published,
  });
  if (error) throw new Error(error.message);
}

export async function updateProduct(id: string, input: ProductInput): Promise<void> {
  const slug = await uniqueSlug(input.name, id);
  const { error } = await supabase
    .from('products')
    .update({
      name: input.name,
      slug,
      description: input.description,
      price_pesewas: input.pricePesewas,
      compare_at_price_pesewas: input.compareAtPricePesewas,
      stock: input.stock,
      category_id: input.categoryId,
      images: input.imageUrl ? [input.imageUrl] : [],
      published: input.published,
    })
    .eq('id', id);
  if (error) throw new Error(error.message);
}

export async function deleteProduct(id: string): Promise<void> {
  const { error } = await supabase.from('products').delete().eq('id', id);
  if (error) throw new Error('Cannot delete a product that has existing orders.');
}

export async function uploadProductImage(file: File): Promise<string> {
  const path = `${crypto.randomUUID()}-${file.name}`;
  const { error } = await supabase.storage.from('product-images').upload(path, file);
  if (error) throw new Error(error.message);
  const { data } = supabase.storage.from('product-images').getPublicUrl(path);
  return data.publicUrl;
}
