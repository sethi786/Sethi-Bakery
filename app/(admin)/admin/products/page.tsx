import {
  getAdminCategories,
  getAdminProducts,
  requireAdminOrRedirect,
} from "@/lib/admin-data";
import { ProductsList } from "@/components/admin/ProductsList";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  const mode = await requireAdminOrRedirect();
  const [products, categories] = await Promise.all([
    getAdminProducts(),
    getAdminCategories(),
  ]);

  return (
    <div>
      <div className="mb-4 flex items-center justify-between">
        <h1 className="font-display text-2xl font-bold text-cocoa">Products</h1>
        <a
          href="/admin/products/new"
          className="rounded-full bg-caramel px-5 py-2.5 text-sm font-bold text-white shadow-warm transition-transform active:scale-95"
        >
          + Add item
        </a>
      </div>
      <ProductsList
        products={products}
        categories={categories}
        demo={mode === "demo"}
      />
    </div>
  );
}
