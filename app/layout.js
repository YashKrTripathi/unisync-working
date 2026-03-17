import Header from "@/components/header";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Toaster } from "sonner";
import DevRoleSwitcher from "@/components/dev-role-switcher";

export const metadata = {
  title: "UniSync | Campus Event Operating System",
  description:
    "Professional event discovery, registration, attendance, and reporting for D. Y. Patil International University.",
  keywords: [
    "UniSync",
    "DYPIU",
    "events",
    "campus experience",
    "student events",
    "event management",
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className="dark">
      <body suppressHydrationWarning className="min-h-screen bg-background text-foreground">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            <div className="relative min-h-screen overflow-x-clip">
              <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
                <div className="site-grid absolute inset-0 opacity-[0.06]" />
                <div className="absolute -top-32 left-[-10%] h-[32rem] w-[32rem] rounded-full bg-blue-500/15 blur-[140px] animate-drift" />
                <div className="absolute right-[-10%] top-[12%] h-[28rem] w-[28rem] rounded-full bg-dypiu-gold/10 blur-[130px] animate-float-slow" />
                <div className="absolute bottom-[-14rem] left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-cyan-500/12 blur-[150px]" />
              </div>

              <div id="app-header" className="relative z-40">
                <Header />
              </div>

              <main className="relative z-10 min-h-screen pt-28 md:pt-32">
                {children}
              </main>

              <div id="app-footer" className="relative z-10">
                <Footer />
              </div>
            </div>

            <Toaster position="top-center" richColors />
            <DevRoleSwitcher />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
