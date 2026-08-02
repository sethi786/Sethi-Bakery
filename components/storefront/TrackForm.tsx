"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { IconSearch } from "@/components/icons";
import { trackOrder } from "@/lib/track";
import type { PlacedOrder } from "@/lib/types";
import { OrderView } from "./OrderView";

export function TrackForm() {
  const t = useTranslations("track");
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [state, setState] = useState<"idle" | "loading" | "notfound" | "found">(
    "idle"
  );
  const [order, setOrder] = useState<PlacedOrder | null>(null);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setState("loading");
    let found = await trackOrder(orderNumber, phone);

    // Demo mode / local orders: fall back to this browser's saved orders.
    if (!found) {
      try {
        const all = JSON.parse(localStorage.getItem("sb-orders") ?? "{}");
        const local = all[orderNumber.trim().toUpperCase()];
        if (
          local &&
          local.customer_phone === phone.replace(/\D/g, "").slice(-10)
        ) {
          found = local;
        }
      } catch {
        // ignore
      }
    }

    if (found) {
      setOrder(found);
      setState("found");
    } else {
      setState("notfound");
    }
  }

  if (state === "found" && order) {
    return <OrderView orderNumber={order.order_number} serverOrder={order} />;
  }

  const inputCls =
    "w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3.5 text-sm outline-none transition-colors focus:border-caramel";

  return (
    <form onSubmit={submit} className="space-y-3 rounded-card bg-white p-6 shadow-warm">
      <input
        required
        value={orderNumber}
        onChange={(e) => setOrderNumber(e.target.value)}
        placeholder={t("orderNumber")}
        className={`${inputCls} font-mono uppercase`}
      />
      <div className="flex">
        <span className="flex items-center rounded-l-xl border border-r-0 border-cocoa/15 bg-cream-deep px-3 text-sm font-semibold text-cocoa-light">
          +91
        </span>
        <input
          required
          inputMode="numeric"
          pattern="[6-9][0-9]{9}"
          maxLength={10}
          value={phone}
          onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))}
          placeholder={t("phone")}
          className={`${inputCls} rounded-l-none`}
        />
      </div>
      {state === "notfound" && (
        <p className="rounded-xl bg-berry/10 px-4 py-2.5 text-sm font-medium text-berry">
          {t("notFound")}
        </p>
      )}
      <button
        type="submit"
        disabled={state === "loading"}
        className="flex w-full items-center justify-center gap-2 rounded-full bg-caramel py-3.5 text-sm font-bold uppercase tracking-widest text-white shadow-warm transition-all hover:bg-gold active:scale-[0.98] disabled:opacity-50"
      >
        <IconSearch size={16} />
        {state === "loading" ? t("searching") : t("submit")}
      </button>
    </form>
  );
}
