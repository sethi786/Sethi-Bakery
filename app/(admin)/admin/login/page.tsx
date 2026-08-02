import { isDemoMode } from "@/lib/supabase/config";
import { signIn } from "@/lib/admin-actions";

export const dynamic = "force-dynamic";

export default async function AdminLoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;

  if (isDemoMode()) {
    return (
      <div className="mx-auto max-w-md rounded-card bg-white p-6 shadow-warm">
        <h1 className="font-display text-xl font-bold text-cocoa">
          Admin not connected yet
        </h1>
        <p className="mt-3 text-sm leading-relaxed text-cocoa-light">
          The site is running in demo mode. To activate the admin panel:
        </p>
        <ol className="mt-3 list-decimal space-y-2 pl-5 text-sm text-cocoa-light">
          <li>Create a free Supabase project and run the migrations + seed</li>
          <li>Set the Supabase environment variables (see .env.example)</li>
          <li>
            Create your brother&apos;s login in Supabase Auth and add him to
            <code className="mx-1 rounded bg-cream-deep px-1">shop_members</code>
          </li>
        </ol>
        <p className="mt-3 text-sm text-cocoa-light">
          Full steps are in the README.
        </p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-md">
      <h1 className="font-display text-2xl font-bold text-cocoa">Sign in</h1>
      <form action={signIn} className="mt-6 space-y-3">
        {error && (
          <p className="rounded-xl bg-berry/10 px-4 py-2.5 text-sm font-medium text-berry">
            Wrong email or password — try again.
          </p>
        )}
        <input
          name="email"
          type="email"
          required
          placeholder="Email"
          className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3.5 text-base outline-none focus:border-caramel"
        />
        <input
          name="password"
          type="password"
          required
          placeholder="Password"
          className="w-full rounded-xl border border-cocoa/15 bg-white px-4 py-3.5 text-base outline-none focus:border-caramel"
        />
        <button
          type="submit"
          className="w-full rounded-full bg-caramel py-3.5 text-sm font-bold text-white shadow-warm active:scale-[0.98]"
        >
          Sign in
        </button>
      </form>
    </div>
  );
}
