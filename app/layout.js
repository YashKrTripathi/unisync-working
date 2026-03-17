import { Plus_Jakarta_Sans, Inter } from "next/font/google";
import Header from "@/components/header";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import Footer from "@/components/footer";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Toaster } from "sonner";
import DevRoleSwitcher from "@/components/dev-role-switcher";

const plusJakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-body",
  display: "swap",
});

export const metadata = {
  title: {
    default: "UniSync | Campus Event Platform",
    template: "%s | UniSync",
  },
  description:
    "Discover, register, and manage campus events at D. Y. Patil International University. QR check-in, instant reports, and real-time attendance tracking.",
  keywords: [
    "UniSync",
    "DYPIU",
    "campus events",
    "student events",
    "event management",
    "QR attendance",
    "event registration",
    "D Y Patil International University",
  ],
  authors: [{ name: "UniSync Team" }],
  openGraph: {
    title: "UniSync | Campus Event Platform",
    description:
      "Discover, register, and manage campus events at DYPIU. QR check-in, instant reports, and real-time attendance.",
    type: "website",
    locale: "en_IN",
    siteName: "UniSync",
  },
  twitter: {
    card: "summary_large_image",
    title: "UniSync | Campus Event Platform",
    description:
      "Discover, register, and manage campus events at DYPIU.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export const viewport = {
  themeColor: "#07111f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning className={`dark ${plusJakarta.variable} ${inter.variable}`}>
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
                <div className="absolute -top-32 left-[-10%] h-[32rem] w-[32rem] rounded-full bg-sky-500/12 blur-[140px] animate-drift" />
                <div className="absolute right-[-10%] top-[12%] h-[28rem] w-[28rem] rounded-full bg-amber-400/6 blur-[130px] animate-float-slow" />
                <div className="absolute bottom-[-14rem] left-1/2 h-[30rem] w-[30rem] -translate-x-1/2 rounded-full bg-emerald-500/8 blur-[150px]" />
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
