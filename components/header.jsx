"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  CalendarPlus,
  LayoutDashboard,
  Menu,
  Sparkles,
  Ticket,
  X,
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

const primaryNav = [
  { href: "/explore", label: "Explore" },
  { href: "/past-events", label: "Archive" },
  { href: "/attendance", label: "Attendance" },
];

function useScrolled(threshold = 24) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > threshold);
    };

    handleScroll();
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return scrolled;
}

function LogoMark() {
  return (
    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6L16 2L26 6L26 20L16 30L6 20Z" fill="#0288D1" fillOpacity="0.9" />
      <path d="M6 6L16 16L6 20Z" fill="#43A047" fillOpacity="0.85" />
      <path d="M26 6L16 16L26 20Z" fill="#F9A825" fillOpacity="0.85" />
      <path d="M16 16L6 20L16 30L26 20Z" fill="#1B3064" fillOpacity="0.9" />
      <circle cx="16" cy="12" r="3" fill="white" fillOpacity="0.95" />
    </svg>
  );
}

function Logo() {
  return (
    <Link href="/" className="group relative z-10 flex items-center gap-2.5">
      <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0a1528] shadow-lg">
        <LogoMark />
      </div>
      <span className="hidden font-display text-xl font-bold tracking-tight text-white sm:block">
        UniSync
      </span>
    </Link>
  );
}

function NavLink({ href, label, pathname, onClick }) {
  const isActive = pathname === href || pathname.startsWith(`${href}/`);

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`inline-flex items-center rounded-full px-4 py-2 text-sm font-semibold ${
        isActive
          ? "bg-white/12 text-white shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]"
          : "text-slate-300 hover:bg-white/6 hover:text-white"
      }`}
    >
      {label}
    </Link>
  );
}

function DesktopNav({ pathname }) {
  return (
    <div className="hidden items-center gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-xl lg:flex">
      {primaryNav.map((item) => (
        <NavLink key={item.href} href={item.href} label={item.label} pathname={pathname} />
      ))}
    </div>
  );
}

