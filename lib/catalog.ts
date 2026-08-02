import { createClient } from "@supabase/supabase-js";
import {
  demoCakeOptionGroups,
  demoCategories,
  demoDeliveryZones,
  demoProducts,
} from "./demo-data";
import { isDemoMode } from "./supabase/config";
import type {
  CakeOptionGroup,
  Category,
  DeliveryZone,
  Product,
} from "./types";

/**
 * Read-only catalog access. In demo mode (no Supabase configured) it serves
 * the bundled sample data so the site works before the database exists.
 */

function publicClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false } }
  );
}

const PRODUCT_SELECT = `
  id, category_id, slug, name, description, product_type, base_price,
  compare_at_price, unit, is_eggless, stock_status, is_featured, tags,
  product_images ( path, thumb_path, alt, sort_order ),
  product_variants ( id, name, price, compare_at_price, is_default, sort_order )
`;

type ProductRow = Record<string, unknown> & {
  product_images?: { path: string; thumb_path: string; alt?: Product["name"]; sort_order: number }[];
  product_variants?: (Product["variants"][number] & { sort_order: number })[];
};

function mapProduct(row: ProductRow): Product {
  const images = (row.product_images ?? [])
    .sort((a, b) => a.sort_order - b.sort_order)
    .map(({ path, thumb_path, alt }) => ({ path, thumb_path, alt }));
  const variants = (row.product_variants ?? []).sort(
    (a, b) => a.sort_order - b.sort_order
  );
  return { ...(row as unknown as Product), images, variants };
}

export async function getCategories(): Promise<Category[]> {
  if (isDemoMode()) return demoCategories;
  const { data, error } = await publicClient()
    .from("categories")
    .select("id, slug, name, image_path, sort_order")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  return data as Category[];
}

export async function getProducts(opts?: {
  categorySlug?: string;
  featured?: boolean;
  search?: string;
}): Promise<Product[]> {
  if (isDemoMode()) {
    let items = demoProducts.filter((p) => p.stock_status !== "hidden");
    if (opts?.categorySlug) {
      const cat = demoCategories.find((c) => c.slug === opts.categorySlug);
      items = items.filter((p) => p.category_id === cat?.id);
    }
    if (opts?.featured) items = items.filter((p) => p.is_featured);
    if (opts?.search) {
      const q = opts.search.toLowerCase();
      items = items.filter((p) =>
        Object.values(p.name).some((n) => n?.toLowerCase().includes(q))
      );
    }
    return items;
  }

  let query = publicClient()
    .from("products")
    .select(PRODUCT_SELECT)
    .neq("stock_status", "hidden")
    .order("sort_order");
  if (opts?.categorySlug) {
    const { data: cat } = await publicClient()
      .from("categories")
      .select("id")
      .eq("slug", opts.categorySlug)
      .single();
    if (!cat) return [];
    query = query.eq("category_id", cat.id);
  }
  if (opts?.featured) query = query.eq("is_featured", true);
  if (opts?.search) query = query.ilike("name->>en", `%${opts.search}%`);
  const { data, error } = await query;
  if (error) throw error;
  return (data as ProductRow[]).map(mapProduct);
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  if (isDemoMode()) {
    return demoProducts.find((p) => p.slug === slug) ?? null;
  }
  const { data, error } = await publicClient()
    .from("products")
    .select(PRODUCT_SELECT)
    .eq("slug", slug)
    .neq("stock_status", "hidden")
    .maybeSingle();
  if (error) throw error;
  return data ? mapProduct(data as ProductRow) : null;
}

export async function getProductsByIds(ids: string[]): Promise<Product[]> {
  if (isDemoMode()) return demoProducts.filter((p) => ids.includes(p.id));
  if (ids.length === 0) return [];
  const { data, error } = await publicClient()
    .from("products")
    .select(PRODUCT_SELECT)
    .in("id", ids);
  if (error) throw error;
  return (data as ProductRow[]).map(mapProduct);
}

export async function getCakeOptionGroups(): Promise<CakeOptionGroup[]> {
  if (isDemoMode()) return demoCakeOptionGroups;
  const { data, error } = await publicClient()
    .from("option_groups")
    .select(
      `id, code, name, input_type, required, sort_order,
       options ( id, code, name, weight_kg, price_effect, amount, is_default, is_active, sort_order )`
    )
    .order("sort_order");
  if (error) throw error;
  return (data ?? []).map((g) => ({
    ...g,
    options: (g.options ?? [])
      .filter((o: { is_active: boolean }) => o.is_active)
      .sort(
        (a: { sort_order: number }, b: { sort_order: number }) =>
          a.sort_order - b.sort_order
      )
      .map((o: Record<string, unknown>) => ({
        ...o,
        amount: Number(o.amount),
        weight_kg: o.weight_kg === null ? null : Number(o.weight_kg),
      })),
  })) as unknown as CakeOptionGroup[];
}

export async function getDeliveryZones(): Promise<DeliveryZone[]> {
  if (isDemoMode()) return demoDeliveryZones;
  const { data, error } = await publicClient()
    .from("delivery_zones")
    .select("id, name, villages, fee, free_above")
    .eq("is_active", true)
    .order("sort_order");
  if (error) throw error;
  return data as DeliveryZone[];
}
