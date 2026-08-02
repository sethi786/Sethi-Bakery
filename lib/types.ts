/** Localized text: English required, Punjabi/Hindi optional. */
export type LocalizedText = { en: string; pa?: string; hi?: string };

export type ProductType = "simple" | "variant" | "custom_cake";
export type StockStatus = "in_stock" | "out_of_stock" | "hidden";

export interface Category {
  id: string;
  slug: string;
  name: LocalizedText;
  image_path: string | null;
  sort_order: number;
}

export interface ProductImage {
  path: string;
  thumb_path: string;
  alt?: LocalizedText;
}

export interface ProductVariant {
  id: string;
  name: LocalizedText;
  price: number; // paise
  compare_at_price: number | null;
  is_default: boolean;
}

export interface Product {
  id: string;
  category_id: string;
  slug: string;
  name: LocalizedText;
  description: LocalizedText | null;
  product_type: ProductType;
  base_price: number | null; // paise; per-kg rate for custom cakes
  compare_at_price: number | null;
  unit: LocalizedText | null;
  is_eggless: boolean | null;
  stock_status: StockStatus;
  is_featured: boolean;
  tags: string[];
  images: ProductImage[];
  variants: ProductVariant[];
}

export type OptionInputType =
  | "single_select"
  | "text"
  | "image_upload"
  | "datetime";
export type PriceEffect = "none" | "flat" | "per_kg" | "multiplier";

export interface CakeOption {
  id: string;
  code: string;
  name: LocalizedText;
  weight_kg: number | null;
  price_effect: PriceEffect;
  amount: number; // paise for flat/per_kg; factor for multiplier
  is_default: boolean;
}

export interface CakeOptionGroup {
  id: string;
  code: string; // size | flavor | shape | egg | photo_print | message | delivery_datetime
  name: LocalizedText;
  input_type: OptionInputType;
  required: boolean;
  options: CakeOption[];
}

export interface DeliveryZone {
  id: string;
  name: LocalizedText;
  villages: string[];
  fee: number; // paise
  free_above: number | null;
}

export interface CakeCustomization {
  selections: Record<string, string>; // groupCode -> optionId
  message?: string;
  scheduled_for?: string;
  reference_image?: string;
  breakdown: { label: string; amount: number }[];
  total: number;
}

export interface CartItem {
  key: string; // productId or productId:variantId or cake hash
  product_id: string;
  variant_id?: string;
  name: LocalizedText;
  unit_price: number; // paise (display only — always repriced server-side)
  qty: number;
  image?: string;
  customization?: CakeCustomization;
}

export type FulfillmentType = "pickup" | "delivery";
export type PaymentMethod = "cod" | "razorpay";
export type OrderStatus =
  | "pending_payment"
  | "received"
  | "preparing"
  | "ready"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

export interface OrderInput {
  customer_name: string;
  customer_phone: string;
  locale: string;
  fulfillment_type: FulfillmentType;
  delivery_zone_id?: string;
  address_text?: string;
  landmark?: string;
  scheduled_date?: string;
  scheduled_slot?: string;
  payment_method: PaymentMethod;
  customer_note?: string;
  items: {
    product_id: string;
    variant_id?: string;
    qty: number;
    customization?: CakeCustomization;
  }[];
}

export interface PlacedOrder {
  order_number: string;
  access_token: string;
  status: OrderStatus;
  payment_method: PaymentMethod;
  subtotal: number;
  delivery_fee: number;
  total: number;
  items: {
    name: string;
    qty: number;
    unit_price: number;
    line_total: number;
    customization?: CakeCustomization;
  }[];
  customer_name: string;
  customer_phone: string;
  fulfillment_type: FulfillmentType;
  address_text?: string;
  created_at: string;
  demo?: boolean;
}
