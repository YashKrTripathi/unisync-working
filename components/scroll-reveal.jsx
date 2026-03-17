"use client";
import { useRef, useState, useEffect } from "react";

/**
 * Wraps children in a div that animates them in when they enter the viewport.
 * Props:
 *  delay     - ms delay before animation starts (stagger)
 *  y         - initial translateY offset in px (default 48)
 *  blur      - start with blur(20px) and clear on enter
 *  once      - animate only once (default true)
 *  className - extra classes on wrapper
 *  threshold - IntersectionObserver threshold (default 0.15)
 */
export default function ScrollReveal({
    children,
    delay = 0,
    y = 48,
    blur = false,
    once = true,
    className = "",
    threshold = 0.15,
}) {
    const ref = useRef(null);
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const obs = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setVisible(true);
                    if (once) obs.disconnect();
                } else if (!once) {
                    setVisible(false);
                }
            },
            { threshold }
        );
        obs.observe(el);
        return () => obs.disconnect();
    }, [once, threshold]);

    return (
        <div
            ref={ref}
            className={className}
            style={{
                opacity: visible ? 1 : 0,
                transform: visible ? "translateY(0px)" : `translateY(${y}px)`,
                filter: blur ? (visible ? "blur(0px)" : "blur(20px)") : undefined,
                transition: [
                    `opacity 0.75s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`,
                    `transform 0.75s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms`,
                    blur ? `filter 0.85s cubic-bezier(0.25,0.46,0.45,0.94) ${delay}ms` : null,
                ]
                    .filter(Boolean)
                    .join(", "),
            }}
        >
            {children}
        </div>
    );
}
