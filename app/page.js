import React from "react";
import Hero from "@/components/home/Hero";
import AboutEvents from "@/components/home/AboutEvents";
import UpcomingEvents from "@/components/home/UpcomingEvents";
import Statistics from "@/components/home/Statistics";
import QuickActions from "@/components/home/QuickActions";

export default function HomePage() {
  return (
    <div className="-mt-10">
      <Hero />
      <AboutEvents />
      <UpcomingEvents />
      <Statistics />
      <QuickActions />
    </div>
  );
}
