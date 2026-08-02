const inr = new Intl.NumberFormat("en-IN", {
  style: "currency",
  currency: "INR",
  maximumFractionDigits: 0,
});

/** Format integer paise as rupees: 125000 -> "₹1,250" */
export function formatPaise(paise: number): string {
  return inr.format(Math.round(paise) / 100);
}
