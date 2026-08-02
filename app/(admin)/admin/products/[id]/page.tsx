import { notFound } from "next/navigation";
import {
  getAdminCategories,
  getAdminProduct,
  requireAdminOrRedirect,
} from "@/lib/admin-data";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const mode = await requireAdminOrRedirect();
  const { id } = await params;
  const [product, categories] = await Promise.all([
    getAdminProduct(id),
    getAdminCategories(),
  ]);
  if (!product) notFound();

  return (
    <div>
      <a href="/admin/products" className="text-sm font-semibold text-caramel">
        ← Products
      </a>
      <h1 className="font-display mb-5 mt-2 text-2xl font-bold text-cocoa">
        Edit: {product.name.en}
      </h1>
      <ProductForm
        product={product}
        categories={categories}
        demo={mode === "demo"}
      />
    </div>
  );
}
