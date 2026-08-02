import type {
  CakeOptionGroup,
  Category,
  DeliveryZone,
  Product,
} from "./types";

/**
 * Bundled sample catalog. Used automatically when Supabase env vars are not
 * configured ("demo mode") so the site can be deployed and previewed before
 * the database exists. Mirrors supabase/seed.sql — keep them in sync.
 */

export const demoCategories: Category[] = [
  { id: "cat-cakes", slug: "cakes", name: { en: "Cakes", pa: "ਕੇਕ", hi: "केक" }, image_path: null, sort_order: 0 },
  { id: "cat-pastries", slug: "pastries", name: { en: "Pastries", pa: "ਪੇਸਟਰੀ", hi: "पेस्ट्री" }, image_path: null, sort_order: 1 },
  { id: "cat-snacks", slug: "patties-snacks", name: { en: "Patties & Snacks", pa: "ਪੈਟੀਜ਼ ਅਤੇ ਸਨੈਕਸ", hi: "पैटीज़ और स्नैक्स" }, image_path: null, sort_order: 2 },
  { id: "cat-breads", slug: "breads", name: { en: "Breads & Rusk", pa: "ਬ੍ਰੈੱਡ ਅਤੇ ਰਸ", hi: "ब्रेड और रस्क" }, image_path: null, sort_order: 3 },
  { id: "cat-grocery", slug: "grocery", name: { en: "Grocery", pa: "ਕਰਿਆਨਾ", hi: "किराना" }, image_path: null, sort_order: 4 },
];

const p = (
  id: string,
  category_id: string,
  slug: string,
  name: Product["name"],
  overrides: Partial<Product> = {}
): Product => ({
  id,
  category_id,
  slug,
  name,
  description: null,
  product_type: "simple",
  base_price: null,
  compare_at_price: null,
  unit: null,
  is_eggless: null,
  stock_status: "in_stock",
  is_featured: false,
  tags: [],
  images: [],
  variants: [],
  ...overrides,
});

