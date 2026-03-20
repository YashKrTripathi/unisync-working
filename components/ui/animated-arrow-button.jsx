"use client";

import Link from "next/link";
import { ArrowLeft, ArrowRight, ArrowUpRight } from "lucide-react";

const iconMap = {
  left: ArrowLeft,
  right: ArrowRight,
  upRight: ArrowUpRight,
};

export default function AnimatedArrowButton({
  href,
  children,
  icon = "right",
  color = "#adff2f",
  textColor = "#212121",
  className = "",
}) {
  const Icon = iconMap[icon] || ArrowRight;

  return (
    <Link
      href={href}
      className={`animated-button ${className}`.trim()}
      style={{
        "--animated-button-color": color,
        "--animated-button-text": textColor,
      }}
    >
      <Icon className="arr-2" aria-hidden="true" />
      <span className="text">{children}</span>
      <span className="circle" aria-hidden="true" />
      <Icon className="arr-1" aria-hidden="true" />
    </Link>
  );
}
