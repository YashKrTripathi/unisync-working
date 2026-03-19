"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

const TRACK_HEIGHT = 260;
const THUMB_HEIGHT = 74;
const SMOOTHING = 0.18;
const SNAP_THRESHOLD = 0.0008;

export default function CustomScrollbar() {
  const [isScrollable, setIsScrollable] = useState(false);
  const [animatedProgress, setAnimatedProgress] = useState(0);
  const targetProgressRef = useRef(0);
  const animatedProgressRef = useRef(0);
  const frameRef = useRef(null);

  useEffect(() => {
    const updateScrollState = () => {
      const scrollTop = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;

      setIsScrollable(maxScroll > 24);
      targetProgressRef.current = maxScroll <= 0 ? 0 : scrollTop / maxScroll;
    };

    const animate = () => {
      const target = targetProgressRef.current;
      const current = animatedProgressRef.current;
      const next = current + (target - current) * SMOOTHING;
      const settled =
        Math.abs(target - next) < SNAP_THRESHOLD ? target : next;

      animatedProgressRef.current = settled;
      setAnimatedProgress(settled);
      frameRef.current = window.requestAnimationFrame(animate);
    };

    updateScrollState();
    frameRef.current = window.requestAnimationFrame(animate);
    window.addEventListener("scroll", updateScrollState, { passive: true });
    window.addEventListener("resize", updateScrollState);

    return () => {
      window.removeEventListener("scroll", updateScrollState);
      window.removeEventListener("resize", updateScrollState);
      if (frameRef.current) {
        window.cancelAnimationFrame(frameRef.current);
      }
    };
  }, []);

  const thumbOffset = useMemo(() => {
    const travel = TRACK_HEIGHT - THUMB_HEIGHT;
    return Math.max(0, Math.min(travel, travel * animatedProgress));
  }, [animatedProgress]);

  if (!isScrollable) {
    return null;
  }

  return (
    <div className="pointer-events-none fixed right-2 top-1/2 z-[65] hidden -translate-y-1/2 lg:block">
      <button
        type="button"
        aria-label="Scroll page"
        className="pointer-events-auto relative flex w-[18px] items-start justify-center rounded-full bg-transparent"
        style={{ height: `${TRACK_HEIGHT}px` }}
        onClick={(event) => {
          const rect = event.currentTarget.getBoundingClientRect();
          const clickY = event.clientY - rect.top;
          const nextProgress = Math.max(0, Math.min(1, clickY / rect.height));
          const maxScroll =
            document.documentElement.scrollHeight - window.innerHeight;

          targetProgressRef.current = nextProgress;
          window.scrollTo({
            top: nextProgress * maxScroll,
            behavior: "smooth",
          });
        }}
      >
        <span
          aria-hidden="true"
          className="absolute inset-y-0 left-1/2 w-[12px] -translate-x-1/2 overflow-hidden rounded-full bg-[rgba(255,255,255,0.96)] shadow-[0_0_0_1px_rgba(255,255,255,0.22),0_6px_18px_rgba(0,0,0,0.18)]"
        >
          <span
            aria-hidden="true"
            className="absolute left-1/2 w-[8px] -translate-x-1/2 rounded-full bg-[linear-gradient(180deg,#ff5a1f_0%,#ff6f1f_28%,#ff9a3b_74%,#ffd1a8_100%)] shadow-[0_2px_6px_rgba(255,122,31,0.14)] will-change-transform"
            style={{
              height: `${THUMB_HEIGHT}px`,
              top: `${thumbOffset}px`,
            }}
          />
        </span>
      </button>
    </div>
  );
}
