"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Ticket,
  Menu,
  X,
  Building,
} from "lucide-react";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated } from "convex/react";
import { useStoreUser } from "@/hooks/use-store-user";

const isBackendEnabled = Boolean(
  process.env.NEXT_PUBLIC_CONVEX_URL &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

// ============ SHARED COMPONENTS ============

/* Logo — stacked like Nameless with a U icon mark */
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-4 group relative z-10">
      {/* Icon mark like the N circle */}
      <div className="w-[42px] h-[42px] md:w-[46px] md:h-[46px] rounded-full bg-white flex items-center justify-center shrink-0">
        <span className="text-[26px] md:text-[30px] font-black text-black leading-none">U</span>
      </div>
      <div className="flex flex-col leading-[1.05]">
        <span className="text-[22px] md:text-[25px] font-normal tracking-tight text-white/95">
          Uni
        </span>
        <span className="text-[22px] md:text-[25px] font-bold tracking-tight text-white">
          Sync
        </span>
      </div>
    </Link>
  );
}

/* Desktop nav — public pages only, no admin links */
function DesktopNav() {
  return (
    <div className="hidden xl:flex items-center gap-[28px]">
      <Link href="/" className="text-[18px] font-medium text-white hover:text-white/70 transition-colors">Home</Link>
      <Link href="/explore" className="text-[18px] font-medium text-white hover:text-white/70 transition-colors">Tickets</Link>
      <Link href="/accommodations" className="text-[18px] font-medium text-white hover:text-white/70 transition-colors">Accomodations</Link>
      <Link href="/location" className="text-[18px] font-medium text-white hover:text-white/70 transition-colors">Location</Link>
      <Link href="/partner" className="text-[18px] font-medium text-white hover:text-white/70 transition-colors">Partner</Link>
      <Link href="/information" className="text-[18px] font-medium text-white hover:text-white/70 transition-colors">Informations</Link>
      <Link href="/past-events" className="text-[18px] font-medium text-white hover:text-white/70 transition-colors">Festival</Link>
      <Link href="/faq" className="text-[18px] font-medium text-white hover:text-white/70 transition-colors">FAQ</Link>
    </div>
  );
}

/* Language toggle — far right of nav, matching SS with flag icon */
function LangToggle() {
  return (
    <button className="hidden xl:flex items-center gap-1.5 text-[18px] font-medium text-white hover:text-white/70 transition-colors ml-4 pl-6 border-l border-white/10">
      <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 24 24" height="1.2em" width="1.2em" xmlns="http://www.w3.org/2000/svg"><path fill="none" d="M0 0h24v24H0z"></path><path d="M12.87 15.07l-2.54-2.51.03-.03A17.52 17.52 0 0014.07 6H17V4h-7V2H8v2H1v2h11.17C11.5 7.92 10.44 9.75 9 11.35 8.07 10.32 7.3 9.19 6.69 8h-2c.73 1.63 1.73 3.17 2.98 4.56l-5.09 5.02L4 19l5-5 3.11 3.11.76-2.04zM18.5 10h-2L12 22h2l1.12-3h4.75L21 22h2l-4.5-12zm-2.62 7l1.62-4.33L19.12 17h-3.24z"></path></svg>
      <span>EN</span>
      <span className="text-[10px] opacity-60 ml-0.5 mt-[2px]">▼</span>
    </button>
  );
}

function MobileMenuToggle({ open, setOpen }) {
  return (
    <button
      className="ml-3 xl:hidden p-2.5 rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-colors"
      onClick={() => setOpen(!open)}
    >
      {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  );
}

function MobileMenu({ open, setOpen }) {
  if (!open) return null;
  return (
    <div className="xl:hidden absolute top-full left-0 right-0 border-t border-white/10 px-6 py-6 space-y-2 bg-[#050505]/95 backdrop-blur-3xl shadow-2xl origin-top animate-in slide-in-from-top-2 fade-in duration-200">
      {[
        { href: "/", label: "Home" },
        { href: "/explore", label: "Tickets" },
        { href: "/accommodations", label: "Accomodations" },
        { href: "/location", label: "Location" },
        { href: "/partner", label: "Partner" },
        { href: "/information", label: "Informations" },
        { href: "/past-events", label: "Festival" },
        { href: "/faq", label: "FAQ" },
      ].map(link => (
        <Link key={link.href} href={link.href} className="block px-4 py-3 rounded-xl text-white font-medium hover:bg-white/10 transition-colors" onClick={() => setOpen(false)}>
          {link.label}
        </Link>
      ))}
    </div>
  );
}

function useScrollDirection() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return scrolled;
}

