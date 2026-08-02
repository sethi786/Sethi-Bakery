import { getTranslations, setRequestLocale } from "next-intl/server";
import { CartView } from "@/components/storefront/CartView";

export default async function CartPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cart");

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      <h1 className="font-display text-3xl font-bold text-cocoa">{t("title")}</h1>
      <div className="mt-6">
        <CartView />
      </div>
    </div>
  );
}
