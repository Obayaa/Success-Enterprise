import { getCategories, getPublishedProducts } from "@/lib/data";
import { ProductBrowser } from "@/components/ProductBrowser";

export default async function Home({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; q?: string }>;
}) {
  const { category, q } = await searchParams;
  const [categories, products] = await Promise.all([
    getCategories(),
    getPublishedProducts(),
  ]);

  return (
    <div className="flex flex-col">
      <section className="bg-blue-900 text-white">
        <div className="max-w-5xl mx-auto px-4 py-14 flex flex-col gap-3">
          <h1 className="text-3xl sm:text-4xl font-semibold tracking-tight">
            Phones, laptops & accessories, sorted.
          </h1>
          <p className="text-neutral-300 max-w-md">
            Genuine devices, fair prices, fast delivery across Ghana.
          </p>
        </div>
      </section>

      <div className="max-w-5xl mx-auto px-4 py-8 w-full">
        <ProductBrowser
          products={products}
          categories={categories}
          initialCategory={category}
          initialQuery={q}
        />
      </div>
    </div>
  );
}
