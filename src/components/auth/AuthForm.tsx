"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { SnagdLogo } from "@/components/ui/SnagdLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  function storeSession(nextPath: string) {
    const profile = {
      name: name.trim() || "Local reseller",
      ...(email.trim() ? { email: email.trim() } : {}),
      plan: "Free",
      isAdmin: false,
    };
    window.localStorage.setItem("snagd-session", JSON.stringify(profile));
    window.location.href = nextPath;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!isSignup && window.localStorage.getItem("snagd-session")) {
      window.location.href = "/app/";
      return;
    }
    storeSession(isSignup ? "/onboarding/" : "/app/");
  }

  return (
    <main className="min-h-screen bg-bg px-4 py-5 text-ink">
      <div className="mx-auto flex max-w-shell items-center justify-between">
        <SnagdLogo />
        <ThemeToggle compact />
      </div>

      <div className="mx-auto mt-12 max-w-md">
        <div className="rounded-card border border-line bg-surface p-5 shadow-card sm:p-6">
          <p className="text-sm text-muted">{isSignup ? "Set up your reseller command center" : "Welcome back"}</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">{isSignup ? "Create a local profile" : "Open your Snagd workspace"}</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            This build keeps your profile and deal activity on this device. No password or cloud account is required.
          </p>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            {isSignup && (
              <>
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-ink">Display name</span>
                  <input className="field" value={name} onChange={(event) => setName(event.target.value)} autoComplete="name" required />
                </label>
                <label className="grid gap-2">
                  <span className="text-sm font-bold text-ink">Email <span className="font-normal text-muted">(optional)</span></span>
                  <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} autoComplete="email" />
                </label>
              </>
            )}

            <button className="h-12 rounded-card bg-brand px-5 text-sm font-bold text-white" type="submit">
              {isSignup ? "Continue to setup" : "Continue on this device"}
            </button>
            {isSignup && <button className="h-12 rounded-card border border-line bg-surface-2 px-5 text-sm font-bold text-ink" type="button" onClick={() => storeSession("/app/")}>Continue as guest</button>}
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            {isSignup ? "Already set up this device?" : "New to Snagd?"}{" "}
            <Link href={isSignup ? "/login/" : "/signup/"} className="font-bold text-info">
              {isSignup ? "Open workspace" : "Create a profile"}
            </Link>
          </p>
        </div>
      </div>

      <style jsx>{`
        .field {
          width: 100%;
          border-radius: 8px;
          border: 1px solid var(--line);
          background: var(--surface-2);
          color: var(--ink);
          padding: 0.75rem 0.85rem;
        }
      `}</style>
    </main>
  );
}

