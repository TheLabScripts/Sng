"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { clearSnagdData, readJson } from "@/lib/storage/snagdStorage";

type Session = { name?: string; email?: string; plan?: string };

export function AccountProfileClient() {
  const [session, setSession] = useState<Session>({ name: "Guest", plan: "Free" });
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  useEffect(() => {
    setSession(readJson<Session>("snagd-session", { name: "Guest", plan: "Free" }));
  }, []);

  function deleteLocalData() {
    clearSnagdData();
    window.location.href = "/login/";
  }

  return (
    <div className="mt-5 grid gap-4 text-sm">
      <AccountRow label="Name" value={session.name || "Guest"} />
      <AccountRow label="Email" value={session.email || "Not stored"} />
      <AccountRow label="Plan" value={session.plan || "Free"} />
      <AccountRow label="Data storage" value="Private to this device" />
      <div className="flex flex-wrap gap-2 pt-1">
        <Link href="/legal/privacy/" className="rounded-card border border-line bg-surface-2 px-3 py-2 font-bold text-ink">Privacy</Link>
        <Link href="/support/" className="rounded-card border border-line bg-surface-2 px-3 py-2 font-bold text-ink">Support</Link>
      </div>
      <div className="rounded-card border border-pass/30 bg-pass/5 p-3">
        <p className="font-bold text-ink">Delete local data</p>
        <p className="mt-1 text-xs leading-5 text-muted">Removes your profile, preferences, watchlists, saved deals, and activity from this device.</p>
        {confirmingDelete ? (
          <div className="mt-3 flex gap-2">
            <button type="button" onClick={deleteLocalData} className="rounded-card bg-pass px-3 py-2 text-xs font-bold text-white">Delete everything</button>
            <button type="button" onClick={() => setConfirmingDelete(false)} className="rounded-card border border-line px-3 py-2 text-xs font-bold text-ink">Cancel</button>
          </div>
        ) : (
          <button type="button" onClick={() => setConfirmingDelete(true)} className="mt-3 rounded-card border border-pass/40 px-3 py-2 text-xs font-bold text-pass">Delete data</button>
        )}
      </div>
    </div>
  );
}

function AccountRow({ label, value }: { label: string; value: string }) {
  return <div className="border-b border-line pb-3 last:border-b-0 last:pb-0"><p className="text-muted">{label}</p><p className="mt-1 font-bold text-ink">{value}</p></div>;
}
