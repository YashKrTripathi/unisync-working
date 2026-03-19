"use client";

import React from "react";
import { SignIn, SignedIn, SignedOut, UserButton } from "@clerk/nextjs";

const heroStats = [
  { value: "45+", label: "Active Clubs" },
  { value: "200+", label: "Annual Events" },
  { value: "12k+", label: "Students" },
];

export default function Hero() {
  return (
    <section className="relative min-h-screen overflow-hidden bg-[#0e0d0d]">
      <img
        src="/hero-background.png"
        alt=""
        aria-hidden="true"
        className="absolute inset-0 h-full w-full object-cover grayscale"
      />
      <div className="absolute inset-0 bg-[#0b0a0a]/78" />
      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,8,8,0.9)_0%,rgba(14,12,12,0.72)_42%,rgba(13,12,12,0.6)_100%)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,173,115,0.09),transparent_38%)]" />

      <div className="relative mx-auto flex min-h-screen w-full max-w-[1600px] items-center px-5 pb-16 pt-36 md:px-8 lg:px-12 xl:px-16">
        <div className="grid w-full items-center gap-12 xl:gap-20 lg:grid-cols-[minmax(0,1fr)_460px]">
          <div className="min-w-0 max-w-[700px]">
            <div className="mb-8 inline-flex items-center rounded-sm bg-[#a24c23] px-4 py-2 text-[11px] font-bold uppercase tracking-[0.22em] text-[#ffd1b4]">
              Official Portal
            </div>

            <h1 className="font-sans text-[clamp(4.3rem,8vw,7.4rem)] font-black uppercase leading-[0.88] tracking-[-0.07em] text-[#ffb18a]">
              <span className="block text-white">D Y Patil</span>
              <span className="block">International</span>
              <span className="block">University</span>
            </h1>

            <p className="mt-8 max-w-[620px] text-[clamp(1rem,1.45vw,1.35rem)] leading-[1.75] text-[#f3ba9b]">
              The Pulse of Campus Life. Centralizing event coordination,
              venue booking, and student engagement in one seamless
              ecosystem.
            </p>

            <div className="mt-12 grid max-w-[620px] grid-cols-3 gap-6 border-t border-white/10 pt-8">
              {heroStats.map((stat) => (
                <div key={stat.label}>
                  <div className="text-[clamp(1.8rem,3vw,2.5rem)] font-black leading-none text-[#ff9a63]">
                    {stat.value}
                  </div>
                  <div className="mt-2 text-[11px] font-bold uppercase tracking-[0.2em] text-[#f2b797]">
                    {stat.label}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-center lg:justify-end">
            <div className="w-full max-w-[440px] rounded-[2px] bg-[#161312]/92 p-4 shadow-[0_20px_70px_rgba(0,0,0,0.45)] backdrop-blur-sm sm:p-5">
              <div className="bg-[#1a1614] p-4 sm:p-5">
                <SignedOut>
                  <div className="[&_.cl-rootBox]:w-full [&_.cl-card]:w-full [&_.cl-card]:max-w-none [&_.cl-card]:border-0 [&_.cl-card]:bg-transparent [&_.cl-card]:shadow-none [&_.cl-headerTitle]:text-white [&_.cl-headerTitle]:text-[2rem] [&_.cl-headerTitle]:tracking-[-0.04em] [&_.cl-headerSubtitle]:text-[#b19b90] [&_.cl-socialButtonsBlockButton]:border-0 [&_.cl-socialButtonsBlockButton]:bg-[#211c19] [&_.cl-socialButtonsBlockButton]:text-white [&_.cl-socialButtonsBlockButton]:shadow-none [&_.cl-socialButtonsBlockButton]:hover:bg-[#2b2522] [&_.cl-dividerLine]:bg-[#2d2927] [&_.cl-dividerText]:text-[#8f7d73] [&_.cl-formFieldLabel]:text-[#8f7d73] [&_.cl-formFieldLabel]:uppercase [&_.cl-formFieldLabel]:tracking-[0.16em] [&_.cl-formFieldLabel]:text-[11px] [&_.cl-formFieldInput]:h-14 [&_.cl-formFieldInput]:border-0 [&_.cl-formFieldInput]:bg-[#2b2725] [&_.cl-formFieldInput]:text-white [&_.cl-formFieldInput]:placeholder:text-[#786c66] [&_.cl-formFieldInput]:shadow-none [&_.cl-formFieldInput]:focus:border-0 [&_.cl-formFieldInput]:focus:ring-0 [&_.cl-footerActionText]:text-[#8d7b72] [&_.cl-footerActionLink]:text-[#ef8a4a] [&_.cl-footerActionLink]:hover:text-[#ffb28f] [&_.cl-formButtonPrimary]:h-14 [&_.cl-formButtonPrimary]:border-0 [&_.cl-formButtonPrimary]:bg-[linear-gradient(90deg,#ffb28f_0%,#ff7f1d_100%)] [&_.cl-formButtonPrimary]:text-[#25160e] [&_.cl-formButtonPrimary]:text-[13px] [&_.cl-formButtonPrimary]:font-black [&_.cl-formButtonPrimary]:uppercase [&_.cl-formButtonPrimary]:tracking-[0.12em] [&_.cl-formButtonPrimary]:shadow-none [&_.cl-formButtonPrimary]:hover:bg-[linear-gradient(90deg,#ffc0a2_0%,#ff8d39_100%)]">
                    <SignIn
                      routing="hash"
                      signUpUrl="/sign-up"
                      fallbackRedirectUrl="/admin"
                    />
                  </div>
                </SignedOut>

                <SignedIn>
                  <div className="flex min-h-[520px] flex-col items-center justify-center px-6 py-10 text-center">
                    <div className="mb-6 rounded-full ring-2 ring-white/20">
                      <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                          elements: {
                            avatarBox: "w-20 h-20",
                            userButtonPopoverFooter: "hidden",
                          },
                        }}
                      />
                    </div>
                    <h2 className="text-[2rem] font-bold tracking-[-0.04em] text-white">
                      Authentication Active
                    </h2>
                    <p className="mt-3 max-w-[280px] text-sm leading-relaxed text-[#b19b90]">
                      Your account is signed in with Clerk. Continue to the dashboard
                      or manage your session from the profile menu.
                    </p>
                    <a
                      href="/admin"
                      className="mt-8 flex h-14 w-full max-w-[300px] items-center justify-center bg-gradient-to-r from-[#ffb28f] to-[#ff7f1d] text-[13px] font-black uppercase tracking-[0.12em] text-[#25160e] transition-transform duration-300 hover:scale-[1.01]"
                    >
                      Continue to Admin
                    </a>
                  </div>
                </SignedIn>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
