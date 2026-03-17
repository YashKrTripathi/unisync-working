"use client";

import React, { useState, useMemo } from "react";
import Link from "next/link";
import { format } from "date-fns";
import {
    Calendar,
    MapPin,
    Users,
    Search,
    SlidersHorizontal,
    ChevronLeft,
    ChevronRight,
    Eye,
    Archive
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES } from "@/lib/data";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";
import { useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";

const ITEMS_PER_PAGE = 6;

const sortOptions = [
    { value: "newest", label: "Newest First" },
    { value: "oldest", label: "Oldest First" },
    { value: "most-attended", label: "Most Attended" },
    { value: "name-asc", label: "Name A-Z" },
];

export default function PastEventsPage() {
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [sortBy, setSortBy] = useState("newest");
    const [currentPage, setCurrentPage] = useState(1);

    const { data: pastEvents = [] } = useConvexQuery(api.explore.getPastEvents, {
        limit: 300,
    });

    const eventCategories = useMemo(
        () => [{ value: "all", label: "All Categories" }, ...CATEGORIES.map((cat) => ({ value: cat.id, label: cat.label }))],
        []
    );

    // Filter and sort events
    const filteredEvents = useMemo(() => {
        let events = [...pastEvents];

        // Search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            events = events.filter(
                (e) =>
                    e.title.toLowerCase().includes(query) ||
                    e.description.toLowerCase().includes(query)
            );
        }

        // Category filter
        if (selectedCategory !== "all") {
            events = events.filter((e) => e.category === selectedCategory);
        }

        // Sort
        switch (sortBy) {
            case "newest":
                events.sort((a, b) => b.startDate - a.startDate);
                break;
            case "oldest":
                events.sort((a, b) => a.startDate - b.startDate);
                break;
            case "most-attended":
                events.sort((a, b) => (b.attendeeCount || 0) - (a.attendeeCount || 0));
                break;
            case "name-asc":
                events.sort((a, b) => a.title.localeCompare(b.title));
                break;
        }

        return events;
    }, [pastEvents, searchQuery, selectedCategory, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
    const paginatedEvents = filteredEvents.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="pb-24 relative overflow-hidden bg-black min-h-screen">
            {/* Background elements */}
            <div className="absolute inset-0 bg-black pointer-events-none -z-10" />

            <div className="max-w-[1400px] mx-auto px-6">
                {/* Page Header */}
                <div className="pt-32 pb-16 text-center flex flex-col items-center">
                    <h1 className="text-[12vw] leading-none font-display uppercase tracking-tighter mb-4 text-white">
                        PAST <span className="text-[var(--color-nameless-orange)]">EVENTS</span>
                    </h1>
                    <p className="text-xl md:text-3xl font-serif-italic text-white max-w-3xl mx-auto font-light leading-relaxed">
                        Explore the legacy of amazing events that have been successfully organized.
                    </p>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-16 p-2 rounded-full border border-white/20 relative z-10 w-full max-w-4xl mx-auto bg-black/40">
                    {/* Search */}
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-6 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-white/50" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search past events..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-14 pr-4 py-4 bg-transparent border-none text-base text-white placeholder:text-white/50 focus:outline-none focus:ring-0 transition-all duration-300 font-sans"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 shrink-0">
                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-6 py-4 bg-transparent border border-transparent rounded-full text-sm text-white font-sans focus:outline-none focus:ring-0 transition-all duration-300 appearance-none cursor-pointer hover:bg-white/5 uppercase tracking-wider font-bold"
                        >
                            {eventCategories.map((cat) => (
                                <option key={cat.value} value={cat.value} className="bg-black text-white">
                                    {cat.label}
                                </option>
                            ))}
                        </select>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-6 py-4 bg-transparent border border-transparent rounded-full text-sm text-white font-sans focus:outline-none focus:ring-0 transition-all duration-300 appearance-none cursor-pointer hover:bg-white/5 uppercase tracking-wider font-bold"
                        >
                            {sortOptions.map((opt) => (
                                <option key={opt.value} value={opt.value} className="bg-black text-white">
                                    {opt.label}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>

                {/* Results count */}
                <div className="flex items-center gap-2 mb-10 px-2">
                    <SlidersHorizontal className="w-5 h-5 text-muted-foreground" />
                    <span className="text-base text-muted-foreground font-medium">
                        Showing <strong className="text-foreground">{filteredEvents.length}</strong> event{filteredEvents.length !== 1 ? "s" : ""}
                    </span>
                </div>

                {/* Events Grid */}
                {paginatedEvents.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
                        {paginatedEvents.map((event, index) => (
                            <div
                                key={event._id}
                                className="group relative flex flex-col rounded-3xl overflow-hidden glass hover:bg-white/[0.04] border-t border-white/10 transition-all duration-500 hover:-translate-y-2 hover:shadow-[0_0_40px_rgba(245,158,11,0.15)]"
                                style={{ animationDelay: `${index * 100}ms` }}
                            >
                                {/* Card Image */}
                                <div
                                    className="h-56 relative flex items-center justify-center transition-transform duration-500 group-hover:scale-105"
                                    style={{ backgroundColor: event.themeColor || "#1e3a8a" }}
                                >
                                    {/* Grayscale effect to denote past events */}
                                    <div className="absolute inset-0 bg-background/20 backdrop-grayscale-[0.5] group-hover:backdrop-grayscale-0 transition-all duration-500" />
                                    <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />

                                    <span className="text-6xl md:text-7xl opacity-40 drop-shadow-xl transform group-hover:scale-110 transition-transform duration-500 z-10">
                                        {getCategoryIcon(event.category)}
                                    </span>

                                    <div className="absolute top-4 left-4 z-20">
                                        <Badge className="bg-background/60 text-foreground border border-white/10 px-3 py-1 text-xs font-bold tracking-wider uppercase backdrop-blur-md shadow-lg">
                                            Completed
                                        </Badge>
                                    </div>
                                </div>

                                {/* Card Content */}
                                <div className="p-6 md:p-8 flex flex-col flex-grow relative z-20 -mt-10 bg-gradient-to-b from-transparent to-black">
                                    <div className="mb-4">
                                        <div className="mb-3 inline-block px-3 py-1 border border-white text-white font-sans uppercase text-[10px] tracking-widest font-bold">
                                            {getCategoryLabel(event.category)}
                                        </div>
                                        <h3 className="font-display text-white text-[8vw] md:text-[3vw] leading-none uppercase tracking-tighter group-hover:text-[var(--color-nameless-orange)] transition-colors mb-2">
                                            {event.title}
                                        </h3>
                                        <p className="text-sm text-white/70 line-clamp-2 font-medium leading-relaxed">
                                            {event.description}
                                        </p>
                                    </div>

                                    <div className="space-y-3 mt-auto mb-6 text-sm text-white/80 font-medium">
                                        <div className="flex items-center gap-3">
                                            <Calendar className="w-4 h-4 text-[var(--color-nameless-orange)]" />
                                            <span>{format(event.startDate, "PPP")}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <MapPin className="w-4 h-4 text-[var(--color-nameless-orange)]" />
                                            <span>{event.venue || event.city}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <Users className="w-4 h-4 text-[var(--color-nameless-orange)]" />
                                            <span className="font-bold text-white">
                                                {event.attendeeCount || event.registrationCount} <span className="text-white/60 font-medium">attended</span>
                                            </span>
                                        </div>
                                    </div>

                                    <Link href={`/events/${event.slug}`}>
                                        <Button
                                            variant="outline"
                                            className="w-full rounded-full py-6 font-bold border-white text-white hover:bg-white hover:text-black gap-2 transition-all duration-300 group/btn"
                                        >
                                            <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                            View Memories
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-32 rounded-3xl glass-light border border-white/10 max-w-2xl mx-auto shadow-2xl relative z-10">
                        <div className="w-24 h-24 mx-auto bg-gradient-to-br from-white/5 to-white/10 rounded-full flex items-center justify-center border border-white/10 mb-6 font-light">
                            <Search className="w-10 h-10 text-muted-foreground" />
                        </div>
                        <h3 className="text-2xl font-bold text-foreground mb-3">No events found</h3>
                        <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
                            We couldn&apos;t find any past events matching your current filters.
                        </p>
                        <Button
                            variant="outline"
                            size="lg"
                            className="rounded-full px-8 py-6 font-bold border-white/10 text-foreground hover:bg-white/10 transition-all duration-300"
                            onClick={() => {
                                setSearchQuery("");
                                setSelectedCategory("all");
                                setCurrentPage(1);
                            }}
                        >
                            Clear All Filters
                        </Button>
                    </div>
                )}

                {/* Pagination */}
                {totalPages > 1 && (
                    <div className="flex flex-wrap items-center justify-center gap-2 mt-16 relative z-10">
                        <Button
                            variant="outline"
                            size="lg"
                            disabled={currentPage === 1}
                            onClick={() => setCurrentPage((p) => p - 1)}
                            className="rounded-full w-14 h-14 p-0 border-white/10 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            <ChevronLeft className="w-6 h-6" />
                        </Button>

                        {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                            <Button
                                key={page}
                                variant={page === currentPage ? "default" : "outline"}
                                size="lg"
                                onClick={() => setCurrentPage(page)}
                                className={`rounded-full w-14 h-14 p-0 font-bold text-lg transition-all duration-300 ${page === currentPage
                                    ? "bg-white text-black"
                                    : "border-white/10 text-white/50 hover:bg-white/10 hover:text-white"
                                    }`}
                            >
                                {page}
                            </Button>
                        ))}

                        <Button
                            variant="outline"
                            size="lg"
                            disabled={currentPage === totalPages}
                            onClick={() => setCurrentPage((p) => p + 1)}
                            className="rounded-full w-14 h-14 p-0 border-white/10 text-white/50 hover:bg-white/10 hover:text-white disabled:opacity-30 disabled:hover:bg-transparent"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
