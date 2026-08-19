import { supabase } from '@/lib/supabase';
import { slugify } from '@/lib/slugify';

export type CategoryWithCount = {
  id: string;
  name: string;
  slug: string;
  productCount: number;
};

export async function getCategoriesWithCounts(): Promise<CategoryWithCount[]> {
  const { data, error } = await supabase
    .from('categories')
    .select('id, name, slug, products(count)')
    .order('name');
  if (error) throw error;
  return (data ?? []).map((c) => ({
    id: c.id,
    name: c.name,
    slug: c.slug,
    productCount: (c.products as { count: number }[] | null)?.[0]?.count ?? 0,
  }));
}

async function uniqueCategorySlug(base: string): Promise<string> {
  const baseSlug = slugify(base) || 'category';
  let slug = baseSlug;
  let n = 1;
  while (true) {
    const { data } = await supabase.from('categories').select('id').eq('slug', slug).maybeSingle();
    if (!data) return slug;
    n += 1;
    slug = `${baseSlug}-${n}`;
  }
}

export async function createCategory(name: string): Promise<void> {
  const slug = await uniqueCategorySlug(name);
  const { error } = await supabase.from('categories').insert({ name, slug });
  if (error) throw new Error(error.message);
}

export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('categories').delete().eq('id', id);
  if (error) throw new Error('Cannot delete a category that still has products.');
}
