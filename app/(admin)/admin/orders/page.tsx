import { advanceOrderStatus } from "@/lib/admin-actions";
import { getAdminOrders, requireAdminOrRedirect } from "@/lib/admin-data";
import { formatPaise } from "@/lib/money";

export const dynamic = "force-dynamic";

const NEXT_LABEL: Record<string, string> = {
  received: "Start preparing",
  preparing: "Mark ready",
  ready: "Out for delivery / picked up",
  out_for_delivery: "Mark delivered",
};

const STATUS_COLOR: Record<string, string> = {
  pending_payment: "bg-gold-light text-cocoa",
  received: "bg-berry/15 text-berry",
  preparing: "bg-caramel/15 text-caramel",
  ready: "bg-pistachio/20 text-pistachio",
  out_for_delivery: "bg-caramel/15 text-caramel",
  delivered: "bg-cocoa/10 text-cocoa-light",
  cancelled: "bg-cocoa/10 text-cocoa-light",
};

export default async function AdminOrdersPage() {
  const mode = await requireAdminOrRedirect();
  const orders = await getAdminOrders();

  return (
    <div>
      <h1 className="font-display text-2xl font-bold text-cocoa">Orders</h1>
      <div className="mt-4 space-y-3">
        {orders.length === 0 && (
          <p className="rounded-card bg-white p-6 text-center text-cocoa-light shadow-warm">
            No orders yet — they&apos;ll appear here the moment a customer
            checks out.
          </p>
        )}
        {orders.map((order) => (
          <div key={order.id} className="rounded-card bg-white p-4 shadow-warm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-mono text-sm font-bold text-cocoa">
                  {order.order_number}
                </p>
                <p className="mt-0.5 text-sm text-cocoa-light">
                  {order.customer_name} ·{" "}
                  <a
                    href={`tel:+91${order.customer_phone}`}
                    className="font-semibold text-caramel underline underline-offset-2"
                  >
                    {order.customer_phone}
                  </a>
                </p>
                <p className="mt-0.5 text-xs text-cocoa-light">
                  {order.fulfillment_type === "delivery"
                    ? `Delivery — ${order.address_text ?? ""}`
                    : "Pickup at shop"}
                  {" · "}
                  {order.payment_status === "paid"
                    ? "Paid online"
                    : "Collect payment"}
                </p>
              </div>
              <div className="text-right">
                <span
                  className={`inline-block rounded-full px-2.5 py-1 text-xs font-bold ${STATUS_COLOR[order.status] ?? ""}`}
                >
                  {order.status.replaceAll("_", " ")}
                </span>
                <p className="font-display mt-1 text-lg font-bold text-cocoa">
                  {formatPaise(order.total)}
                </p>
              </div>
            </div>
            <ul className="mt-3 space-y-1 border-t border-cocoa/10 pt-3 text-sm text-cocoa-light">
              {order.order_items.map((item, i) => (
                <li key={i}>
                  {item.qty} × {item.name_snapshot}
                  {item.customization?.message && (
                    <span className="block pl-4 text-xs">
                      Message: “{item.customization.message}”
                    </span>
                  )}
                  {item.customization?.scheduled_for && (
                    <span className="block pl-4 text-xs font-semibold text-berry">
                      Needed by{" "}
                      {new Date(item.customization.scheduled_for).toLocaleString(
                        "en-IN",
                        { dateStyle: "medium", timeStyle: "short" }
                      )}
                    </span>
                  )}
                </li>
              ))}
            </ul>
            {NEXT_LABEL[order.status] &&
              (mode === "demo" ? (
                <button
                  disabled
                  className="mt-3 w-full cursor-not-allowed rounded-full bg-cocoa/30 py-3 text-sm font-bold text-cream"
                >
                  {NEXT_LABEL[order.status]} → (demo)
                </button>
              ) : (
                <form
                  action={advanceOrderStatus.bind(null, order.id)}
                  className="mt-3"
                >
                  <button
                    type="submit"
                    className="w-full rounded-full bg-cocoa py-3 text-sm font-bold text-cream active:scale-[0.98]"
                  >
                    {NEXT_LABEL[order.status]} →
                  </button>
                </form>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
}
