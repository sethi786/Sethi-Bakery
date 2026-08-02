/**
 * Single source of truth for the shop's real-world identity. Everything here
 * is a sensible placeholder the family can override via env vars without
 * touching code. Shown in the footer, contact page and structured data.
 */

export const shopConfig = {
  name: "Sethi Bakery",
  phone: process.env.NEXT_PUBLIC_SHOP_PHONE ?? "+91 98765 43210",
  phoneHref: `tel:${(process.env.NEXT_PUBLIC_SHOP_PHONE ?? "+919876543210").replace(/\s/g, "")}`,
  whatsapp: process.env.NEXT_PUBLIC_SHOP_WHATSAPP ?? "919876543210",
  address: {
    street: "Main Bazaar, Near Bus Stand",
    city: "Patti",
    district: "Tarn Taran",
    state: "Punjab",
    pincode: "143416",
    full: "Main Bazaar, Near Bus Stand, Patti, Distt. Tarn Taran, Punjab 143416",
  },
  geo: { lat: 31.2807, lng: 74.8574 },
  hours: { open: "7:00 AM", close: "9:00 PM", days: "Open all 7 days" },
  fssai: process.env.NEXT_PUBLIC_FSSAI_NUMBER ?? "", // shown when set
  instagram: process.env.NEXT_PUBLIC_INSTAGRAM ?? "",
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=31.2807,74.8574",
  osmEmbedUrl:
    "https://www.openstreetmap.org/export/embed.html?bbox=74.8374%2C31.2657%2C74.8774%2C31.2957&layer=mapnik&marker=31.2807%2C74.8574",
};
