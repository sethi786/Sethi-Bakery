import { setRequestLocale } from "next-intl/server";
import { isDemoMode } from "@/lib/supabase/config";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { OrderView } from "@/components/storefront/OrderView";
import type { PlacedOrder } from "@/lib/types";

export const dynamic = "force-dynamic";

async function fetchOrder(
  orderNumber: string,
  token: string | undefined
): Promise<PlacedOrder | null> {
  if (isDemoMode() || !token) return null;
  const supabase = createSupabaseAdminClient();
  const { data: order } = await supabase
    .from("orders")
    .select(
      `order_number, access_token, status, payment_method, subtotal,
       delivery_fee, total, customer_name, customer_phone, fulfillment_type,
       address_text, created_at,
       order_items ( name_snapshot, qty, unit_price, line_total, customization )`
    )
    .eq("order_number", orderNumber)
    .eq("access_token", token)
    .maybeSingle();
  if (!order) return null;
  return {
    ...order,
    items: order.order_items.map(
      (i: {
        name_snapshot: string;
        qty: number;
        unit_price: number;
        line_total: number;
        customization: PlacedOrder["items"][number]["customization"];
      }) => ({
        name: i.name_snapshot,
        qty: i.qty,
        unit_price: i.unit_price,
        line_total: i.line_total,
        customization: i.customization ?? undefined,
      })
    ),
  } as PlacedOrder;
}

export default async function OrderPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; orderNumber: string }>;
  searchParams: Promise<{ t?: string }>;
}) {
  const { locale, orderNumber } = await params;
  const { t: token } = await searchParams;
  setRequestLocale(locale);

  const serverOrder = await fetchOrder(orderNumber, token);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <OrderView orderNumber={orderNumber} serverOrder={serverOrder} />
    </div>
  );
}
