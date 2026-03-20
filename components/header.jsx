"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Menu,
  X,
  Ticket,
} from "lucide-react";
import { SignInButton, UserButton, SignedIn, SignedOut } from "@clerk/nextjs";
import { useStoreUser } from "@/hooks/use-store-user";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";

const isBackendEnabled = Boolean(
  process.env.NEXT_PUBLIC_CONVEX_URL &&
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
);

const STAFF_ROLES = new Set(["organiser", "superadmin", "owner"]);

const NAV_ITEMS = [
  { href: "/", label: "Home" },
  { href: "/events", label: "Events" },
  { href: "/pitch-event", label: "Pitch Event" },
  { href: "/contact-us", label: "Contact Us" },
  { href: "/location", label: "Location" },
  { href: "/partner", label: "Partner" },
  { href: "/faq", label: "FAQ" },
];

function Logo() {
  return (
    <Link
      href="/"
      className="relative z-10 flex items-center gap-2.5 rounded-full px-1.5 py-1"
    >
      <img
        src="/unisync-logo.svg"
        alt="Uni Sync logo"
        className="h-9 w-9 shrink-0 rounded-[10px] object-contain"
      />
      <span className="whitespace-nowrap text-[18px] font-semibold tracking-[-0.03em] text-white">
        Uni Sync
      </span>
    </Link>
  );
}

