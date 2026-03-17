"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/header";
import Footer from "@/components/footer";
import FloatingBar from "@/components/floating-bar";

/**
 * PublicShell — renders the public-facing Header, Footer, and FloatingBar
 * only on non-admin routes.  Admin pages get none of these — they have their
 * own standalone sidebar layout.
 */
export default function PublicShell({ children }) {
  const pathname = usePathname();
  const isAdmin = pathname?.startsWith("/admin");

  if (isAdmin) {
    // Admin portal: no header, no footer, no floating bar — just the page
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
      <FloatingBar />
    </>
  );
}
