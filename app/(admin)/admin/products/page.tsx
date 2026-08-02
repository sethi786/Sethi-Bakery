import { redirect } from "next/navigation";
import { toggleStock } from "@/lib/admin-actions";
import { formatPaise } from "@/lib/money";
import { isDemoMode } from "@/lib/supabase/config";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export const dynamic = "force-dynamic";

export default async function AdminProductsPage() {
  if (isDemoMode()) redirect("/admin/login");

  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");

  const admin = createSupabaseAdminClient();
  const { data: products } = await admin
    .from("products")
    .select("id, name, base_price, stock_status, product_type")
    .neq("stock_status", "hidden")
    .order("sort_order");

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-cocoa">Products</h1>
      <p className="mt-1 text-sm text-cocoa-light">
        Tap the switch to mark something out of stock — the website updates
        instantly.
      </p>
      <div className="mt-4 space-y-2">
        {(products ?? []).map((product) => {
          const inStock = product.stock_status === "in_stock";
          return (
            <form
              key={product.id}
              action={toggleStock.bind(null, product.id, !inStock)}
              className="flex items-center justify-between gap-3 rounded-card bg-white p-4 shadow-warm"
            >
              <div>
                <p className="font-semibold text-cocoa">{product.name?.en}</p>
                <p className="text-xs text-cocoa-light">
                  {product.base_price != null
                    ? formatPaise(product.base_price) +
                      (product.product_type === "custom_cake" ? " / kg" : "")
                    : "Variants"}
                </p>
              </div>
              <button
                type="submit"
                role="switch"
                aria-checked={inStock}
                className={`relative h-8 w-14 rounded-full transition-colors ${
                  inStock ? "bg-pistachio" : "bg-cocoa/20"
                }`}
              >
                <span
                  className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${
                    inStock ? "left-7" : "left-1"
                  }`}
                />
              </button>
            </form>
          );
        })}
      </div>
    </div>
  );
}
