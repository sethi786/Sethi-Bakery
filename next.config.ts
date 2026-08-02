import type { NextConfig } from "next";
import createNextIntlPlugin from "next-intl/plugin";

const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

const nextConfig: NextConfig = {
  images: {
    // We serve pre-sized WebP variants from Supabase Storage; skip Vercel's
    // optimizer to stay inside the free tier.
    unoptimized: true,
  },
};

export default withNextIntl(nextConfig);
