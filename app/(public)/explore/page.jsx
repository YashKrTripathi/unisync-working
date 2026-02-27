"use client";

import { useRef } from "react";
import { useRouter } from "next/navigation";
import { Calendar, MapPin, Users, ArrowRight, Loader2, Sparkles, Compass } from "lucide-react";
import { format } from "date-fns";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { createLocationSlug } from "@/lib/location-utils";
import Image from "next/image";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
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

  // Fetch current user for location
  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);

  // Fetch events
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

  const { data: categoryCounts } = useConvexQuery(
    api.explore.getCategoryCounts
  );

  const handleEventClick = (slug) => {
    router.push(`/events/${slug}`);
  };

  const handleCategoryClick = (categoryId) => {
    router.push(`/explore/${categoryId}`);
  };

  const handleViewLocalEvents = () => {
    const city = currentUser?.location?.city || "Gurugram";
    const state = currentUser?.location?.state || "Haryana";
    const slug = createLocationSlug(city, state);
    router.push(`/explore/${slug}`);
  };

  // Format categories with counts
  const categoriesWithCounts = CATEGORIES.map((cat) => ({
    ...cat,
    count: categoryCounts?.[cat.id] || 0,
  }));

  // Loading state
  const isLoading = loadingFeatured || loadingLocal || loadingPopular;

  if (isLoading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center gap-4">
        <Loader2 className="w-10 h-10 animate-spin text-primary" />
        <p className="text-muted-foreground font-medium animate-pulse">Loading amazing events...</p>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-blue-600/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute top-[40%] left-0 w-[400px] h-[400px] bg-purple-600/10 rounded-full blur-[100px] pointer-events-none -z-10" />

      {/* Hero Title */}
      <div className="py-20 text-center relative z-10 flex flex-col items-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-primary text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(37,99,235,0.1)] glass-light">
          <Compass className="w-4 h-4" />
          Start Your Journey
        </div>
        <h1 className="text-6xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6">
          Discover <span className="bg-gradient-to-r from-blue-400 to-purple-500 bg-clip-text text-transparent drop-shadow-sm">Events</span>
        </h1>
        <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
          Explore featured events, find what&apos;s happening locally, or browse
          the entire UNI<span className="text-blue-500 font-semibold">SYNC</span> ecosystem.
        </p>
      </div>

      {/* Featured Carousel */}
      {featuredEvents && featuredEvents.length > 0 && (
        <div className="mb-24 px-4 sm:px-6 relative z-10">
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
                    className="relative h-[500px] md:h-[600px] rounded-3xl overflow-hidden cursor-pointer group shadow-2xl shadow-blue-900/10 border border-white/5"
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
                        className="absolute inset-0 transition-transform duration-700 group-hover:scale-105"
                        style={{ backgroundColor: event.themeColor }}
                      />
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent opacity-90" />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/80 to-transparent" />

                    <div className="relative h-full flex flex-col justify-end p-8 md:p-14 lg:p-20 max-w-4xl transition-transform duration-500 group-hover:-translate-y-2">
                      <Badge className="w-fit mb-6 px-4 py-1.5 text-sm bg-primary text-primary-foreground border-none shadow-[0_0_20px_rgba(37,99,235,0.4)] backdrop-blur-md">
                        <Sparkles className="w-4 h-4 mr-2" /> Featured
                      </Badge>
                      <h2 className="text-4xl md:text-5xl lg:text-7xl font-black mb-4 text-foreground tracking-tighter leading-[1.1] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-blue-400 group-hover:to-blue-200 transition-all duration-300">
                        {event.title}
                      </h2>
                      <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl line-clamp-2 md:line-clamp-3 font-medium">
                        {event.description}
                      </p>
                      <div className="flex flex-wrap items-center gap-6 text-foreground/80 font-semibold">
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
                          <Calendar className="w-5 h-5 text-blue-400" />
                          <span>{format(event.startDate, "PPP")}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
                          <MapPin className="w-5 h-5 text-dypiu-gold" />
                          <span>{event.city}, {event.state || event.country}</span>
                        </div>
                        <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full backdrop-blur-md border border-white/5">
                          <Users className="w-5 h-5 text-emerald-400" />
                          <span>{event.registrationCount} registered</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="left-4 md:-left-6 w-12 h-12 bg-background/50 backdrop-blur-md border-white/10 hover:bg-background/80 hover:text-primary transition-all duration-300 hidden md:flex" />
            <CarouselNext className="right-4 md:-right-6 w-12 h-12 bg-background/50 backdrop-blur-md border-white/10 hover:bg-background/80 hover:text-primary transition-all duration-300 hidden md:flex" />
          </Carousel>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-6 space-y-24 pb-24">
        {/* Local Events */}
        {localEvents && localEvents.length > 0 && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-black mb-3 text-foreground tracking-tight">
                  Near <span className="text-primary drop-shadow-[0_0_15px_rgba(37,99,235,0.2)]">You</span>
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl font-light">
                  Happening right in {currentUser?.location?.city || "your area"}
                </p>
              </div>
              <Button
                variant="outline"
                className="gap-2 rounded-full px-6 py-5 font-semibold border-white/10 glass-light text-foreground hover:bg-white/10 hover:border-primary/50 group transition-all duration-300"
                onClick={handleViewLocalEvents}
              >
                View Full Location Directory <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8">
              {localEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  variant="compact"
                  onClick={() => handleEventClick(event.slug)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Browse by Category */}
        <div className="relative">
          {/* Decorative Background Blob for Categories */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[150%] bg-gradient-to-b from-blue-600/5 via-transparent to-transparent -z-10 rounded-full blur-[100px]" />

          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-black mb-4 tracking-tight">
              Browse by <span className="bg-gradient-to-r from-purple-400 to-pink-500 bg-clip-text text-transparent">Category</span>
            </h2>
            <p className="text-muted-foreground text-lg md:text-xl font-light max-w-2xl mx-auto">
              Find exactly what you're passionate about.
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6 max-w-6xl mx-auto">
            {categoriesWithCounts.map((category) => (
              <Card
                key={category.id}
                className="group cursor-pointer glass border border-white/5 hover:bg-white/[0.04] transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_30px_rgba(168,85,247,0.15)] overflow-hidden rounded-3xl"
                onClick={() => handleCategoryClick(category.id)}
              >
                <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <CardContent className="p-6 md:p-8 flex flex-col items-center justify-center text-center relative z-10 h-full">
                  <div className="text-5xl md:text-6xl mb-4 transform group-hover:scale-110 group-hover:-rotate-3 transition-transform duration-500 opacity-80 group-hover:opacity-100">
                    {category.icon}
                  </div>
                  <h3 className="font-bold text-lg md:text-xl text-foreground mb-1 group-hover:text-purple-400 transition-colors">
                    {category.label}
                  </h3>
                  <div className="inline-flex items-center justify-center px-3 py-1 rounded-full bg-white/5 text-xs font-semibold text-muted-foreground mt-2 border border-white/5">
                    {category.count} Event{category.count !== 1 ? "s" : ""}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Popular Events Across Country */}
        {popularEvents && popularEvents.length > 0 && (
          <div>
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-10 gap-6">
              <div>
                <h2 className="text-3xl md:text-5xl font-black mb-3 text-foreground tracking-tight">
                  Trending <span className="text-dypiu-gold drop-shadow-[0_0_15px_rgba(245,158,11,0.2)]">Nationwide</span>
                </h2>
                <p className="text-muted-foreground text-lg md:text-xl font-light">
                  The most anticipated events across the country right now.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {popularEvents.map((event) => (
                <EventCard
                  key={event._id}
                  event={event}
                  variant="list"
                  onClick={() => handleEventClick(event.slug)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Empty State */}
        {!loadingFeatured &&
          !loadingLocal &&
          !loadingPopular &&
          (!featuredEvents || featuredEvents.length === 0) &&
          (!localEvents || localEvents.length === 0) &&
          (!popularEvents || popularEvents.length === 0) && (
            <div className="p-12 text-center rounded-3xl glass-light border border-white/10 max-w-2xl mx-auto shadow-2xl">
              <div className="space-y-6">
                <div className="w-24 h-24 mx-auto bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-white/10 shadow-[0_0_30px_rgba(59,130,246,0.2)]">
                  <span className="text-5xl">🎉</span>
                </div>
                <h2 className="text-3xl font-black text-foreground">A Blank Canvas</h2>
                <p className="text-muted-foreground text-lg font-light leading-relaxed">
                  There are no events listed yet. Be the first to bring your community together and create something extraordinary!
                </p>
                <Button asChild size="lg" className="gap-2 rounded-full px-10 py-6 text-lg font-bold bg-primary text-primary-foreground hover:bg-primary/90 hover:scale-105 shadow-[0_0_30px_rgba(37,99,235,0.4)] transition-all duration-300">
                  <a href="/create-event">
                    <Sparkles className="w-5 h-5 text-dypiu-gold" />
                    Create The First Event
                  </a>
                </Button>
              </div>
            </div>
          )}
      </div>
    </div>
  );
}
