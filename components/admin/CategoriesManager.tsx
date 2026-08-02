"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  moveCategory,
  saveCategory,
  toggleCategory,
} from "@/lib/admin-actions";
import type { Category } from "@/lib/types";

export function CategoriesManager({
  categories,
  demo,
}: {
  categories: (Category & { is_active?: boolean; product_count: number })[];
  demo: boolean;
}) {
  const router = useRouter();
  const [newName, setNewName] = useState("");
  const [message, setMessage] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function run(action: () => Promise<{ ok: boolean; error?: string }>) {
    setBusy(true);
    setMessage(null);
    const result = await action();
    setBusy(false);
    if (!result.ok) setMessage(result.error ?? "Something went wrong");
    else router.refresh();
  }

  return (
    <div>
      <form
        onSubmit={(e) => {
          e.preventDefault();
          run(() => saveCategory({ name_en: newName })).then(() => setNewName(""));
        }}
        className="flex gap-2"
      >
        <input
          required
          value={newName}
          onChange={(e) => setNewName(e.target.value)}
          placeholder="New category name (e.g. Cold Drinks)"
          className="flex-1 rounded-full border border-cocoa/15 bg-white px-5 py-3 text-sm outline-none transition-colors focus:border-caramel"
        />
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-caramel px-5 py-3 text-sm font-bold text-white shadow-warm active:scale-95 disabled:opacity-50"
        >
          Add
        </button>
      </form>
      {message && (
        <p className="mt-3 rounded-xl bg-berry/10 px-4 py-2.5 text-sm font-medium text-berry">
          {message}
        </p>
      )}

      <ul className="mt-4 space-y-2">
        {categories.map((category, i) => {
          const active = category.is_active !== false;
          return (
            <li
              key={category.id}
              className="flex items-center gap-3 rounded-card bg-white p-4 shadow-warm"
            >
              <div className="min-w-0 flex-1">
                <p className={`truncate font-semibold ${active ? "text-cocoa" : "text-cocoa-light line-through"}`}>
                  {category.name.en}
                </p>
                <p className="text-xs text-cocoa-light">
                  {category.product_count} item
                  {category.product_count === 1 ? "" : "s"}
                </p>
              </div>
              <div className="flex items-center gap-1.5">
                <button
                  aria-label="Move up"
                  disabled={busy || i === 0}
                  onClick={() => run(() => moveCategory(category.id, "up"))}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-deep font-bold text-cocoa disabled:opacity-30"
                >
                  ↑
                </button>
                <button
                  aria-label="Move down"
                  disabled={busy || i === categories.length - 1}
                  onClick={() => run(() => moveCategory(category.id, "down"))}
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-cream-deep font-bold text-cocoa disabled:opacity-30"
                >
                  ↓
                </button>
                <button
                  role="switch"
                  aria-checked={active}
                  aria-label={active ? "Visible" : "Hidden"}
                  disabled={busy || demo}
                  onClick={() => run(() => toggleCategory(category.id, !active))}
                  className={`relative h-8 w-14 rounded-full transition-colors ${
                    active ? "bg-pistachio" : "bg-cocoa/20"
                  } ${demo ? "cursor-not-allowed opacity-60" : ""}`}
                >
                  <span
                    className={`absolute top-1 h-6 w-6 rounded-full bg-white shadow transition-all ${
                      active ? "left-7" : "left-1"
                    }`}
                  />
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
