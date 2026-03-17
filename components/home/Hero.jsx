"use client";

import React, { useRef, useState, useCallback, useEffect } from "react";
import { useScrollY } from "@/hooks/use-scroll-y";

export default function Hero() {
    const textRef = useRef(null);
    const [tilt, setTilt] = useState({ x: 0, skew: 0 });
    const [isHovered, setIsHovered] = useState(false);
    const rafRef = useRef(null);

    // ── Scroll-driven values ──────────────────────────────────────
    const scrollY = useScrollY();
    const vh = typeof window !== "undefined" ? window.innerHeight : 800;
    const p = Math.min(Math.max(scrollY / (vh * 0.75), 0), 1);
    const scrollScale   = 1 + p * 1.1;
    const scrollBlur    = p * 38;
    const scrollOpacity = Math.max(0, 1 - p * 2.2);
    const bgParallaxY   = scrollY * -0.28;

    // ── Mouse / touch tilt ───────────────────────────────────────
    const handleMouseMove = useCallback((e) => {
        if (!textRef.current) return;
        const rect = textRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const offsetX = (e.clientX - centerX) / (rect.width / 2);
        const targetX = offsetX * 24;
        const targetSkew = offsetX * -3;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => {
            setTilt(prev => ({
                x: prev.x + (targetX - prev.x) * 0.1,
                skew: prev.skew + (targetSkew - prev.skew) * 0.1,
            }));
        });
    }, []);

    const handleMouseLeave = useCallback(() => {
        setIsHovered(false);
        const ease = () => {
            setTilt(prev => {
                const nx = prev.x * 0.88;
                const ns = prev.skew * 0.88;
                if (Math.abs(nx) > 0.1 || Math.abs(ns) > 0.01)
                    rafRef.current = requestAnimationFrame(ease);
                return { x: nx, skew: ns };
            });
        };
        rafRef.current = requestAnimationFrame(ease);
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (e.touches[0]) handleMouseMove(e.touches[0]);
    }, [handleMouseMove]);

    return (
        <section
            className="relative w-full overflow-hidden bg-[#120204]"
            style={{ height: "100vh" }}
        >
            {/* ── Base colour ─── */}
            <div className="absolute inset-0 z-0 bg-[#120204]" />

            {/* ── Rotating burst image + parallax ─── */}
            <div
                className="absolute inset-0 z-[1] flex items-center justify-center pointer-events-none"
                style={{ transform: `translateY(${bgParallaxY}px)` }}
            >
                <div style={{
                    width: "140vmax", height: "140vmax",
                    animation: "heroBurstSpin 40s linear infinite",
                    willChange: "transform",
                }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                        src="/hero-burst.png"
                        alt=""
                        aria-hidden="true"
                        style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 1 }}
                    />
                </div>
            </div>

            {/* ── Grain ─── */}
            <div className="absolute inset-0 z-[2] bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] mix-blend-overlay pointer-events-none" />

            {/* ── Vignettes ─── */}
            <div className="absolute top-0 left-0 right-0 z-[3] pointer-events-none"
                style={{ height: "90px", background: "linear-gradient(to bottom, rgba(0,0,0,0.65), transparent)" }} />
            <div className="absolute bottom-0 left-0 right-0 z-[3] pointer-events-none"
                style={{ height: "140px", background: "linear-gradient(to top, rgba(0,0,0,0.65), transparent)" }} />

            {/* ── Glow blob ─── */}
            <div
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-[4] pointer-events-none"
                style={{
                    width: "80vw", height: "55vh",
                    background: "radial-gradient(ellipse at center, rgba(255,255,255,0.18) 0%, rgba(255,200,80,0.08) 40%, transparent 75%)",
                    filter: "blur(32px)",
                    borderRadius: "50%",
                }}
            />

            {/* ── SCROLL ZOOM + BLUR (Nameless signature effect) ─── */}
            <div
                style={{
                    position: "absolute",
                    inset: 0,
                    zIndex: 10,
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    paddingTop: "80px",
                    paddingBottom: "88px",
                    transform: `scale(${scrollScale})`,
                    filter: `blur(${scrollBlur}px)`,
                    opacity: scrollOpacity,
                    transformOrigin: "center center",
                    willChange: "transform, filter, opacity",
                    pointerEvents: scrollOpacity < 0.1 ? "none" : "auto",
                }}
            >
                {/* ── Tilt / hover layer ─── */}
                <div
                    ref={textRef}
                    className="flex flex-col items-center select-none cursor-default"
                    style={{ paddingTop: "36px" }}
                    onMouseMove={(e) => { setIsHovered(true); handleMouseMove(e); }}
                    onMouseLeave={handleMouseLeave}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleMouseLeave}
                >
                    {/* UNISYNC */}
                    <h1
                        style={{
                            fontSize: "clamp(72px, min(23vw, 40vh), 420px)",
                            lineHeight: 0.85,
                            fontFamily: "var(--font-anton), sans-serif",
                            fontWeight: 900,
                            letterSpacing: "-0.03em",
                            textTransform: "uppercase",
                            color: "white",
                            textAlign: "center",
                            textShadow: isHovered
                                ? [
                                    `${tilt.x * 0.5}px 0 40px rgba(255,180,60,0.9)`,
                                    "0 0 80px rgba(255,255,255,0.6)",
                                    "0 0 200px rgba(255,255,255,0.2)",
                                  ].join(", ")
                                : [
                                    "0 0 60px rgba(255,255,255,0.75)",
                                    "0 0 120px rgba(255,200,80,0.45)",
                                    "0 0 200px rgba(255,255,255,0.2)",
                                  ].join(", "),
                            transform: `translateX(${tilt.x}px) skewX(${tilt.skew}deg)`,
                            transition: isHovered ? "none" : "transform 0.7s cubic-bezier(0.25,0.46,0.45,0.94)",
                            animation: "heroIdle 7s ease-in-out infinite",
                            willChange: "transform",
                        }}
                    >
                        UNISYNC
                    </h1>

                    {/* D.Y.P.I.U , PUNE */}
                    <div
                        className="mt-4"
                        style={{
                            transform: `translateX(${-tilt.x * 0.55}px) skewX(${-tilt.skew * 0.45}deg)`,
                            transition: isHovered ? "none" : "transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)",
                            textShadow: isHovered
                                ? `${-tilt.x * 0.35}px 0 32px rgba(255,120,60,0.55)`
                                : "0 2px 20px rgba(255,120,60,0.45)",
                        }}
                    >
                        <span style={{
                            fontFamily: "var(--font-playfair), Georgia, serif",
                            fontStyle: "italic",
                            fontSize: "clamp(28px, min(7.5vw, 12vh), 100px)",
                            color: "rgba(255,255,255,0.90)",
                            letterSpacing: "0.01em",
                        }}>
                            D.Y.P.I.U , PUNE
                        </span>
                    </div>
                </div>
            </div>

            {/* ── Keyframes ─── */}
            <style>{`
                @keyframes heroBurstSpin {
                    from { transform: rotate(0deg); }
                    to   { transform: rotate(360deg); }
                }
                @keyframes heroIdle {
                    0%, 100% { transform: translateX(0px)  skewX(0deg); }
                    30%      { transform: translateX(-7px) skewX(0.25deg); }
                    70%      { transform: translateX(7px)  skewX(-0.25deg); }
                }
            `}</style>
        </section>
    );
}
