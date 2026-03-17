import React from "react";
import Link from "next/link";
import { ExternalLink, Mail, MapPin, Phone } from "lucide-react";

const productLinks = [
  { label: "Explore Events", href: "/explore" },
  { label: "Past Events", href: "/past-events" },
  { label: "My Tickets", href: "/my-tickets" },
  { label: "My Events", href: "/my-events" },
];

const platformLinks = [
  { label: "Create Event", href: "/create-event" },
  { label: "Attendance", href: "/attendance" },
  { label: "Dashboard", href: "/admin" },
  { label: "Reports", href: "/admin/reports" },
];

function LogoMark() {
  return (
    <svg width="24" height="24" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M6 6L16 2L26 6L26 20L16 30L6 20Z" fill="#0288D1" fillOpacity="0.9" />
      <path d="M6 6L16 16L6 20Z" fill="#43A047" fillOpacity="0.85" />
      <path d="M26 6L16 16L26 20Z" fill="#F9A825" fillOpacity="0.85" />
      <path d="M16 16L6 20L16 30L26 20Z" fill="#1B3064" fillOpacity="0.9" />
      <circle cx="16" cy="12" r="3" fill="white" fillOpacity="0.95" />
    </svg>
  );
}

export default function Footer() {
  return (
    <footer className="relative mt-10 border-t border-white/[0.06]">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-12">
        <div className="grid gap-10 lg:grid-cols-[1.25fr_0.75fr_0.75fr_0.9fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 bg-[#0a1528] shadow-lg">
                <LogoMark />
              </div>
              <div>
                <p className="font-display text-xl font-semibold tracking-tight text-white">
                  UniSync
                </p>
                <p className="text-[11px] uppercase tracking-wider text-slate-500">
                  DYPIU Event Platform
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-400">
              D. Y. Patil International University, Akurdi, Pune. A unified platform for
              campus event discovery, registration, attendance, and reporting.
            </p>

            <div className="space-y-2.5 text-sm text-slate-400">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-slate-500" />
                <span>Pimpri, Pune, Maharashtra 411018</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-slate-500" />
                <a href="tel:+912027420000" className="transition-colors hover:text-white">
                  +91 20 2742 0000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-slate-500" />
                <a href="mailto:events@dypiu.ac.in" className="transition-colors hover:text-white">
                  events@dypiu.ac.in
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Product
            </h3>
            <div className="space-y-3">
              {productLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Platform
            </h3>
            <div className="space-y-3">
              {platformLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-slate-400 transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://www.dypiu.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-slate-400 transition-colors hover:text-white"
              >
                DYPIU Website
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.06] bg-white/[0.03] p-5">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
              About UniSync
            </p>
            <p className="mt-3 text-sm leading-6 text-slate-400">
              Built for student communities, clubs, and campus operations teams. Discover events,
              register with one tap, check in via QR, and generate reports instantly.
            </p>
          </div>
        </div>

        <div className="soft-divider mt-10" />

        <div className="mt-6 flex flex-col gap-3 text-sm text-slate-500 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} UniSync for DYPIU. All rights reserved.</p>
          <p className="text-xs">Designed for student communities and campus operations.</p>
        </div>
      </div>
    </footer>
  );
}
