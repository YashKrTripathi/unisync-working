"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";

/**
 * PublicShell renders the public-facing Header and Footer
 * only on non-admin routes. Admin pages use their own layout.
 */
export default function PublicShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    return <>{children}</>;
  }

  return (
    <>
      <div id="app-header">
        <Header />
      </div>
      <main className="relative min-h-screen bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.14),transparent_32%),radial-gradient(circle_at_75%_15%,rgba(249,115,22,0.12),transparent_30%),linear-gradient(180deg,#0b0a10_0%,#0d0a12_45%,#06050a_100%)]">
        <div className="relative z-10">{children}</div>
        <div id="app-footer">
          <Footer />
        </div>
      </main>
    </>
  );
}
