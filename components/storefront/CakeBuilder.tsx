"use client";

import { useMemo, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "@/i18n/navigation";
import { lt } from "@/lib/content";
import { formatPaise } from "@/lib/money";
import {
  MAX_CAKE_MESSAGE_LENGTH,
  minCakeDate,
  priceCake,
} from "@/lib/pricing";
import { useCart } from "@/lib/cart";
import type { CakeOptionGroup, Product } from "@/lib/types";

function toLocalInputValue(d: Date): string {
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export function CakeBuilder({
  product,
  groups,
}: {
  product: Product;
  groups: CakeOptionGroup[];
}) {
  const t = useTranslations("cake");
  const tp = useTranslations("product");
  const locale = useLocale();
  const router = useRouter();
  const add = useCart((s) => s.add);

  const selectGroups = groups.filter((g) => g.input_type === "single_select");
  const [selections, setSelections] = useState<Record<string, string>>(() =>
    Object.fromEntries(
      selectGroups.map((g) => [
        g.code,
        (g.options.find((o) => o.is_default) ?? g.options[0])?.id ?? "",
      ])
    )
  );
  const [message, setMessage] = useState("");
  const minDate = useMemo(() => minCakeDate(), []);
  const [scheduledFor, setScheduledFor] = useState(() =>
    toLocalInputValue(minDate)
  );

  const priced = useMemo(
    () => priceCake(product, groups, selections, locale),
    [product, groups, selections, locale]
  );

  const scheduleValid = new Date(scheduledFor).getTime() >= minDate.getTime();

  function addToCart() {
    if (!scheduleValid) return;
    add({
      key: `${product.id}:${JSON.stringify(selections)}:${message}:${scheduledFor}`,
      product_id: product.id,
      name: {
        en: `${product.name.en} (${priced.weightKg} kg)`,
      },
      unit_price: priced.total,
      qty: 1,
      customization: {
        selections,
        message: message || undefined,
        scheduled_for: new Date(scheduledFor).toISOString(),
        breakdown: priced.breakdown,
        total: priced.total,
      },
    });
    router.push("/cart");
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
      <div className="space-y-7">
        {selectGroups.map((group) => (
          <fieldset key={group.id}>
            <legend className="mb-2.5 text-sm font-semibold uppercase tracking-wide text-cocoa-light">
              {lt(group.name, locale)}
            </legend>
            <div className="flex flex-wrap gap-2">
              {group.options.map((option) => {
                const selected = selections[group.code] === option.id;
                return (
                  <button
                    key={option.id}
                    type="button"
                    onClick={() =>
                      setSelections((s) => ({ ...s, [group.code]: option.id }))
                    }
                    className={`rounded-full border px-4 py-2.5 text-sm font-medium transition-all active:scale-95 ${
                      selected
                        ? "border-cocoa bg-cocoa text-cream shadow-warm"
                        : "border-cocoa/15 bg-white text-cocoa hover:border-caramel"
                    }`}
                    aria-pressed={selected}
                  >
                    {lt(option.name, locale)}
                  </button>
                );
              })}
            </div>
          </fieldset>
        ))}

        <div>
          <label className="mb-2.5 block text-sm font-semibold uppercase tracking-wide text-cocoa-light">
            {lt(
              groups.find((g) => g.code === "message")?.name ?? {
                en: "Message on cake",
              },
              locale
            )}
          </label>
          <input
            type="text"
            value={message}
            maxLength={MAX_CAKE_MESSAGE_LENGTH}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t("messagePlaceholder")}
            className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-caramel"
          />
          <p className="mt-1.5 text-xs text-cocoa-light">{t("messageHint")}</p>
        </div>

        <div>
          <label className="mb-2.5 block text-sm font-semibold uppercase tracking-wide text-cocoa-light">
            {lt(
              groups.find((g) => g.code === "delivery_datetime")?.name ?? {
                en: "Needed by",
              },
              locale
            )}
          </label>
          <input
            type="datetime-local"
            value={scheduledFor}
            min={toLocalInputValue(minDate)}
            onChange={(e) => setScheduledFor(e.target.value)}
            className={`w-full rounded-xl border bg-white px-4 py-3 text-sm outline-none transition-colors focus:border-caramel ${
              scheduleValid ? "border-cocoa/15" : "border-berry"
            }`}
          />
          <p
            className={`mt-1.5 text-xs ${scheduleValid ? "text-cocoa-light" : "font-semibold text-berry"}`}
          >
            ⏱ {t("leadTime")}
          </p>
        </div>
      </div>

      {/* Live price panel */}
      <aside className="h-fit rounded-card bg-white p-6 shadow-warm lg:sticky lg:top-24">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-caramel">
          {t("priceLive")}
        </p>
        <p className="font-display mt-1 text-4xl font-bold text-cocoa">
          {formatPaise(priced.total)}
        </p>
        <ul className="mt-4 space-y-2 border-t border-cocoa/10 pt-4 text-sm text-cocoa-light">
          {priced.breakdown.map((line, i) => (
            <li key={i} className="flex justify-between gap-3">
              <span>{line.label}</span>
              {line.amount > 0 && <span>{formatPaise(line.amount)}</span>}
            </li>
          ))}
          {message && (
            <li className="flex justify-between gap-3">
              <span>✍️ “{message}”</span>
            </li>
          )}
        </ul>
        <button
          onClick={addToCart}
          disabled={!scheduleValid}
          className="mt-6 w-full rounded-full bg-caramel py-3.5 text-sm font-bold text-white shadow-warm transition-all hover:bg-gold active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-40"
        >
          {t("addToCart")} · {formatPaise(priced.total)}
        </button>
        <p className="mt-3 text-center text-xs text-cocoa-light">
          {product.is_eggless === false ? tp("withEgg") : ""}
        </p>
      </aside>
    </div>
  );
}
