"use client";

import React, { useState, useMemo } from "react";
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
import { mockPastEvents, eventCategories } from "@/lib/mockData";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";

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

    // Filter and sort events
    const filteredEvents = useMemo(() => {
        let events = [...mockPastEvents];

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
    }, [searchQuery, selectedCategory, sortBy]);

    // Pagination
    const totalPages = Math.ceil(filteredEvents.length / ITEMS_PER_PAGE);
    const paginatedEvents = filteredEvents.slice(
        (currentPage - 1) * ITEMS_PER_PAGE,
        currentPage * ITEMS_PER_PAGE
    );

    return (
        <div className="pb-24 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-dypiu-gold/5 rounded-full blur-[120px] pointer-events-none -z-10" />
            <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-rose-600/5 rounded-full blur-[100px] pointer-events-none -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                {/* Page Header */}
                <div className="py-20 text-center flex flex-col items-center">
                    <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-dypiu-gold/10 border border-dypiu-gold/20 text-dypiu-gold text-xs font-bold tracking-widest uppercase mb-6 shadow-[0_0_15px_rgba(245,158,11,0.1)] glass-light">
                        <Archive className="w-4 h-4" />
                        Hall of Fame
                    </div>
                    <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6">
                        Past <span className="text-dypiu-gold drop-shadow-[0_0_15px_rgba(245,158,11,0.3)]">Events</span>
                    </h1>
                    <p className="text-xl md:text-2xl text-muted-foreground max-w-3xl mx-auto font-light leading-relaxed">
                        Explore the legacy of amazing events that have been successfully organized at UNI<span className="text-blue-500 font-semibold">SYNC</span>.
                    </p>
                </div>

                {/* Filters Bar */}
                <div className="flex flex-col md:flex-row gap-4 mb-8 p-3 rounded-2xl glass-light border border-white/10 shadow-xl relative z-10 backdrop-blur-xl">
                    {/* Search */}
                    <div className="relative flex-1">
                        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                            <Search className="w-5 h-5 text-muted-foreground" />
                        </div>
                        <input
                            type="text"
                            placeholder="Search past events..."
                            value={searchQuery}
                            onChange={(e) => {
                                setSearchQuery(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="w-full pl-12 pr-4 py-4 bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 focus:border-primary/50 rounded-xl text-base text-foreground placeholder:text-muted-foreground/70 focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300"
                        />
                    </div>

                    <div className="flex flex-col sm:flex-row gap-4">
                        {/* Category Filter */}
                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                            className="px-5 py-4 bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 focus:border-primary/50 rounded-xl text-base text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 appearance-none cursor-pointer min-w-[200px]"
                        >
                            {eventCategories.map((cat) => (
                                <option key={cat.value} value={cat.value} className="bg-background text-foreground">
                                    {cat.label}
                                </option>
                            ))}
                        </select>

                        {/* Sort */}
                        <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="px-5 py-4 bg-white/5 hover:bg-white/10 border border-transparent hover:border-white/10 focus:border-primary/50 rounded-xl text-base text-foreground font-medium focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all duration-300 appearance-none cursor-pointer min-w-[180px]"
                        >
                            {sortOptions.map((opt) => (
                                <option key={opt.value} value={opt.value} className="bg-background text-foreground">
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
                                <div className="p-6 md:p-8 flex flex-col flex-grow relative z-20 -mt-10 bg-gradient-to-b from-transparent to-background/50">
                                    <div className="mb-4">
                                        <Badge
                                            variant="outline"
                                            className="mb-3 text-xs border-white/10 text-muted-foreground bg-background/80 backdrop-blur-sm px-3 py-1"
                                        >
                                            {getCategoryIcon(event.category)}{" "}
                                            {getCategoryLabel(event.category)}
                                        </Badge>
                                        <h3 className="font-bold text-foreground text-xl md:text-2xl line-clamp-2 group-hover:text-dypiu-gold transition-colors leading-tight mb-2">
                                            {event.title}
                                        </h3>
                                        <p className="text-sm text-muted-foreground line-clamp-2 font-medium leading-relaxed">
                                            {event.description}
                                        </p>
                                    </div>

                                    <div className="space-y-3 mt-auto mb-6 text-sm text-muted-foreground font-medium bg-white/5 rounded-2xl p-4 border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-dypiu-gold/10 flex items-center justify-center text-dypiu-gold border border-dypiu-gold/5">
                                                <Calendar className="w-4 h-4" />
                                            </div>
                                            <span>{format(event.startDate, "PPP")}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-dypiu-gold/10 flex items-center justify-center text-dypiu-gold border border-dypiu-gold/5">
                                                <MapPin className="w-4 h-4" />
                                            </div>
                                            <span>{event.venue || event.city}</span>
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 rounded-full bg-dypiu-gold/10 flex items-center justify-center text-dypiu-gold border border-dypiu-gold/5">
                                                <Users className="w-4 h-4" />
                                            </div>
                                            <span className="font-bold text-foreground">
                                                {event.attendeeCount || event.registrationCount} <span className="text-muted-foreground font-medium">attended</span>
                                            </span>
                                        </div>
                                    </div>

                                    <Button
                                        variant="outline"
                                        className="w-full rounded-xl py-6 font-bold border-white/10 text-foreground glass-light hover:bg-dypiu-gold hover:text-dypiu-navy hover:border-transparent gap-2 transition-all duration-300 group/btn"
                                    >
                                        <Eye className="w-5 h-5 group-hover/btn:scale-110 transition-transform" />
                                        View Memories
                                    </Button>
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
                            We couldn't find any past events matching your current filters.
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
                            className="rounded-full w-14 h-14 p-0 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent glass-light"
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
                                        ? "bg-dypiu-gold text-dypiu-navy hover:bg-yellow-500 shadow-[0_0_20px_rgba(245,158,11,0.4)]"
                                        : "border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground glass-light"
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
                            className="rounded-full w-14 h-14 p-0 border-white/10 text-muted-foreground hover:bg-white/10 hover:text-foreground disabled:opacity-30 disabled:hover:bg-transparent glass-light"
                        >
                            <ChevronRight className="w-6 h-6" />
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}