// ============ MOCK HEADER ============
function MockHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrolled = useScrollDirection();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 md:py-[18px] border-b border-white/[0.04] ${scrolled ? 'bg-black/80 backdrop-blur-2xl shadow-xl' : 'bg-[#050505]/60 backdrop-blur-[12px]'}`}>
      <div className="w-full max-w-[1550px] mx-auto px-5 md:px-10 flex items-center relative gap-8 lg:gap-16">
        {/* Left: Logo Only */}
        <div className="flex items-center shrink-0">
          <Logo />
        </div>

        {/* Center/Right: Nav links */}
        <div className="hidden xl:flex items-center mr-auto">
          <DesktopNav />
        </div>

        {/* Far Right: Actions */}
        <div className="flex items-center gap-3 ml-auto xl:ml-0 relative z-10 shrink-0">
          <LangToggle />
          <MobileMenuToggle open={mobileMenuOpen} setOpen={setMobileMenuOpen} />
        </div>
      </div>
      <MobileMenu open={mobileMenuOpen} setOpen={setMobileMenuOpen} />
    </nav>
  );
}

// ============ AUTH HEADER ============
function AuthHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isLoading } = useStoreUser();
  const scrolled = useScrollDirection();

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 md:py-[18px] border-b border-white/[0.04] ${scrolled ? 'bg-black/80 backdrop-blur-2xl shadow-xl' : 'bg-[#050505]/60 backdrop-blur-[12px]'}`}>
        <div className="w-full max-w-[1550px] mx-auto px-5 md:px-10 flex items-center relative gap-8 lg:gap-16">
          {/* Left: Logo Only */}
          <div className="flex items-center shrink-0">
            <Logo />
          </div>

          {/* Center/Right: Nav links */}
          <div className="hidden xl:flex items-center mr-auto">
            <DesktopNav />
          </div>

          {/* Far Right: Actions */}
          <div className="flex items-center gap-3 ml-auto xl:ml-0 relative z-10 shrink-0">
            <LangToggle />
            <Authenticated>
              <div className="ml-4 ring-2 ring-white/20 rounded-full hover:ring-white transition-all duration-300">
                <UserButton
                  afterSignOutUrl="/"
                  appearance={{
                    elements: {
                      avatarBox: "w-9 h-9",
                      userButtonPopoverFooter: "hidden",
                    },
                  }}
                >
                  <UserButton.MenuItems>
                    <UserButton.Link label="My Tickets" labelIcon={<Ticket size={16} />} href="/my-tickets" />
                    <UserButton.Link label="My Events" labelIcon={<Building size={16} />} href="/my-events" />
                    <UserButton.Action label="manageAccount" />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            </Authenticated>
            <Unauthenticated>
              <SignInButton mode="modal">
                <Button size="sm" className="bg-white text-black hover:bg-gray-200 rounded-full px-6 py-4 font-semibold transition-all duration-300 text-[15px] ml-4">
                  Sign In
                </Button>
              </SignInButton>
            </Unauthenticated>
            <MobileMenuToggle open={mobileMenuOpen} setOpen={setMobileMenuOpen} />
          </div>
        </div>
        <MobileMenu open={mobileMenuOpen} setOpen={setMobileMenuOpen} />
        {isLoading && (
          <div className="absolute bottom-0 left-0 w-full h-[2px] overflow-hidden">
            <BarLoader width={"100%"} height={2} color="#3b82f6" speedMultiplier={0.8} />
          </div>
        )}
      </nav>
    </>
  );
}

// ============ MAIN EXPORT ============
export default function Header() {
  if (isBackendEnabled) {
    return <AuthHeader />;
  }
  return <MockHeader />;
}
