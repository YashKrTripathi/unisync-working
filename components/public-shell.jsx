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
      <main className="relative min-h-screen">
        <div className="relative z-10">{children}</div>
        <div id="app-footer">
          <Footer />
        </div>
      </main>
    </>
  );
}