export const demoProducts: Product[] = [
  // ── Custom cakes (base_price = paise per kg) ──────────────────────────
  p("cake-black-forest", "cat-cakes", "black-forest-cake",
    { en: "Black Forest Cake", pa: "ਬਲੈਕ ਫੋਰੈਸਟ ਕੇਕ", hi: "ब्लैक फॉरेस्ट केक" }, {
    product_type: "custom_cake", base_price: 45000, is_featured: true,
    description: { en: "Classic layers of chocolate sponge, fresh cream and cherries — our bestseller for birthdays." },
    tags: ["bestseller"],
  }),
  p("cake-choco-truffle", "cat-cakes", "chocolate-truffle-cake",
    { en: "Chocolate Truffle Cake", pa: "ਚਾਕਲੇਟ ਟਰਫਲ ਕੇਕ", hi: "चॉकलेट ट्रफल केक" }, {
    product_type: "custom_cake", base_price: 55000, is_featured: true,
    description: { en: "Rich dark chocolate ganache over soft chocolate sponge. For serious chocolate lovers." },
  }),
  p("cake-pineapple", "cat-cakes", "pineapple-cake",
    { en: "Pineapple Cake", pa: "ਪਾਈਨੈਪਲ ਕੇਕ", hi: "पाइनएप्पल केक" }, {
    product_type: "custom_cake", base_price: 40000,
    description: { en: "Light vanilla sponge with fresh cream and juicy pineapple — the classic Punjabi celebration cake." },
  }),
  p("cake-red-velvet", "cat-cakes", "red-velvet-cake",
    { en: "Red Velvet Cake", pa: "ਰੈੱਡ ਵੈਲਵੇਟ ਕੇਕ", hi: "रेड वेलवेट केक" }, {
    product_type: "custom_cake", base_price: 60000, is_featured: true,
    description: { en: "Velvety red sponge with cream-cheese frosting. Premium choice for anniversaries." },
    tags: ["premium"],
  }),

  // ── Pastries ──────────────────────────────────────────────────────────
  p("pastry-choco", "cat-pastries", "chocolate-pastry",
    { en: "Chocolate Pastry", pa: "ਚਾਕਲੇਟ ਪੇਸਟਰੀ", hi: "चॉकलेट पेस्ट्री" }, {
    base_price: 3500, unit: { en: "per piece" }, is_eggless: false, is_featured: true,
  }),
  p("pastry-pineapple", "cat-pastries", "pineapple-pastry",
    { en: "Pineapple Pastry", pa: "ਪਾਈਨੈਪਲ ਪੇਸਟਰੀ", hi: "पाइनएप्पल पेस्ट्री" }, {
    base_price: 3000, unit: { en: "per piece" }, is_eggless: true,
  }),
  p("jam-roll", "cat-pastries", "jam-roll",
    { en: "Jam Roll", pa: "ਜੈਮ ਰੋਲ", hi: "जैम रोल" }, {
    base_price: 1500, unit: { en: "per piece" }, is_eggless: true, is_featured: true,
    description: { en: "Soft sponge rolled with sweet mixed-fruit jam — a Sethi Bakery signature." },
    tags: ["bestseller"],
  }),
  p("cream-roll", "cat-pastries", "cream-roll",
    { en: "Cream Roll", pa: "ਕਰੀਮ ਰੋਲ", hi: "क्रीम रोल" }, {
    base_price: 1200, unit: { en: "per piece" }, is_eggless: true, is_featured: true,
    description: { en: "Crispy flaky roll filled with fresh sweet cream. Best with evening chai." },
    tags: ["bestseller"],
  }),

  // ── Patties & snacks ─────────────────────────────────────────────────
  p("patty-veg", "cat-snacks", "veg-patty",
    { en: "Veg Patty", pa: "ਵੈਜ ਪੈਟੀ", hi: "वेज पैटी" }, {
    base_price: 2000, unit: { en: "per piece" }, is_eggless: true, is_featured: true,
    description: { en: "Golden flaky pastry stuffed with spiced potato-pea filling. Fresh batches all day." },
  }),
  p("patty-paneer", "cat-snacks", "paneer-patty",
    { en: "Paneer Patty", pa: "ਪਨੀਰ ਪੈਟੀ", hi: "पनीर पैटी" }, {
    base_price: 2500, unit: { en: "per piece" }, is_eggless: true,
  }),

  // ── Breads ────────────────────────────────────────────────────────────
  p("bread-white", "cat-breads", "fresh-white-bread",
    { en: "Fresh White Bread", pa: "ਤਾਜ਼ੀ ਵ੍ਹਾਈਟ ਬ੍ਰੈੱਡ", hi: "ताज़ी व्हाइट ब्रेड" }, {
    product_type: "variant", is_eggless: true,
    variants: [
      { id: "bread-white-400", name: { en: "400 g" }, price: 4000, compare_at_price: null, is_default: true },
      { id: "bread-white-800", name: { en: "800 g" }, price: 7500, compare_at_price: null, is_default: false },
    ],
  }),
  p("rusk-atta", "cat-breads", "atta-rusk",
    { en: "Atta Rusk", pa: "ਆਟਾ ਰਸ", hi: "आटा रस्क" }, {
    base_price: 6000, unit: { en: "500 g pack" }, is_eggless: true,
  }),

  // ── Grocery ───────────────────────────────────────────────────────────
  p("grocery-butter", "cat-grocery", "amul-butter-100g",
    { en: "Amul Butter 100 g", hi: "अमूल बटर 100 ग्राम" }, {
    base_price: 6000, compare_at_price: 6200, unit: { en: "100 g" },
  }),
  p("grocery-biscuits", "cat-grocery", "parle-g-family-pack",
    { en: "Parle-G Family Pack", hi: "पारले-जी फैमिली पैक" }, {
    base_price: 3000, unit: { en: "800 g" },
  }),
  p("grocery-namkeen", "cat-grocery", "punjabi-namkeen-mix",
    { en: "Punjabi Namkeen Mix", pa: "ਪੰਜਾਬੀ ਨਮਕੀਨ ਮਿਕਸ", hi: "पंजाबी नमकीन मिक्स" }, {
    base_price: 5000, unit: { en: "400 g pack" },
  }),
];

