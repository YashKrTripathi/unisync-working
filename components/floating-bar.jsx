"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

// Dot positions: [initial, hovered] as {x, y} in px
// Horizontal row → ∪ shape
const DOT_POSITIONS = [
  { idle: { x: -11, y: 0 }, hover: { x: -10, y: -9 } }, // left  → top-left of U
  { idle: { x: 0,   y: 0 }, hover: { x: 0,   y:  9 } }, // cent  → bottom of U
  { idle: { x: 11,  y: 0 }, hover: { x: 10,  y: -9 } }, // right → top-right of U
];

export default function FloatingBar() {
  const [compressed, setCompressed] = useState(false);
  const [dotHovered, setDotHovered] = useState(false);

  useEffect(() => {
    const threshold = window.innerHeight * 0.8;
    const onScroll = () => setCompressed(window.scrollY > threshold);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 left-5 z-[100]">
      <div className="flex items-center">

        {/* ── White pill ─────────────────────────────────────────────
            max-width animates smoothly unlike width:auto.
            overflow:hidden clips the content as it collapses.       */}
        <div
          className="flex items-center bg-white shadow-2xl overflow-hidden"
          style={{
            borderRadius: "9999px",
            height: "68px",
            // max-width is the key — transitions from full → 56px smoothly
            maxWidth: compressed ? "56px" : "800px",
            padding: "6px",
            paddingRight: compressed ? "6px" : "28px",
            gap: "12px",
            transition: [
              "max-width 0.6s cubic-bezier(0.77,0,0.175,1)",
              "padding-right 0.6s cubic-bezier(0.77,0,0.175,1)",
            ].join(", "),
          }}
        >
          {/* U Logo — always remains, subtle scale pop on expand */}
          <div
            className="shrink-0 bg-black rounded-full flex items-center justify-center"
            style={{
              width: "44px",
              height: "44px",
              minWidth: "44px",
              transform: compressed ? "scale(1)" : "scale(1)",
              transition: "transform 0.4s cubic-bezier(0.34,1.56,0.64,1)",
            }}
          >
            <span className="text-white font-black text-base leading-none select-none">U</span>
          </div>

          {/* Rest of content — fades independently, slightly ahead of collapse */}
          <div
            className="flex items-center shrink-0"
            style={{
              gap: "12px",
              opacity: compressed ? 0 : 1,
              // Fade out faster than collapse, fade in after expand starts
              transition: compressed
                ? "opacity 0.18s ease-out"
                : "opacity 0.35s ease-in 0.25s",
              pointerEvents: compressed ? "none" : "auto",
            }}
          >
            {/* Tagline */}
            <div className="hidden md:flex flex-col justify-center leading-snug shrink-0 border-r border-black/10 pr-3">
              <span className="text-[9px] uppercase font-bold text-black tracking-[0.1em] whitespace-nowrap">University's leading</span>
              <span className="text-[9px] uppercase font-bold text-black tracking-[0.1em] whitespace-nowrap">campus experience.</span>
            </div>

            {/* Location */}
            <span
              className="shrink-0 whitespace-nowrap"
              style={{
                fontFamily: "var(--font-playfair), Georgia, serif",
                fontStyle: "italic",
                fontSize: "clamp(18px, 3.2vw, 40px)",
                fontWeight: 500,
                color: "#000",
                letterSpacing: "0.01em",
              }}
            >
              Akurdi, Pune
            </span>

            {/* Buy Tickets */}
            <Link href="/explore" className="shrink-0">
              <div
                className="border border-black rounded-full flex items-center gap-1.5 group hover:bg-black transition-colors duration-300 cursor-pointer whitespace-nowrap"
                style={{ height: "48px", padding: "0 16px" }}
              >
                <span className="uppercase text-[9px] font-bold tracking-[0.13em] text-black group-hover:text-white transition-colors">
                  Buy Tickets
                </span>
                <ArrowRight className="w-3 h-3 text-black group-hover:text-white group-hover:translate-x-0.5 transition-all" />
              </div>
            </Link>
          </div>
        </div>

        {/* ── Dots button — 3 dots animate into a U on hover ─── */}
        <div
          className="shrink-0 bg-black rounded-full shadow-2xl cursor-pointer active:scale-95"
          style={{
            width: "68px",
            height: "68px",
            marginLeft: "-18px",
            position: "relative",
            opacity: compressed ? 0 : 1,
            transform: compressed ? "scale(0.7)" : "scale(1)",
            pointerEvents: compressed ? "none" : "auto",
            boxShadow: dotHovered
              ? [
                  "0 0 0 1.5px rgba(255,255,255,0.5)",
                  "0 0 14px 5px rgba(255,160,60,0.55)",
                  "0 0 36px 12px rgba(255,255,255,0.12)",
                  "0 8px 24px rgba(0,0,0,0.5)",
                ].join(", ")
              : [
                  "0 0 0 1.5px rgba(255,255,255,0.18)",
                  "0 0 20px 7px rgba(255,140,40,0.22)",
                  "0 6px 20px rgba(0,0,0,0.4)",
                ].join(", "),
            transition: compressed
              ? "opacity 0.2s ease-out, transform 0.25s cubic-bezier(0.4,0,1,1)"
              : "opacity 0.35s ease-in 0.3s, transform 0.4s cubic-bezier(0.34,1.56,0.64,1) 0.3s",
          }}
          onMouseEnter={() => setDotHovered(true)}
          onMouseLeave={() => setDotHovered(false)}
        >
          {DOT_POSITIONS.map((pos, i) => (
            <div
              key={i}
              style={{
                position: "absolute",
                top: "50%",
                left: "50%",
                width: dotHovered ? "6px" : "5px",
                height: dotHovered ? "6px" : "5px",
                borderRadius: "50%",
                background: "white",
                // Smooth spring with per-dot stagger
                transform: `translate(
                  calc(-50% + ${dotHovered ? pos.hover.x : pos.idle.x}px),
                  calc(-50% + ${dotHovered ? pos.hover.y : pos.idle.y}px)
                )`,
                transition: [
                  `transform 0.45s cubic-bezier(0.34,1.56,0.64,1) ${i * 35}ms`,
                  `width 0.3s ease ${i * 35}ms`,
                  `height 0.3s ease ${i * 35}ms`,
                ].join(", "),
              }}
            />
          ))}
        </div>

      </div>
    </div>
  );
}
