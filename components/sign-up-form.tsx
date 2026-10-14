"use client";

import { AuthShell } from "@/components/auth-shell";
import { createClient } from "@/lib/supabase/client";
import { ArrowRight, Eye, EyeOff, LockKeyhole, Mail, UserRoundPlus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export function SignUpForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSignUp = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }
    if (password.length < 6) {
      setError("Your password must be at least 6 characters long.");
      return;
    }
    setIsLoading(true);
    try {
      const supabase = createClient();
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: { emailRedirectTo: `${window.location.origin}/dashboard` },
      });
      if (error) throw error;
      router.push("/auth/sign-up-success");
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AuthShell mode="signup">
      <div className="mb-8">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-50 text-indigo-600"><UserRoundPlus className="h-6 w-6" /></div>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">Create your account</h1>
        <p className="mt-3 text-sm leading-6 text-slate-500">Start organizing your tasks and projects in minutes.</p>
      </div>

      <form onSubmit={handleSignUp} className="space-y-4">
        <div>
          <label htmlFor="signup-email" className="mb-2 block text-sm font-semibold text-slate-700">Email address</label>
          <div className="relative">
            <Mail className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input id="signup-email" type="email" autoComplete="email" required placeholder="you@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
          </div>
        </div>

        <div>
          <label htmlFor="signup-password" className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input id="signup-password" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={6} required placeholder="At least 6 characters" value={password} onChange={(e) => setPassword(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-12 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
            <button type="button" onClick={() => setShowPassword((v) => !v)} aria-label={showPassword ? "Hide password" : "Show password"} className="absolute right-3 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-700">
              {showPassword ? <EyeOff className="h-[18px] w-[18px]" /> : <Eye className="h-[18px] w-[18px]" />}
            </button>
          </div>
        </div>

        <div>
          <label htmlFor="signup-repeat-password" className="mb-2 block text-sm font-semibold text-slate-700">Confirm password</label>
          <div className="relative">
            <LockKeyhole className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input id="signup-repeat-password" type={showPassword ? "text" : "password"} autoComplete="new-password" minLength={6} required placeholder="Repeat your password" value={repeatPassword} onChange={(e) => setRepeatPassword(e.target.value)} className="h-12 w-full rounded-xl border border-slate-200 bg-white pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-4 focus:ring-indigo-100" />
          </div>
        </div>

        {error && <p role="alert" className="rounded-xl border border-rose-100 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</p>}

        <button type="submit" disabled={isLoading} className="mt-2 flex h-12 w-full items-center justify-center gap-2 rounded-xl bg-indigo-600 px-5 text-sm font-bold text-white shadow-lg shadow-indigo-100 transition hover:bg-indigo-700 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-indigo-200 disabled:cursor-not-allowed disabled:opacity-60">
          {isLoading ? "Creating account..." : "Create free account"}<ArrowRight className="h-4 w-4" />
        </button>
      </form>

      <p className="mt-7 text-center text-sm text-slate-500">
        Already have an account? <Link href="/auth/login" className="font-bold text-indigo-600 hover:text-indigo-700">Sign in</Link>
      </p>
      <p className="mt-5 text-center text-xs leading-5 text-slate-400">We&apos;ll send a confirmation link to your email address.</p>
    </AuthShell>
  );
}
