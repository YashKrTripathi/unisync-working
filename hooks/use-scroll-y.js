"use client";
import { useEffect, useState } from "react";

/**
 * Returns live window.scrollY, throttled to rAF.
 */
export function useScrollY() {
    const [scrollY, setScrollY] = useState(0);
    useEffect(() => {
        let raf;
        const handler = () => {
            raf = requestAnimationFrame(() => setScrollY(window.scrollY));
        };
        window.addEventListener("scroll", handler, { passive: true });
        return () => {
            window.removeEventListener("scroll", handler);
            if (raf) cancelAnimationFrame(raf);
        };
    }, []);
    return scrollY;
}
