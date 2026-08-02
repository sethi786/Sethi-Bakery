import {
  getAdminCategories,
  requireAdminOrRedirect,
} from "@/lib/admin-data";
import { CategoriesManager } from "@/components/admin/CategoriesManager";

export const dynamic = "force-dynamic";

export default async function AdminCategoriesPage() {
  const mode = await requireAdminOrRedirect();
  const categories = await getAdminCategories();

  return (
    <div>
      <h1 className="font-display mb-1 text-2xl font-bold text-cocoa">
        Categories
      </h1>
      <p className="mb-5 text-sm text-cocoa-light">
        The order here is the order customers see on the website.
      </p>
      <CategoriesManager categories={categories} demo={mode === "demo"} />
    </div>
  );
}
