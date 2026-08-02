"use client";

import { useState } from "react";
import { saveSettings } from "@/lib/admin-actions";

export function SettingsForm({
  initial,
  demo,
}: {
  initial: {
    accepting_orders: boolean;
    whatsapp_phone: string | null;
    phone: string | null;
  };
  demo: boolean;
}) {
  const [accepting, setAccepting] = useState(initial.accepting_orders);
  const [whatsapp, setWhatsapp] = useState(initial.whatsapp_phone ?? "");
  const [phone, setPhone] = useState(initial.phone ?? "");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  const inputCls =
    "w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3.5 text-base outline-none transition-colors focus:border-caramel";

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const result = await saveSettings({
      accepting_orders: accepting,
      whatsapp_phone: whatsapp,
      phone,
    });
    setBusy(false);
    setMessage(
      result.ok
        ? { ok: true, text: "Saved ✓" }
        : { ok: false, text: result.error }
    );
  }

  return (
    <form onSubmit={submit} className="space-y-5">
      <div className="flex items-center justify-between gap-4 rounded-card bg-white p-5 shadow-warm">
        <div>
          <p className="font-semibold text-cocoa">Accepting orders</p>
          <p className="text-xs text-cocoa-light">
            Turn off to pause the website (holiday, power cut, sold out).
            Customers see a &quot;closed right now&quot; notice.
          </p>
        </div>
        <button
          type="button"
          role="switch"
          aria-checked={accepting}
          onClick={() => setAccepting(!accepting)}
          className={`relative h-9 w-16 shrink-0 rounded-full transition-colors ${
            accepting ? "bg-pistachio" : "bg-berry"
          }`}
        >
          <span
            className={`absolute top-1 h-7 w-7 rounded-full bg-white shadow transition-all ${
              accepting ? "left-8" : "left-1"
            }`}
          />
        </button>
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cocoa-light">
          WhatsApp number for order messages (with country code, no +)
        </label>
        <input
          value={whatsapp}
          onChange={(e) => setWhatsapp(e.target.value.replace(/\D/g, ""))}
          placeholder="9198xxxxxxxx"
          inputMode="numeric"
          className={inputCls}
        />
      </div>

      <div>
        <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wide text-cocoa-light">
          Shop phone (shown to customers)
        </label>
        <input
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          placeholder="+91 98xxx xxxxx"
          className={inputCls}
        />
      </div>

      {message && (
        <p
          className={`rounded-xl px-4 py-3 text-sm font-semibold ${
            message.ok ? "bg-pistachio/15 text-pistachio" : "bg-berry/10 text-berry"
          }`}
        >
          {message.text}
        </p>
      )}

      <button
        type="submit"
        disabled={busy || demo}
        className="w-full rounded-full bg-caramel py-4 text-sm font-bold uppercase tracking-widest text-white shadow-warm transition-all hover:bg-gold active:scale-[0.98] disabled:opacity-50"
      >
        {demo ? "Demo preview — saving disabled" : busy ? "Saving…" : "Save settings"}
      </button>
    </form>
  );
}
