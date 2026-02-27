import Header from "@/components/header";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Toaster } from "sonner";
import DevRoleSwitcher from "@/components/dev-role-switcher";

export const metadata = {
  title: "DYPIU EventHub — D. Y. Patil International University",
  description:
    "DYPIU Event Management System — Discover, organize, and manage campus events at D. Y. Patil International University, Akurdi, Pune.",
  keywords: ["DYPIU", "events", "campus", "D. Y. Patil International University", "Pimpri", "Pune", "event management"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="bg-[#0c1222] text-white">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <div id="app-header">
              <Header />
            </div>
            <main className="relative min-h-screen container mx-auto pt-40 md:pt-32">
              <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
                <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-900/20 rounded-full blur-3xl" />
                <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-amber-600/10 rounded-full blur-3xl" />
                <div className="absolute top-1/2 right-0 w-72 h-72 bg-red-900/10 rounded-full blur-3xl" />
              </div>
              <div className="relative z-10">{children}</div>
              <div id="app-footer">
                <Footer />
              </div>
            </main>
            <Toaster position="top-center" richColors />
            <DevRoleSwitcher />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
