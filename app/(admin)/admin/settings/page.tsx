import {
  getShopSettings,
  requireAdminOrRedirect,
} from "@/lib/admin-data";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { signOut } from "@/lib/admin-actions";
import { isDemoMode } from "@/lib/supabase/config";

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const mode = await requireAdminOrRedirect();
  const settings = await getShopSettings();

  return (
    <div>
      <h1 className="font-display mb-5 text-2xl font-bold text-cocoa">
        Shop settings
      </h1>
      <SettingsForm initial={settings} demo={mode === "demo"} />
      {!isDemoMode() && (
        <form action={signOut} className="mt-8">
          <button
            type="submit"
            className="w-full rounded-full border border-cocoa/15 py-3 text-sm font-semibold text-cocoa-light transition-colors hover:text-cocoa"
          >
            Sign out
          </button>
        </form>
      )}
    </div>
  );
}