function DesktopNav() {
  const pathname = usePathname();

  return (
    <div className="hidden items-center gap-0.5 rounded-full border border-white/55 bg-black/78 p-1 shadow-[inset_0_1px_0_rgba(255,255,255,0.08)] backdrop-blur-xl xl:flex">
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;

        return (
          <Link
            key={item.href}
            href={item.href}
            className={`rounded-full px-4 py-1.5 text-[14px] font-medium tracking-[-0.01em] transition-all duration-300 ${
              isActive
                ? "bg-white text-black shadow-[0_4px_14px_rgba(255,255,255,0.18)]"
                : "text-white/88 hover:bg-white/[0.08] hover:text-white"
            }`}
          >
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}

function AuthAction({ useClerk = false, canManageEvents = false }) {
  if (!useClerk) {
    return (
      <div className="hidden items-center xl:flex">
        <Link
          href="/sign-in"
          className="rounded-full bg-[#ef8a4a] px-4 py-1.5 text-[14px] font-semibold text-black transition-colors hover:bg-[#f29a63]"
        >
          Sign In
        </Link>
      </div>
    );
  }

  return (
    <div className="hidden items-center gap-2 xl:flex">
      {canManageEvents ? (
        <SignedIn>
          <Link
            href="/admin/events"
            className="rounded-full border border-[#ef8a4a]/30 bg-[#ef8a4a]/15 px-3 py-1.5 text-[13px] font-semibold text-[#ffd4b2] transition-colors hover:border-[#ef8a4a]/60 hover:bg-[#ef8a4a]/25"
          >
            Manage Events
          </Link>
        </SignedIn>
      ) : null}

      <SignedIn>
        <UserButton
          afterSignOutUrl="/"
          appearance={{
            elements: {
              userButtonTrigger: "ml-1 h-9 w-9 rounded-full p-0 transition-transform duration-300 hover:scale-[1.03]",
              userButtonBox: "h-9 w-9 overflow-hidden rounded-full",
              userButtonAvatarBox: "h-9 w-9 overflow-hidden rounded-full",
              avatarBox: "h-9 w-9 overflow-hidden rounded-full shrink-0",
              avatarImage: "h-full w-full rounded-full object-cover",
              userButtonPopoverCard: "rounded-2xl border border-white/10 shadow-2xl bg-[#0f0e16]/95 text-white min-w-[280px]",
              userButtonPopoverHeader: "border-b border-white/10 bg-[#0f0e16]/80",
              userButtonPopoverActionButton: "hover:bg-white/5",
              userButtonPopoverActions: "bg-transparent",
              userButtonPopoverFooter: "hidden",
              userButtonPopoverText: "text-white",
            },
          }}
        >
          <UserButton.MenuItems>
            <UserButton.Link
              href="/my-tickets"
              label="My Tickets"
              labelIcon={<Ticket className="h-4 w-4" />}
            />
          </UserButton.MenuItems>
        </UserButton>
      </SignedIn>

      <SignedOut>
        <SignInButton mode="modal">
          <button className="rounded-full bg-[#ef8a4a] px-4 py-1.5 text-[14px] font-semibold text-black transition-colors hover:bg-[#f29a63]">
            Sign In
          </button>
        </SignInButton>
      </SignedOut>
    </div>
  );
}

function MobileMenuToggle({ open, setOpen }) {
  return (
    <button
      className="ml-2 rounded-full border border-white/10 bg-white/5 p-2.5 text-white transition-colors hover:bg-white/10 xl:hidden"
      onClick={() => setOpen(!open)}
    >
      {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
    </button>
  );
}

function MobileMenu({ open, setOpen, useClerk = false, canManageEvents = false }) {
  if (!open) return null;

  return (
    <div className="mx-auto mt-3 w-full max-w-[900px] rounded-[28px] border border-white/10 bg-[#050505]/90 p-4 shadow-2xl backdrop-blur-3xl xl:hidden">
      <div className="space-y-2">
        {NAV_ITEMS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="block rounded-2xl px-4 py-3 font-medium text-white transition-colors hover:bg-white/10"
            onClick={() => setOpen(false)}
          >
            {link.label}
          </Link>
        ))}
        <div className="pt-3">
          {useClerk ? (
            <>
              <SignedIn>
                <div className="flex justify-center">
                  <UserButton
                    afterSignOutUrl="/"
                    appearance={{
                      elements: {
                        userButtonTrigger: "h-10 w-10 rounded-full p-0",
                        userButtonBox: "h-10 w-10 overflow-hidden rounded-full",
                        userButtonAvatarBox: "h-10 w-10 overflow-hidden rounded-full",
                        avatarBox: "h-10 w-10 overflow-hidden rounded-full shrink-0",
                        avatarImage: "h-full w-full rounded-full object-cover",
                        userButtonPopoverFooter: "hidden",
                      },
                    }}
                  />
                </div>
              </SignedIn>
              <SignedOut>
                <SignInButton mode="modal">
                  <button
                    className="w-full rounded-2xl bg-[#ef8a4a] px-4 py-3 text-center font-semibold text-black transition-colors hover:bg-[#f29a63]"
                    onClick={() => setOpen(false)}
                  >
                    Sign In
                  </button>
                </SignInButton>
              </SignedOut>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="block w-full rounded-2xl bg-[#ef8a4a] px-4 py-3 text-center font-semibold text-black transition-colors hover:bg-[#f29a63]"
              onClick={() => setOpen(false)}
            >
              Sign In
            </Link>
          )}
          {canManageEvents ? (
            <SignedIn>
              <div className="mt-3">
                <Link
                  href="/admin/events"
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl border border-[#ef8a4a]/40 bg-[#ef8a4a]/15 px-3 py-2 text-center text-sm font-semibold text-[#ffd4b2] hover:border-[#ef8a4a]/70 hover:bg-[#ef8a4a]/25"
                >
                  Manage Events
                </Link>
              </div>
            </SignedIn>
          ) : null}
        </div>
      </div>
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

function HeaderFrame({
  scrolled,
  mobileMenuOpen,
  setMobileMenuOpen,
  rightContent,
  useClerk = false,
  canManageEvents = false,
}) {
  return (
    <div className="fixed left-0 right-0 top-0 z-50 px-4 pt-3 md:px-6">
      <nav
        className={`relative mx-auto flex w-full items-center justify-between rounded-full border px-3 py-2 transition-all duration-300 animate-[dock-pop-in_720ms_cubic-bezier(0.22,1,0.36,1)] md:px-4 xl:max-w-max xl:justify-start xl:gap-2.5 ${
          scrolled
            ? "border-white/28 bg-black/74 shadow-[0_16px_36px_rgba(0,0,0,0.24)] backdrop-blur-xl"
            : "border-white/22 bg-black/58 shadow-[0_12px_28px_rgba(0,0,0,0.18)] backdrop-blur-lg"
        }`}
      >
        <div className="pointer-events-none absolute inset-x-10 -inset-y-2 hidden rounded-full bg-white/18 blur-2xl xl:block" />

        <div className="relative z-10 flex shrink-0 items-center">
          <Logo />
        </div>

        <div className="hidden items-center xl:flex">
          <DesktopNav />
        </div>

        <div className="relative z-10 ml-auto flex shrink-0 items-center gap-2 xl:ml-0">
          {rightContent}
          <MobileMenuToggle open={mobileMenuOpen} setOpen={setMobileMenuOpen} />
        </div>
      </nav>

      <MobileMenu
        open={mobileMenuOpen}
        setOpen={setMobileMenuOpen}
        useClerk={useClerk}
        canManageEvents={canManageEvents}
      />
    </div>
  );
}

function MockHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const scrolled = useScrollDirection();

  return (
    <HeaderFrame
      scrolled={scrolled}
      mobileMenuOpen={mobileMenuOpen}
      setMobileMenuOpen={setMobileMenuOpen}
      rightContent={<AuthAction useClerk={false} canManageEvents={false} />}
      useClerk={false}
      canManageEvents={false}
    />
  );
}

function AuthHeader() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  useStoreUser();
  const { data: adminCheck } = useConvexQuery(api.admin.isAdmin);
  const scrolled = useScrollDirection();
  const canManageEvents = STAFF_ROLES.has(adminCheck?.role);

  return (
    <HeaderFrame
      scrolled={scrolled}
      mobileMenuOpen={mobileMenuOpen}
      setMobileMenuOpen={setMobileMenuOpen}
      rightContent={<AuthAction useClerk={true} canManageEvents={canManageEvents} />}
      useClerk={true}
      canManageEvents={canManageEvents}
    />
  );
}

export default function Header() {
  if (isBackendEnabled) {
    return <AuthHeader />;
  }

  return <MockHeader />;
}
