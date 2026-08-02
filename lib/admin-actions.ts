"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "./supabase/server";
import { createSupabaseAdminClient } from "./supabase/admin";
import { isDemoMode } from "./supabase/config";
import type { OrderStatus } from "./types";

/** Throws unless the request comes from a signed-in shop member. */
async function requireMember(): Promise<string> {
  const supabase = await createSupabaseServerClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in");
  const { data: membership } = await supabase
    .from("shop_members")
    .select("shop_id")
    .eq("user_id", user.id)
    .maybeSingle();
  if (!membership) throw new Error("Not a shop member");
  return membership.shop_id;
}

export async function signIn(formData: FormData) {
  const supabase = await createSupabaseServerClient();
  const { error } = await supabase.auth.signInWithPassword({
    email: String(formData.get("email")),
    password: String(formData.get("password")),
  });
  if (error) redirect("/admin/login?error=1");
  redirect("/admin/orders");
}

export async function signOut() {
  const supabase = await createSupabaseServerClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const STATUS_FLOW: OrderStatus[] = [
  "received",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
];

export async function advanceOrderStatus(orderId: string) {
  if (isDemoMode()) return;
  await requireMember();
  const admin = createSupabaseAdminClient();
  const { data: order } = await admin
    .from("orders")
    .select("id, status, fulfillment_type")
    .eq("id", orderId)
    .single();
  if (!order) return;

  const flow =
    order.fulfillment_type === "pickup"
      ? STATUS_FLOW.filter((s) => s !== "out_for_delivery")
      : STATUS_FLOW;
  const index = flow.indexOf(order.status as OrderStatus);
  const next = flow[index + 1];
  if (!next) return;

  await admin
    .from("orders")
    .update({ status: next, updated_at: new Date().toISOString() })
    .eq("id", orderId);
  await admin.from("order_events").insert({
    order_id: orderId,
    from_status: order.status,
    to_status: next,
    actor: "admin",
  });
  revalidatePath("/admin/orders");
}

export async function toggleStock(productId: string, inStock: boolean) {
  if (isDemoMode()) return;
  await requireMember();
  const admin = createSupabaseAdminClient();
  await admin
    .from("products")
    .update({ stock_status: inStock ? "in_stock" : "out_of_stock" })
    .eq("id", productId);
  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
}

export type ActionResult =
  | { ok: true; id?: string }
  | { ok: false; error: string };

const DEMO_ERROR = {
  ok: false as const,
  error: "Demo preview — connect the database to save changes.",
};

function slugify(name: string): string {
  return (
    name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 60) || "item"
  );
}

export interface ProductFormData {
  id?: string;
  name_en: string;
  name_pa?: string;
  name_hi?: string;
  description_en?: string;
  category_id: string;
  product_type: "simple" | "custom_cake";
  price_rupees: number;
  mrp_rupees?: number;
  unit?: string;
  is_eggless?: boolean;
  is_featured?: boolean;
  stock_status: "in_stock" | "out_of_stock" | "hidden";
  images: { path: string; thumb_path: string }[];
}

export async function saveProduct(form: ProductFormData): Promise<ActionResult> {
  if (isDemoMode()) return DEMO_ERROR;
  const shopId = await requireMember();
  if (!form.name_en?.trim()) return { ok: false, error: "Name is required." };
  if (!form.category_id) return { ok: false, error: "Pick a category." };
  if (!(form.price_rupees > 0)) return { ok: false, error: "Enter a price." };

  const admin = createSupabaseAdminClient();
  const name: Record<string, string> = { en: form.name_en.trim() };
  if (form.name_pa?.trim()) name.pa = form.name_pa.trim();
  if (form.name_hi?.trim()) name.hi = form.name_hi.trim();

  const row = {
    shop_id: shopId,
    category_id: form.category_id,
    name,
    description: form.description_en?.trim()
      ? { en: form.description_en.trim() }
      : null,
    product_type: form.product_type,
    base_price: Math.round(form.price_rupees * 100),
    compare_at_price: form.mrp_rupees ? Math.round(form.mrp_rupees * 100) : null,
    unit: form.unit?.trim() ? { en: form.unit.trim() } : null,
    is_eggless: form.is_eggless ?? null,
    is_featured: form.is_featured ?? false,
    stock_status: form.stock_status,
  };

  let productId = form.id;
  if (productId) {
    const { error } = await admin.from("products").update(row).eq("id", productId);
    if (error) return { ok: false, error: "Could not save — try again." };
  } else {
    // Unique-ify the slug on collision (e.g. two "Veg Patty" entries).
    let slug = slugify(form.name_en);
    const { data: clash } = await admin
      .from("products")
      .select("id")
      .eq("shop_id", shopId)
      .eq("slug", slug)
      .maybeSingle();
    if (clash) slug = `${slug}-${Math.floor(Math.random() * 900) + 100}`;
    const { data, error } = await admin
      .from("products")
      .insert({ ...row, slug })
      .select("id")
      .single();
    if (error || !data) return { ok: false, error: "Could not save — try again." };
    productId = data.id;
  }

  // Replace image rows with the submitted list (paths already uploaded).
  await admin.from("product_images").delete().eq("product_id", productId);
  if (form.images.length > 0) {
    await admin.from("product_images").insert(
      form.images.map((img, i) => ({
        product_id: productId,
        path: img.path,
        thumb_path: img.thumb_path,
        sort_order: i,
      }))
    );
  }

  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
  return { ok: true, id: productId };
}

