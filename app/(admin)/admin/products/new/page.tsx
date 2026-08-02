import {
  getAdminCategories,
  requireAdminOrRedirect,
} from "@/lib/admin-data";
import { ProductForm } from "@/components/admin/ProductForm";

export const dynamic = "force-dynamic";

export default async function NewProductPage() {
  const mode = await requireAdminOrRedirect();
  const categories = await getAdminCategories();

  return (
    <div>
      <a href="/admin/products" className="text-sm font-semibold text-caramel">
        ← Products
      </a>
      <h1 className="font-display mb-1 mt-2 text-2xl font-bold text-cocoa">
        Add item
      </h1>
      <p className="mb-5 text-sm text-cocoa-light">
        Take a photo, type the name and price — done. The item appears on the
        website immediately.
      </p>
      <ProductForm product={null} categories={categories} demo={mode === "demo"} />
    </div>
  );
}
