"use client";

import Link from "next/link";
import { FormEvent, useState } from "react";
import { SnagdLogo } from "@/components/ui/SnagdLogo";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function AuthForm({ mode }: { mode: "login" | "signup" }) {
  const isSignup = mode === "signup";
  const [name, setName] = useState("Demo reseller");
  const [email, setEmail] = useState("demo@snagd.app");

  function storeSession(nextPath: string) {
    window.localStorage.setItem("snagd-session", JSON.stringify({ name, email, plan: "Founder" }));
    window.location.href = nextPath;
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
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
          <p className="text-sm text-muted">{isSignup ? "Start your reseller command center" : "Welcome back"}</p>
          <h1 className="mt-2 text-3xl font-bold text-ink">{isSignup ? "Create your Snagd account" : "Log into Snagd"}</h1>
          <p className="mt-3 text-sm leading-6 text-muted">
            Mock auth is localStorage only, so you can test the app without a backend.
          </p>

          <form className="mt-6 grid gap-4" onSubmit={handleSubmit}>
            {isSignup && (
              <label className="grid gap-2">
                <span className="text-sm font-bold text-ink">Name</span>
                <input className="field" value={name} onChange={(event) => setName(event.target.value)} />
              </label>
            )}
            <label className="grid gap-2">
              <span className="text-sm font-bold text-ink">Email</span>
              <input className="field" type="email" value={email} onChange={(event) => setEmail(event.target.value)} />
            </label>
            <label className="grid gap-2">
              <span className="text-sm font-bold text-ink">Password</span>
              <input className="field" type="password" value="password" readOnly />
            </label>

            <button className="h-12 rounded-card bg-brand px-5 text-sm font-bold text-white" type="submit">
              {isSignup ? "Continue to onboarding" : "Log in"}
            </button>
            <button
              className="h-12 rounded-card border border-line bg-surface-2 px-5 text-sm font-bold text-ink"
              type="button"
              onClick={() => storeSession("/app/")}
            >
              Continue with demo
            </button>
          </form>

          <p className="mt-5 text-center text-sm text-muted">
            {isSignup ? "Already have an account?" : "Need an account?"}{" "}
            <Link href={isSignup ? "/login/" : "/signup/"} className="font-bold text-info">
              {isSignup ? "Log in" : "Sign up"}
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