export async function deleteProduct(productId: string): Promise<ActionResult> {
  if (isDemoMode()) return DEMO_ERROR;
  await requireMember();
  const admin = createSupabaseAdminClient();
  // Soft delete: hidden products disappear from the storefront but stay on
  // past orders.
  await admin
    .from("products")
    .update({ stock_status: "hidden" })
    .eq("id", productId);
  revalidatePath("/admin/products");
  revalidatePath("/", "layout");
  return { ok: true };
}

/**
 * Issues short-lived signed upload URLs for one product photo (master +
 * thumb). The client compresses to WebP before uploading.
 */
export async function createUploadUrls(): Promise<
  | {
      ok: true;
      master: { path: string; token: string };
      thumb: { path: string; token: string };
    }
  | { ok: false; error: string }
> {
  if (isDemoMode()) return DEMO_ERROR;
  await requireMember();
  const admin = createSupabaseAdminClient();
  const id = crypto.randomUUID();
  const masterPath = `products/${id}.webp`;
  const thumbPath = `products/${id}_thumb.webp`;
  const [master, thumb] = await Promise.all([
    admin.storage.from("product-images").createSignedUploadUrl(masterPath),
    admin.storage.from("product-images").createSignedUploadUrl(thumbPath),
  ]);
  if (master.error || thumb.error || !master.data || !thumb.data) {
    return { ok: false, error: "Could not prepare upload — try again." };
  }
  return {
    ok: true,
    master: { path: masterPath, token: master.data.token },
    thumb: { path: thumbPath, token: thumb.data.token },
  };
}

export async function saveCategory(form: {
  id?: string;
  name_en: string;
  name_pa?: string;
  name_hi?: string;
}): Promise<ActionResult> {
  if (isDemoMode()) return DEMO_ERROR;
  const shopId = await requireMember();
  if (!form.name_en?.trim()) return { ok: false, error: "Name is required." };
  const admin = createSupabaseAdminClient();
  const name: Record<string, string> = { en: form.name_en.trim() };
  if (form.name_pa?.trim()) name.pa = form.name_pa.trim();
  if (form.name_hi?.trim()) name.hi = form.name_hi.trim();

  if (form.id) {
    await admin.from("categories").update({ name }).eq("id", form.id);
    revalidatePath("/admin/categories");
    revalidatePath("/", "layout");
    return { ok: true, id: form.id };
  }
  const { data: last } = await admin
    .from("categories")
    .select("sort_order")
    .eq("shop_id", shopId)
    .order("sort_order", { ascending: false })
    .limit(1)
    .maybeSingle();
  const { data, error } = await admin
    .from("categories")
    .insert({
      shop_id: shopId,
      slug: slugify(form.name_en),
      name,
      sort_order: (last?.sort_order ?? 0) + 1,
    })
    .select("id")
    .single();
  if (error || !data) return { ok: false, error: "Could not save — try again." };
  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  return { ok: true, id: data.id };
}

export async function toggleCategory(
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  if (isDemoMode()) return DEMO_ERROR;
  await requireMember();
  const admin = createSupabaseAdminClient();
  await admin.from("categories").update({ is_active: isActive }).eq("id", id);
  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function moveCategory(
  id: string,
  direction: "up" | "down"
): Promise<ActionResult> {
  if (isDemoMode()) return DEMO_ERROR;
  const shopId = await requireMember();
  const admin = createSupabaseAdminClient();
  const { data: cats } = await admin
    .from("categories")
    .select("id, sort_order")
    .eq("shop_id", shopId)
    .order("sort_order");
  if (!cats) return { ok: false, error: "Not found" };
  const index = cats.findIndex((c) => c.id === id);
  const swapWith = direction === "up" ? index - 1 : index + 1;
  if (index < 0 || swapWith < 0 || swapWith >= cats.length) return { ok: true };
  await Promise.all([
    admin
      .from("categories")
      .update({ sort_order: cats[swapWith].sort_order })
      .eq("id", cats[index].id),
    admin
      .from("categories")
      .update({ sort_order: cats[index].sort_order })
      .eq("id", cats[swapWith].id),
  ]);
  revalidatePath("/admin/categories");
  revalidatePath("/", "layout");
  return { ok: true };
}

export async function saveSettings(form: {
  accepting_orders: boolean;
  whatsapp_phone?: string;
  phone?: string;
}): Promise<ActionResult> {
  if (isDemoMode()) return DEMO_ERROR;
  await requireMember();
  const admin = createSupabaseAdminClient();
  const { data: shop } = await admin
    .from("shops")
    .select("id, settings")
    .eq("is_active", true)
    .limit(1)
    .single();
  if (!shop) return { ok: false, error: "Shop not found" };
  await admin
    .from("shops")
    .update({
      settings: { ...shop.settings, accepting_orders: form.accepting_orders },
      whatsapp_phone: form.whatsapp_phone?.trim() || null,
      phone: form.phone?.trim() || null,
    })
    .eq("id", shop.id);
  revalidatePath("/admin/settings");
  return { ok: true };
}
