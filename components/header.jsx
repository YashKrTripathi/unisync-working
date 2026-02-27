"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Building,
  Plus,
  Ticket,
  Menu,
  X,
  LayoutDashboard,
  Sparkles
} from "lucide-react";
import { BarLoader } from "react-spinners";
import { Button } from "@/components/ui/button";
import { useMockAuth } from "@/components/convex-client-provider";
import { SignInButton, UserButton } from "@clerk/nextjs";
import { Authenticated, Unauthenticated, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { useStoreUser } from "@/hooks/use-store-user";
import { useOnboarding } from "@/hooks/use-onboarding";
import OnboardingModal from "./onboarding-modal";

const isBackendEnabled = Boolean(
  process.env.NEXT_PUBLIC_CONVEX_URL &&
  process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

// ============ SHARED COMPONENTS ============
function Logo() {
  return (
    <Link href="/" className="flex items-center gap-3 group relative z-10">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.4)] group-hover:scale-105 group-hover:shadow-[0_0_30px_rgba(37,99,235,0.6)] transition-all duration-300 border border-blue-400/30">
          <span className="text-white font-black text-sm tracking-tighter">UN</span>
        </div>
        <div className="hidden sm:flex items-center">
          <span className="text-xl font-black tracking-tight text-foreground group-hover:text-blue-500 transition-colors">
            UNI
          </span>
          <span className="text-xl font-black tracking-tight text-blue-500">
            SYNC
          </span>
          <div className="ml-3 px-2 py-0.5 rounded-full bg-dypiu-gold/10 border border-dypiu-gold/30 text-[10px] font-bold tracking-widest text-dypiu-gold uppercase flex items-center gap-1 shadow-[0_0_10px_rgba(245,158,11,0.1)]">
            <Sparkles className="w-3 h-3" />
            DYPIU
          </div>
        </div>
      </div>
    </Link>
  );
}

function DesktopNav() {
  return (
    <div className="hidden md:flex items-center gap-2 bg-card/40 backdrop-blur-xl border border-white/10 px-2 py-1.5 rounded-full shadow-lg">
      <Link href="/explore" className="px-5 py-2 rounded-full text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-300">
        Explore
      </Link>
      <Link href="/past-events" className="px-5 py-2 rounded-full text-sm font-semibold text-muted-foreground hover:text-foreground hover:bg-white/5 transition-all duration-300">
        Past Events
      </Link>
    </div>
  );
}

function MobileMenuToggle({ open, setOpen }) {
  return (
    <button
      className="ml-3 md:hidden p-2.5 rounded-full bg-card/50 border border-white/5 text-muted-foreground hover:text-foreground hover:bg-white/10 transition-colors"
      onClick={() => setOpen(!open)}
    >
      {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
    </button>
  );
}

function MobileMenu({ open, setOpen }) {
  if (!open) return null;
  return (
    <div className="md:hidden absolute top-full left-0 right-0 border-t border-white/10 px-6 py-6 space-y-3 bg-background/95 backdrop-blur-3xl shadow-2xl origin-top animate-in slide-in-from-top-2 fade-in duration-200">
      <Link href="/explore" className="block px-4 py-3 rounded-xl text-foreground font-medium bg-white/5 hover:bg-white/10 transition-colors" onClick={() => setOpen(false)}>
        Explore Events
      </Link>
      <Link href="/past-events" className="block px-4 py-3 rounded-xl text-foreground font-medium bg-white/5 hover:bg-white/10 transition-colors" onClick={() => setOpen(false)}>
        Past Events
      </Link>
      <Link href="/attendance" className="block px-4 py-3 rounded-xl text-foreground font-medium bg-white/5 hover:bg-white/10 transition-colors" onClick={() => setOpen(false)}>
        Mark Attendance
      </Link>
    </div>
  );
}

function useScrollDirection() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  return scrolled;
}

// ============ MOCK HEADER ============
function MockHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { adminCheck } = useMockAuth();
  const scrolled = useScrollDirection();

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-background/70 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-3' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
        <Logo />
        <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
          <DesktopNav />
        </div>
        <div className="flex items-center gap-3 relative z-10">
          {adminCheck?.canAccessAdminPanel && (
            <Button variant="ghost" size="sm" asChild className="hidden lg:flex text-dypiu-gold hover:text-dypiu-gold-light hover:bg-dypiu-gold/10 rounded-full px-4">
              <Link href="/admin">
                <LayoutDashboard className="w-4 h-4 mr-2" />
                Dashboard
              </Link>
            </Button>
          )}
          {adminCheck?.canCreateEvents && (
            <Button size="sm" asChild className="hidden sm:flex gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] rounded-full px-5 transition-all duration-300 hover:scale-105">
              <Link href="/create-event">
                <Plus className="w-4 h-4" />
                Create Event
              </Link>
            </Button>
          )}
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-bold cursor-pointer shadow-lg border border-white/20 hover:scale-110 transition-transform">
            {adminCheck?.role === "organiser" ? "O" : "S"}
          </div>
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
  const { showOnboarding, handleOnboardingComplete, handleOnboardingSkip } = useOnboarding();
  const adminCheck = useQuery(api.admin.isAdmin);
  const scrolled = useScrollDirection();

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-background/70 backdrop-blur-2xl border-b border-white/10 shadow-2xl py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 flex items-center justify-between relative">
          <Logo />
          <div className="absolute left-1/2 -translate-x-1/2 hidden md:block">
            <DesktopNav />
          </div>
          <div className="flex items-center gap-3 relative z-10">
            {adminCheck?.canAccessAdminPanel && (
              <Button variant="ghost" size="sm" asChild className="hidden lg:flex text-dypiu-gold hover:text-dypiu-gold-light hover:bg-dypiu-gold/10 rounded-full px-4">
                <Link href="/admin">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Link>
              </Button>
            )}
            <Authenticated>
              {adminCheck?.canCreateEvents && (
                <Button size="sm" asChild className="hidden sm:flex gap-2 bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] rounded-full px-5 transition-all duration-300 hover:scale-105">
                  <Link href="/create-event">
                    <Plus className="w-4 h-4" />
                    Create Event
                  </Link>
                </Button>
              )}
              <div className="ml-2 ring-2 ring-primary/20 rounded-full hover:ring-primary/60 transition-all duration-300 shadow-[0_0_15px_rgba(37,99,235,0.2)]">
                <UserButton afterSignOutUrl="/" appearance={{ elements: { avatarBox: "w-10 h-10" } }}>
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
                <Button size="sm" className="bg-primary hover:bg-primary/90 text-primary-foreground shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] rounded-full px-6 font-semibold transition-all duration-300 hover:scale-105">
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
      <OnboardingModal isOpen={showOnboarding} onClose={handleOnboardingSkip} onComplete={handleOnboardingComplete} />
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
