"use client";

import { useEffect } from "react";

export default function NotFoundBodyClass() {
  useEffect(() => {
    document.body.classList.add("is-not-found");
    return () => {
      document.body.classList.remove("is-not-found");
    };
  }, []);

  return null;
}
