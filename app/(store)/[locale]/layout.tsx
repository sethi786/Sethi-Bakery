import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { notFound } from "next/navigation";
import { NextIntlClientProvider, hasLocale } from "next-intl";
import { setRequestLocale } from "next-intl/server";
import { routing } from "@/i18n/routing";
import { Header } from "@/components/storefront/Header";
import { Footer } from "@/components/storefront/Footer";
import { shopConfig } from "@/lib/shop-config";
import "@/app/globals.css";

const localBusinessJsonLd = {
  "@context": "https://schema.org",
  "@type": "Bakery",
  name: shopConfig.name,
  telephone: shopConfig.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: shopConfig.address.street,
    addressLocality: shopConfig.address.city,
    addressRegion: shopConfig.address.state,
    postalCode: shopConfig.address.pincode,
    addressCountry: "IN",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: shopConfig.geo.lat,
    longitude: shopConfig.geo.lng,
  },
  openingHours: "Mo-Su 07:00-21:00",
  servesCuisine: "Bakery",
  priceRange: "₹₹",
};

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});
const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Sethi Bakery — Fresh cakes, pastries & groceries in Patti, Punjab",
    template: "%s · Sethi Bakery",
  },
  description:
    "Order custom cakes, pastries, cream rolls, patties and daily groceries from Sethi Bakery near Bus Adda, Patti. Pickup or home delivery across Patti and nearby villages.",
  openGraph: {
    title: "Sethi Bakery · Patti, Punjab",
    description:
      "Custom cakes and fresh bakes, baked every morning near Bus Adda, Patti.",
    type: "website",
  },
};

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

export default async function StoreLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!hasLocale(routing.locales, locale)) notFound();
  setRequestLocale(locale);

  return (
    <html lang={locale} className={`${fraunces.variable} ${inter.variable}`}>
      <body>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
        <NextIntlClientProvider>
          <Header />
          <main className="min-h-[70vh]">{children}</main>
          <Footer />
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
