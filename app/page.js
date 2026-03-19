import React from "react";
import Hero from "@/components/home/Hero";
import AboutEvents from "@/components/home/AboutEvents";
import Statistics from "@/components/home/Statistics";

export default function HomePage() {
  return (
    <div className="-mt-10">
      <Hero />
      <Statistics />
      <AboutEvents />
    </div>
  );
}