function MobileMenu({ open, setOpen, pathname, adminCheck }) {
  if (!open) return null;

  return (
    <div className="px-4 pt-3 sm:px-6 lg:hidden">
      <div className="premium-surface mx-auto max-w-7xl overflow-hidden rounded-2xl p-4">
        <div className="space-y-2">
          {primaryNav.map((item) => (
            <NavLink
              key={item.href}
              href={item.href}
              label={item.label}
              pathname={pathname}
              onClick={() => setOpen(false)}
            />
          ))}
        </div>

        {(adminCheck?.canCreateEvents || adminCheck?.canAccessAdminPanel) && (
          <>
            <div className="soft-divider my-4" />
            <div className="grid gap-3 sm:grid-cols-2">
              {adminCheck?.canCreateEvents && (
                <Link
                  href="/create-event"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">Create Event</p>
                    <p className="text-xs text-slate-400">Launch a new event listing.</p>
                  </div>
                  <CalendarPlus className="h-5 w-5 text-blue-300" />
                </Link>
              )}
              {adminCheck?.canAccessAdminPanel && (
                <Link
                  href="/admin"
                  onClick={() => setOpen(false)}
                  className="flex items-center justify-between rounded-xl border border-white/[0.06] bg-white/[0.03] px-4 py-3"
                >
                  <div>
                    <p className="text-sm font-semibold text-white">Dashboard</p>
                    <p className="text-xs text-slate-400">Track registrations and reports.</p>
                  </div>
                  <LayoutDashboard className="h-5 w-5 text-amber-300" />
                </Link>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

function HeaderFrame({ adminCheck, rightContent, showLoadingLine = false }) {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const isHomePage = pathname === "/";
  const useSolidShell = scrolled || !isHomePage;

  return (
    <nav className="fixed inset-x-0 top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 pt-4 sm:px-6">
        <div
          className={`relative rounded-2xl px-4 py-3 transition-all duration-300 sm:px-5 ${
            useSolidShell
              ? "premium-surface glow-border"
              : "border border-white/10 bg-[#091424]/62 backdrop-blur-2xl"
          }`}
        >
          <div className="flex items-center justify-between gap-4">
            <Logo />
            <DesktopNav pathname={pathname} />

            <div className="relative z-10 flex items-center gap-2 sm:gap-3">
              {adminCheck?.canAccessAdminPanel && (
                <Button
                  variant="ghost"
                  size="sm"
                  asChild
                  className="hidden rounded-full px-4 text-brand-orange hover:bg-brand-orange/10 hover:text-brand-orange-light lg:inline-flex"
                >
                  <Link href="/admin">
                    <LayoutDashboard className="mr-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
              )}

              {rightContent}

              <button
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-white/10 bg-white/5 text-slate-200 hover:bg-white/10 lg:hidden"
                onClick={() => setMobileMenuOpen((open) => !open)}
                aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
              >
                {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {showLoadingLine && (
            <div className="absolute inset-x-4 bottom-0 overflow-hidden rounded-full">
              <BarLoader width="100%" height={2} color="#29B6F6" speedMultiplier={0.8} />
            </div>
          )}
        </div>
      </div>

      <MobileMenu
        open={mobileMenuOpen}
        setOpen={setMobileMenuOpen}
        pathname={pathname}
        adminCheck={adminCheck}
      />
    </nav>
  );
}

function MockHeader() {
  const { adminCheck } = useMockAuth();

  return (
    <HeaderFrame
      adminCheck={adminCheck}
      rightContent={
        <>
          {adminCheck?.canCreateEvents && (
            <Button
              size="sm"
              asChild
              className="hidden rounded-full bg-sky-600 px-5 text-white shadow-[0_18px_35px_rgba(2,136,209,0.3)] hover:bg-sky-700 sm:inline-flex"
            >
              <Link href="/create-event">
                <CalendarPlus className="mr-2 h-4 w-4" />
                Create Event
              </Link>
            </Button>
          )}
        </>
      }
    />
  );
}

function AuthHeader() {
  const { isLoading } = useStoreUser();
  const { showOnboarding, handleOnboardingComplete, handleOnboardingSkip } = useOnboarding();
  const adminCheck = useQuery(api.admin.isAdmin);

  return (
    <>
      <HeaderFrame
        adminCheck={adminCheck}
        showLoadingLine={isLoading}
        rightContent={
          <>
            <Authenticated>
              {adminCheck?.canCreateEvents && (
                <Button
                  size="sm"
                  asChild
                  className="hidden rounded-full bg-sky-600 px-5 text-white shadow-[0_18px_35px_rgba(2,136,209,0.3)] hover:bg-sky-700 sm:inline-flex"
                >
                  <Link href="/create-event">
                    <CalendarPlus className="mr-2 h-4 w-4" />
                    Create Event
                  </Link>
                </Button>
              )}

              <div className="hidden rounded-full border border-white/10 bg-white/5 p-1 shadow-lg sm:block">
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
                    <UserButton.Link
                      label="My Tickets"
                      labelIcon={<Ticket size={16} />}
                      href="/my-tickets"
                    />
                    <UserButton.Link
                      label="My Events"
                      labelIcon={<CalendarPlus size={16} />}
                      href="/my-events"
                    />
                    <UserButton.Action label="manageAccount" />
                  </UserButton.MenuItems>
                </UserButton>
              </div>
            </Authenticated>

            <Unauthenticated>
              <SignInButton mode="modal">
                <Button
                  size="sm"
                  className="rounded-full bg-sky-600 px-5 text-white shadow-[0_18px_35px_rgba(2,136,209,0.3)] hover:bg-sky-700"
                >
                  <Sparkles className="mr-2 h-4 w-4" />
                  Sign In
                </Button>
              </SignInButton>
            </Unauthenticated>
          </>
        }
      />

      <OnboardingModal
        isOpen={showOnboarding}
        onClose={handleOnboardingSkip}
        onComplete={handleOnboardingComplete}
      />
    </>
  );
}

export default function Header() {
  if (isBackendEnabled) {
    return <AuthHeader />;
  }

  return <MockHeader />;
}
