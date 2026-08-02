import { redirect } from "next/navigation";
import { demoCategories, demoProducts } from "./demo-data";
import { createSupabaseAdminClient } from "./supabase/admin";
import { createSupabaseServerClient } from "./supabase/server";
import { isDemoMode } from "./supabase/config";
import type { Category, LocalizedText, Product } from "./types";

/**
 * Admin reads. In demo mode (no Supabase) the portal renders fully with the
 * bundled catalog + sample orders so the family can preview it; mutations
 * are disabled by the actions layer.
 */

export interface AdminOrderRow {
  id: string;
  order_number: string;
  status: string;
  payment_method: string;
  payment_status: string;
  total: number;
  customer_name: string;
  customer_phone: string;
  fulfillment_type: string;
  address_text: string | null;
  created_at: string;
  order_items: {
    name_snapshot: string;
    qty: number;
    customization: { message?: string; scheduled_for?: string } | null;
  }[];
}

export interface AdminProductRow {
  id: string;
  slug: string;
  name: LocalizedText;
  category_id: string;
  base_price: number | null;
  compare_at_price: number | null;
  unit: LocalizedText | null;
  product_type: string;
  stock_status: string;
  is_eggless: boolean | null;
  is_featured: boolean;
  images: { path: string; thumb_path: string }[];
}

/** Ensures the viewer may see the admin: demo mode passes, else session required. */
export async function requireAdminOrRedirect(): Promise<"demo" | "member"> {
  if (isDemoMode()) return "demo";
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) redirect("/admin/login");
  return "member";
}

const DEMO_ORDERS: AdminOrderRow[] = [
  {
    id: "demo-1",
    order_number: "SB-260802-101",
    status: "received",
    payment_method: "cod",
    payment_status: "unpaid",
    total: 82000,
    customer_name: "Gurpreet Singh",
    customer_phone: "9876543210",
    fulfillment_type: "delivery",
    address_text: "House 12, Railway Road",
    created_at: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
    order_items: [
      {
        name_snapshot: "Black Forest Cake (1 kg)",
        qty: 1,
        customization: {
          message: "Happy Birthday Simar",
          scheduled_for: new Date(Date.now() + 30 * 3600 * 1000).toISOString(),
        },
      },
      { name_snapshot: "Cream Roll", qty: 6, customization: null },
    ],
  },
  {
    id: "demo-2",
    order_number: "SB-260802-100",
    status: "preparing",
    payment_method: "razorpay",
    payment_status: "paid",
    total: 24500,
    customer_name: "Neha Sharma",
    customer_phone: "9812345678",
    fulfillment_type: "pickup",
    address_text: null,
    created_at: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    order_items: [
      { name_snapshot: "Veg Patty", qty: 10, customization: null },
      { name_snapshot: "Fresh White Bread — 400 g", qty: 1, customization: null },
    ],
  },
  {
    id: "demo-3",
    order_number: "SB-260801-097",
    status: "delivered",
    payment_method: "cod",
    payment_status: "paid",
    total: 45000,
    customer_name: "Amandeep Kaur",
    customer_phone: "9988776655",
    fulfillment_type: "delivery",
    address_text: "Ward 4, Sabzi Mandi wali gali",
    created_at: new Date(Date.now() - 26 * 3600 * 1000).toISOString(),
    order_items: [
      { name_snapshot: "Pineapple Cake (1 kg)", qty: 1, customization: null },
    ],
  },
];

export async function getAdminOrders(): Promise<AdminOrderRow[]> {
  if (isDemoMode()) return DEMO_ORDERS;
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("orders")
    .select(
      `id, order_number, status, payment_method, payment_status, total,
       customer_name, customer_phone, fulfillment_type, address_text,
       created_at,
       order_items ( name_snapshot, qty, customization )`
    )
    .order("created_at", { ascending: false })
    .limit(50);
  return (data ?? []) as AdminOrderRow[];
}

export async function getAdminProducts(): Promise<AdminProductRow[]> {
  if (isDemoMode()) {
    return demoProducts.map((p) => ({
      id: p.id,
      slug: p.slug,
      name: p.name,
      category_id: p.category_id,
      base_price: p.base_price,
      compare_at_price: p.compare_at_price,
      unit: p.unit,
      product_type: p.product_type,
      stock_status: p.stock_status,
      is_eggless: p.is_eggless,
      is_featured: p.is_featured,
      images: p.images,
    }));
  }
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("products")
    .select(
      `id, slug, name, category_id, base_price, compare_at_price, unit,
       product_type, stock_status, is_eggless, is_featured,
       product_images ( path, thumb_path, sort_order )`
    )
    .order("sort_order");
  return (data ?? []).map(
    (p: Record<string, unknown> & { product_images?: { path: string; thumb_path: string; sort_order: number }[] }) => ({
      ...(p as unknown as AdminProductRow),
      images: (p.product_images ?? []).sort((a, b) => a.sort_order - b.sort_order),
    })
  );
}

export async function getAdminProduct(
  id: string
): Promise<AdminProductRow | null> {
  const products = await getAdminProducts();
  return products.find((p) => p.id === id) ?? null;
}

export async function getAdminCategories(): Promise<
  (Category & { is_active?: boolean; product_count: number })[]
> {
  const products = await getAdminProducts();
  const count = (id: string) =>
    products.filter((p) => p.category_id === id).length;

  if (isDemoMode()) {
    return demoCategories.map((c) => ({
      ...c,
      is_active: true,
      product_count: count(c.id),
    }));
  }
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("categories")
    .select("id, slug, name, image_path, sort_order, is_active")
    .order("sort_order");
  return (data ?? []).map((c: Category & { is_active: boolean }) => ({
    ...c,
    product_count: count(c.id),
  }));
}

export async function getShopSettings(): Promise<{
  accepting_orders: boolean;
  whatsapp_phone: string | null;
  phone: string | null;
}> {
  if (isDemoMode()) {
    return { accepting_orders: true, whatsapp_phone: null, phone: null };
  }
  const admin = createSupabaseAdminClient();
  const { data } = await admin
    .from("shops")
    .select("settings, whatsapp_phone, phone")
    .eq("is_active", true)
    .limit(1)
    .maybeSingle();
  return {
    accepting_orders: data?.settings?.accepting_orders !== false,
    whatsapp_phone: data?.whatsapp_phone ?? null,
    phone: data?.phone ?? null,
  };
}
