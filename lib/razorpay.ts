/**
 * Razorpay wrapper. The whole online-payment path is feature-flagged on the
 * presence of API keys, so the site takes COD orders while KYC is pending.
 */
export function isRazorpayEnabled(): boolean {
  return Boolean(process.env.RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET);
}

export async function createRazorpayOrder(params: {
  amountPaise: number;
  receipt: string;
}): Promise<{ id: string; key_id: string }> {
  const Razorpay = (await import("razorpay")).default;
  const client = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
  });
  const order = await client.orders.create({
    amount: params.amountPaise,
    currency: "INR",
    receipt: params.receipt,
  });
  return { id: order.id, key_id: process.env.RAZORPAY_KEY_ID! };
}

export async function verifyPaymentSignature(params: {
  razorpay_order_id: string;
  razorpay_payment_id: string;
  razorpay_signature: string;
}): Promise<boolean> {
  const { createHmac } = await import("node:crypto");
  const expected = createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!)
    .update(`${params.razorpay_order_id}|${params.razorpay_payment_id}`)
    .digest("hex");
  return expected === params.razorpay_signature;
}

export async function verifyWebhookSignature(
  rawBody: string,
  signature: string
): Promise<boolean> {
  const { createHmac, timingSafeEqual } = await import("node:crypto");
  const expected = createHmac(
    "sha256",
    process.env.RAZORPAY_WEBHOOK_SECRET!
  )
    .update(rawBody)
    .digest("hex");
  const a = Buffer.from(expected);
  const b = Buffer.from(signature);
  return a.length === b.length && timingSafeEqual(a, b);
}
