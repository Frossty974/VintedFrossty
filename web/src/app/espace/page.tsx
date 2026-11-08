import type { Metadata } from "next";
import { Dashboard } from "@/components/account/Dashboard";
import { RequireAuth } from "@/components/account/RequireAuth";

export const metadata: Metadata = { title: "Mon espace", robots: { index: false } };

export default function EspacePage() {
  return (
    <RequireAuth>
      <Dashboard />
    </RequireAuth>
  );
}
