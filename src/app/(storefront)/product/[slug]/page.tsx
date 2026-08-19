import { notFound } from "next/navigation";
import Link from "next/link";
import { getProductBySlug } from "@/lib/data";
import { formatPrice } from "@/lib/money";
import { AddToCartButton } from "@/components/AddToCartButton";
import { CategoryIcon } from "@/components/CategoryIcon";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = await getProductBySlug(slug);
  if (!product || !product.published) notFound();

  const image = product.images[0] ?? null;

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-6">
      <Link href="/" className="flex items-center gap-1 text-sm text-neutral-500 hover:text-neutral-900 w-fit">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} className="w-4 h-4">
          <path d="M15 19l-7-7 7-7" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Back to shop
      </Link>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="aspect-square bg-indigo-50 rounded-lg flex items-center justify-center overflow-hidden">
          {image ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={product.name} className="w-full h-full object-cover" />
          ) : (
            <CategoryIcon slug={product.category.slug} className="w-24 h-24 text-indigo-300" />
          )}
        </div>

        <div className="flex flex-col gap-4">
          <Link href={`/?category=${product.category.slug}`} className="text-sm text-neutral-500 hover:text-indigo-600 w-fit">
            {product.category.name}
          </Link>
          <h1 className="text-2xl font-semibold text-neutral-900">{product.name}</h1>
          <p className="text-xl font-semibold text-indigo-600">{formatPrice(product.price)}</p>
          <p className="text-neutral-600 whitespace-pre-line">{product.description}</p>
          <div>
            <AddToCartButton
              productId={product.id}
              name={product.name}
              slug={product.slug}
              price={product.price}
              image={image}
              stock={product.stock}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