export const demoCakeOptionGroups: CakeOptionGroup[] = [
  {
    id: "grp-size", code: "size",
    name: { en: "Size", pa: "ਸਾਈਜ਼", hi: "साइज़" },
    input_type: "single_select", required: true,
    options: [
      { id: "size-05", code: "0_5kg", name: { en: "0.5 kg" }, weight_kg: 0.5, price_effect: "none", amount: 0, is_default: false },
      { id: "size-1", code: "1kg", name: { en: "1 kg" }, weight_kg: 1, price_effect: "none", amount: 0, is_default: true },
      { id: "size-2", code: "2kg", name: { en: "2 kg" }, weight_kg: 2, price_effect: "none", amount: 0, is_default: false },
      { id: "size-3", code: "3kg", name: { en: "3 kg" }, weight_kg: 3, price_effect: "none", amount: 0, is_default: false },
    ],
  },
  {
    id: "grp-shape", code: "shape",
    name: { en: "Shape", pa: "ਸ਼ਕਲ", hi: "आकार" },
    input_type: "single_select", required: true,
    options: [
      { id: "shape-round", code: "round", name: { en: "Round", pa: "ਗੋਲ", hi: "गोल" }, weight_kg: null, price_effect: "none", amount: 0, is_default: true },
      { id: "shape-square", code: "square", name: { en: "Square", pa: "ਚੌਰਸ", hi: "चौकोर" }, weight_kg: null, price_effect: "none", amount: 0, is_default: false },
      { id: "shape-heart", code: "heart", name: { en: "Heart", pa: "ਦਿਲ", hi: "दिल" }, weight_kg: null, price_effect: "multiplier", amount: 1.1, is_default: false },
    ],
  },
  {
    id: "grp-egg", code: "egg",
    name: { en: "Egg preference", pa: "ਅੰਡੇ ਦੀ ਪਸੰਦ", hi: "अंडा विकल्प" },
    input_type: "single_select", required: true,
    options: [
      { id: "egg-with", code: "with_egg", name: { en: "With egg", pa: "ਅੰਡੇ ਨਾਲ", hi: "अंडे के साथ" }, weight_kg: null, price_effect: "none", amount: 0, is_default: true },
      { id: "egg-less", code: "eggless", name: { en: "Eggless", pa: "ਬਿਨਾਂ ਅੰਡੇ", hi: "एगलेस" }, weight_kg: null, price_effect: "per_kg", amount: 5000, is_default: false },
    ],
  },
  {
    id: "grp-photo", code: "photo_print",
    name: { en: "Photo print on cake", pa: "ਕੇਕ ਉੱਤੇ ਫੋਟੋ ਪ੍ਰਿੰਟ", hi: "केक पर फोटो प्रिंट" },
    input_type: "single_select", required: false,
    options: [
      { id: "photo-no", code: "no", name: { en: "No photo", pa: "ਬਿਨਾਂ ਫੋਟੋ", hi: "बिना फोटो" }, weight_kg: null, price_effect: "none", amount: 0, is_default: true },
      { id: "photo-yes", code: "yes", name: { en: "Add photo print", pa: "ਫੋਟੋ ਪ੍ਰਿੰਟ ਪਾਓ", hi: "फोटो प्रिंट जोड़ें" }, weight_kg: null, price_effect: "flat", amount: 15000, is_default: false },
    ],
  },
  {
    id: "grp-message", code: "message",
    name: { en: "Message on cake", pa: "ਕੇਕ ਉੱਤੇ ਸੁਨੇਹਾ", hi: "केक पर संदेश" },
    input_type: "text", required: false, options: [],
  },
  {
    id: "grp-datetime", code: "delivery_datetime",
    name: { en: "Needed by (date & time)", pa: "ਕਦੋਂ ਚਾਹੀਦਾ ਹੈ", hi: "कब चाहिए" },
    input_type: "datetime", required: true, options: [],
  },
];

export const demoDeliveryZones: DeliveryZone[] = [
  {
    id: "zone-town",
    name: { en: "Patti Town", pa: "ਪੱਟੀ ਸ਼ਹਿਰ", hi: "पट्टी शहर" },
    villages: ["Patti", "Bus Adda", "Railway Road", "Sabzi Mandi"],
    fee: 2000, free_above: 50000,
  },
  {
    id: "zone-nearby",
    name: { en: "Nearby villages (within 5 km)", pa: "ਨੇੜਲੇ ਪਿੰਡ (5 ਕਿ.ਮੀ. ਤੱਕ)", hi: "नज़दीकी गाँव (5 कि.मी. तक)" },
    villages: ["Dubli", "Kot Dharm Chand", "Sur Singh", "Manochahal"],
    fee: 4000, free_above: 100000,
  },
];

export const demoShop = {
  id: "shop-sethi",
  slug: "sethi-bakery",
  name: { en: "Sethi Bakery", pa: "ਸੇਠੀ ਬੇਕਰੀ", hi: "सेठी बेकरी" },
  address: "Near Bus Adda, Patti, Tarn Taran, Punjab 143416",
  settings: { accepting_orders: true, min_order_paise: 0 },
};
