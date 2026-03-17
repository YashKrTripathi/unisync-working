import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { ConvexClientProvider } from "@/components/convex-client-provider";
import { Toaster } from "sonner";
import PublicShell from "@/components/public-shell";
import { Inter, Anton, Playfair_Display } from "next/font/google";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });
const anton = Anton({ weight: "400", subsets: ["latin"], variable: "--font-anton" });
const playfair = Playfair_Display({ subsets: ["latin"], style: ["italic"], variable: "--font-playfair" });

export const metadata = {
  title: "DYPIU EventHub — Nameless Theme",
  description:
    "DYPIU Event Management System — Discover, organize, and manage campus events at D. Y. Patil International University.",
  keywords: ["DYPIU", "events", "campus", "event management", "nameless festival"],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className={`${inter.variable} ${anton.variable} ${playfair.variable} bg-[#000000] text-white font-sans antialiased`}>
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          forcedTheme="dark"
          disableTransitionOnChange
        >
          <ConvexClientProvider>
            {/* PublicShell conditionally shows Header/Footer/FloatingBar.
                On /admin/* routes it renders nothing extra — just children. */}
            <PublicShell>
              {children}
            </PublicShell>
            <Toaster position="top-center" richColors />
          </ConvexClientProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
