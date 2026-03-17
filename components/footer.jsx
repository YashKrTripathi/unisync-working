import React from "react";
import Link from "next/link";
import { ArrowRight, ExternalLink, Mail, MapPin, Phone } from "lucide-react";
import { Button } from "@/components/ui/button";

const productLinks = [
  { label: "Explore Events", href: "/explore" },
  { label: "Past Events", href: "/past-events" },
  { label: "My Tickets", href: "/my-tickets" },
  { label: "My Events", href: "/my-events" },
];

const supportLinks = [
  { label: "Create Event", href: "/create-event" },
  { label: "Attendance", href: "/attendance" },
  { label: "Reports", href: "/admin/reports" },
];

export default function Footer() {
  return (
    <footer className="relative mt-10 border-t border-white/10">
      <div className="mx-auto max-w-7xl px-6 pb-10 pt-12">
        <div className="premium-surface rounded-[2rem] p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div className="space-y-4">
              <div className="eyebrow">
                <span>Built for campus momentum</span>
              </div>
              <h2 className="section-heading text-3xl text-white md:text-4xl">
                Make every event feel organized before attendees even arrive.
              </h2>
              <p className="max-w-2xl text-base leading-7 text-slate-300">
                UniSync brings discovery, registration, attendance, and reporting into one
                professional workflow for students, clubs, and university teams.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <Button
                asChild
                size="xl"
                className="rounded-full bg-primary text-primary-foreground shadow-[0_20px_40px_rgba(44,126,248,0.25)] hover:bg-primary/90"
              >
                <Link href="/explore">
                  Explore Events
                  <ArrowRight className="h-5 w-5" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="xl"
                className="rounded-full border-white/12 bg-white/5 text-white hover:bg-white/10"
              >
                <Link href="/create-event">Launch an Event</Link>
              </Button>
            </div>
          </div>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.25fr_0.75fr_0.75fr_0.9fr]">
          <div className="space-y-5">
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-white/15 bg-gradient-to-br from-blue-500 to-[#102347] text-white shadow-[0_18px_35px_rgba(26,89,191,0.32)]">
                <span className="font-display text-sm font-bold tracking-[0.28em]">UN</span>
              </div>
              <div>
                <p className="font-display text-xl font-semibold tracking-[-0.06em] text-white">
                  UniSync
                </p>
                <p className="text-[11px] uppercase tracking-[0.28em] text-slate-400">
                  DYPIU Event Platform
                </p>
              </div>
            </div>

            <p className="max-w-md text-sm leading-7 text-slate-400">
              D. Y. Patil International University, Akurdi, Pune. A cleaner way to run
              student experiences, flagship events, and campus communities at scale.
            </p>

            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-center gap-3">
                <MapPin className="h-4 w-4 text-dypiu-gold-light" />
                <span>Pimpri, Pune, Maharashtra 411018</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone className="h-4 w-4 text-dypiu-gold-light" />
                <a href="tel:+912027420000" className="hover:text-white">
                  +91 20 2742 0000
                </a>
              </div>
              <div className="flex items-center gap-3">
                <Mail className="h-4 w-4 text-dypiu-gold-light" />
                <a href="mailto:events@dypiu.ac.in" className="hover:text-white">
                  events@dypiu.ac.in
                </a>
              </div>
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              Product
            </h3>
            <div className="space-y-3">
              {productLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-slate-400 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          <div>
            <h3 className="mb-4 text-sm font-semibold uppercase tracking-[0.22em] text-slate-300">
              Platform
            </h3>
            <div className="space-y-3">
              {supportLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block text-sm text-slate-400 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
              <a
                href="https://www.dypiu.ac.in"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
              >
                DYPIU Website
                <ExternalLink className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>

          <div className="premium-card rounded-[1.6rem] p-5">
            <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-400">
              Campus support
            </p>
            <div className="mt-4 space-y-4">
              <div>
                <p className="text-sm font-semibold text-white">Professional launch flow</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Guide organizers from creation to reporting with a clearer workflow.
                </p>
              </div>
              <div>
                <p className="text-sm font-semibold text-white">Student-friendly discovery</p>
                <p className="mt-1 text-sm leading-6 text-slate-400">
                  Make high-value events easier to find, trust, and attend.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="soft-divider mt-10" />

        <div className="mt-6 flex flex-col gap-3 text-sm text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>&copy; {new Date().getFullYear()} UniSync for DYPIU. All rights reserved.</p>
          <p>Designed for student communities, clubs, and campus operations teams.</p>
        </div>
      </div>
    </footer>
  );
}
