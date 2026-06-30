import { AppShell } from "@/components/app/AppShell";

export default function InAppLayout({ children }: { children: React.ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
