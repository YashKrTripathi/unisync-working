"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, ArrowRight, Loader2, Sparkles, Compass } from "lucide-react";
import { format } from "date-fns";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { createLocationSlug } from "@/lib/location-utils";
import Image from "next/image";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { CATEGORIES } from "@/lib/data";
import Autoplay from "embla-carousel-autoplay";
import EventCard from "@/components/event-card";

export default function ExplorePage() {
  const router = useRouter();
  const plugin = useRef(Autoplay({ delay: 3500, stopOnInteraction: true }));

  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  const { data: featuredEvents, isLoading: loadingFeatured } = useConvexQuery(
    api.explore.getFeaturedEvents,
    { limit: 3 }
  );

  const { data: localEvents, isLoading: loadingLocal } = useConvexQuery(
    api.explore.getEventsByLocation,
    {
      city: currentUser?.location?.city || "Gurugram",
      state: currentUser?.location?.state || "Haryana",
      limit: 4,
    }
  );

  const { data: popularEvents, isLoading: loadingPopular } = useConvexQuery(
    api.explore.getPopularEvents,
    { limit: 6 }
  );

  const { data: categoryCounts } = useConvexQuery(api.explore.getCategoryCounts);

  const handleEventClick = (slug) => router.push(`/events/${slug}`);
  const handleCategoryClick = (categoryId) => router.push(`/explore/${categoryId}`);

  const handleViewLocalEvents = () => {
    const city = currentUser?.location?.city || "Gurugram";
    const state = currentUser?.location?.state || "Haryana";
    const slug = createLocationSlug(city, state);
    router.push(`/explore/${slug}`);
  };

  const categoriesWithCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count: categoryCounts?.[cat.id] || 0,
  }));

  const isLoading = loadingFeatured || loadingLocal || loadingPopular;

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-8 h-8 animate-spin text-brand-blue-light" />
        <p className="text-white/40 text-sm font-medium">Loading events...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Ambient blobs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-blue/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] left-0 w-[400px] h-[400px] bg-brand-blue/5 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Hero */}
      <div className="py-20 text-center relative z-10 flex flex-col items-center px-4">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-brand-blue/10 border border-brand-blue/20 text-brand-blue-light text-xs font-semibold tracking-wider uppercase mb-6">
          <Compass className="w-3.5 h-3.5" />
          Explore
        </div>
        <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight mb-5 text-white" style={{ fontFamily: "var(--font-display)" }}>
          Discover <span className="bg-gradient-to-r from-brand-blue-light to-sky-300 bg-clip-text text-transparent">Events</span>
        </h1>
        <p className="text-lg md:text-xl text-white/50 max-w-2xl mx-auto leading-relaxed">
          Featured events, local happenings, and trending experiences across the UniSync ecosystem.
        </p>
      </div>

      {/* Featured Carousel */}
      {featuredEvents && featuredEvents.length > 0 && (
        <div className="mb-20 px-4 sm:px-6 relative z-10">
          <Carousel
            plugins={[plugin.current]}
            className="w-full max-w-7xl mx-auto"
            onMouseEnter={plugin.current.stop}
            onMouseLeave={plugin.current.reset}
          >
            <CarouselContent>
              {featuredEvents.map((event) => (
                <CarouselItem key={event._id}>
                  <div
                    className="relative h-[450px] md:h-[550px] rounded-2xl overflow-hidden cursor-pointer group border border-white/[0.06]"
                    onClick={() => handleEventClick(event.slug)}
                  >
                    {event.coverImage ? (
                      <Image
                        src={event.coverImage}
                        alt={event.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                        priority
                      />
                    ) : (
                      <div
                        className="absolute inset-0"
                        style={{ backgroundColor: event.themeColor || "#1e3a8a" }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#07111f] via-[#07111f]/60 to-transparent" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-transparent" />

                    <div className="relative h-full flex flex-col justify-end p-8 md:p-12 lg:p-16 max-w-3xl group-hover:-translate-y-1 transition-transform duration-500">
                      <span className="inline-flex items-center gap-1.5 w-fit mb-4 px-3 py-1 text-xs font-semibold rounded-full bg-brand-blue/20 text-brand-blue-light border border-brand-blue/30 backdrop-blur-md">
                        <Sparkles className="w-3.5 h-3.5" /> Featured
                      </span>
                      <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-3 text-white tracking-tight leading-[1.1]">
                        {event.title}
                      </h2>
                      <p className="text-base md:text-lg text-white/60 mb-6 max-w-2xl line-clamp-2">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-3 text-sm text-white/70">
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.06]">
                          <Calendar className="w-4 h-4 text-brand-blue-light" />
                          <span>{format(event.startDate, "PPP")}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.06]">
                          <MapPin className="w-4 h-4 text-brand-orange-light" />
                          <span>{event.city}{event.state ? `, ${event.state}` : ""}</span>
                        </div>
                        <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-white/[0.08] backdrop-blur-md border border-white/[0.06]">
                          <Users className="w-4 h-4 text-brand-green-light" />
                          <span>{event.registrationCount} registered</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 md:-left-6 w-11 h-11 bg-white/[0.06] backdrop-blur-md border-white/[0.08] hover:bg-white/[0.12] transition-all hidden md:flex" />
            <CarouselNext className="right-4 md:-right-6 w-11 h-11 bg-white/[0.06] backdrop-blur-md border-white/[0.08] hover:bg-white/[0.12] transition-all hidden md:flex" />
          </Carousel>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 space-y-20 pb-24">
        {/* Local Events */}
        {localEvents && localEvents.length > 0 && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  Near <span className="text-brand-blue-light">You</span>
                </h2>
                <p className="text-white/40 text-sm">
                  Happening in {currentUser?.location?.city || "your area"}
                </p>
              </div>
              <button
                onClick={handleViewLocalEvents}
                className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium text-white/60 border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:text-white transition-all group"
              >
                View all <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {localEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  variant="grid"
                  onClick={() => handleEventClick(event.slug)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Categories */}
        <div>
          <div className="text-center mb-10">
            <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-2" style={{ fontFamily: "var(--font-display)" }}>
              Browse by <span className="text-brand-blue-light">Category</span>
            </h2>
            <p className="text-white/40 text-sm">Find events that match your interests</p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 max-w-5xl mx-auto">
            {categoriesWithCounts.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryClick(category.id)}
                className="group flex flex-col items-center justify-center rounded-xl p-5 border border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.06] hover:border-brand-blue/20 transition-all duration-300 hover:-translate-y-0.5"
              >
                <span className="text-3xl mb-2.5 group-hover:scale-110 transition-transform duration-300">
                  {category.icon}
                </span>
                <span className="text-sm font-medium text-white/80 group-hover:text-white transition-colors">
                  {category.label}
                </span>
                <span className="text-xs text-white/30 mt-1">
                  {category.count} event{category.count !== 1 ? "s" : ""}
                </span>
              </button>
            ))}
          </div>
        </div>

        {/* Popular Events */}
        {popularEvents && popularEvents.length > 0 && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-8 gap-4">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight mb-1" style={{ fontFamily: "var(--font-display)" }}>
                  Trending <span className="text-brand-orange-light">Nationwide</span>
                </h2>
                <p className="text-white/40 text-sm">Most popular events across the country</p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {popularEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  variant="grid"
                  onClick={() => handleEventClick(event.slug)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loadingFeatured && !loadingLocal && !loadingPopular &&
          (!featuredEvents || featuredEvents.length === 0) &&
          (!localEvents || localEvents.length === 0) &&
          (!popularEvents || popularEvents.length === 0) && (
            <div className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-12 text-center max-w-lg mx-auto">
              <div className="w-16 h-16 mx-auto mb-4 bg-brand-blue/10 rounded-full flex items-center justify-center border border-brand-blue/20">
                <Sparkles className="w-7 h-7 text-brand-blue-light" />
              </div>
              <h2 className="text-xl font-bold text-white mb-2">No events yet</h2>
              <p className="text-white/40 text-sm mb-6">Be the first to create something for your community.</p>
              <a
                href="/create-event"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-sm font-medium transition-colors"
              >
                <Sparkles className="w-4 h-4" />
                Create Event
              </a>
            </div>
          )}
      </div>
    </div>
  );
}
