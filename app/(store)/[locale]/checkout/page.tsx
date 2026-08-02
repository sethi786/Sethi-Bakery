import { getTranslations, setRequestLocale } from "next-intl/server";
import { getDeliveryZones } from "@/lib/catalog";
import { isRazorpayEnabled } from "@/lib/razorpay";
import { CheckoutForm } from "@/components/storefront/CheckoutForm";

export const dynamic = "force-dynamic";

export default async function CheckoutPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("checkout");
  const zones = await getDeliveryZones();

  return (
    <div className="mx-auto max-w-5xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-cocoa">{t("title")}</h1>
      <div className="mt-6">
        <CheckoutForm zones={zones} razorpayEnabled={isRazorpayEnabled()} />
      </div>
    </div>
  );
}
