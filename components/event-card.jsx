"use client";

import { Calendar, MapPin, Users, Trash2, X, QrCode, Eye } from "lucide-react";
import { format } from "date-fns";
import Image from "next/image";
import { getCategoryIcon, getCategoryLabel } from "@/lib/data";

const CATEGORY_GRADIENTS = {
  tech: "from-blue-600/80 to-cyan-700/80",
  music: "from-rose-600/80 to-pink-700/80",
  sports: "from-green-600/80 to-emerald-700/80",
  art: "from-purple-600/80 to-violet-700/80",
  food: "from-orange-600/80 to-amber-700/80",
  business: "from-slate-600/80 to-gray-700/80",
  health: "from-teal-600/80 to-cyan-700/80",
  education: "from-indigo-600/80 to-blue-700/80",
  gaming: "from-red-600/80 to-orange-700/80",
  networking: "from-sky-600/80 to-blue-700/80",
  outdoor: "from-lime-600/80 to-green-700/80",
  community: "from-amber-600/80 to-yellow-700/80",
};

export default function EventCard({
  event,
  onClick,
  onDelete,
  variant = "grid", // "grid", "list", or "compact"
  action = null, // "event" | "ticket" | null
  className = "",
}) {
  const gradient = CATEGORY_GRADIENTS[event.category] || "from-blue-600/80 to-slate-700/80";

  // List / Compact variant (horizontal row)
  if (variant === "list" || variant === "compact") {
    return (
      <div
        className={`group rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300 cursor-pointer ${className}`}
        onClick={onClick}
      >
        <div className="p-3 flex gap-3">
          <div className="w-20 h-20 rounded-lg shrink-0 overflow-hidden relative">
            {event.coverImage ? (
              <Image
                src={event.coverImage}
                alt={event.title}
                fill
                className="object-cover"
              />
            ) : (
              <div className={`absolute inset-0 flex items-center justify-center text-2xl bg-gradient-to-br ${gradient}`}>
                {getCategoryIcon(event.category)}
              </div>
            )}
          </div>

          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm text-white mb-1 group-hover:text-brand-blue-light transition-colors line-clamp-2">
              {event.title}
            </h3>
            <p className="text-xs text-white/50 mb-1">
              {format(event.startDate, "EEE, dd MMM, HH:mm")}
            </p>
            <div className="flex items-center gap-3 text-xs text-white/40">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3" />
                {event.locationType === "online" ? "Online" : event.city}
              </span>
              <span className="flex items-center gap-1">
                <Users className="w-3 h-3" />
                {event.registrationCount}
              </span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Grid variant (default - premium card)
  const capacityPercent = Math.min(100, Math.round((event.registrationCount / Math.max(event.capacity || 1, 1)) * 100));

  return (
    <div
      className={`group rounded-xl border border-white/[0.06] bg-white/[0.03] backdrop-blur-sm overflow-hidden hover:border-white/[0.12] hover:bg-white/[0.05] transition-all duration-300 ${onClick ? "cursor-pointer" : ""} ${className}`}
      onClick={onClick}
    >
      {/* Image */}
      <div className="relative h-48 overflow-hidden">
        {event.coverImage ? (
          <Image
            src={event.coverImage}
            alt={event.title}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            width={500}
            height={192}
          />
        ) : (
          <div className={`w-full h-full flex items-center justify-center text-4xl bg-gradient-to-br ${gradient}`}>
            {getCategoryIcon(event.category)}
          </div>
        )}

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

        {/* Badges */}
        <div className="absolute top-3 right-3">
          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold backdrop-blur-md ${
            event.ticketType === "free"
              ? "bg-green-500/20 text-green-300 border border-green-500/30"
              : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
          }`}>
            {event.ticketType === "free" ? "Free" : `₹${event.ticketPrice || ""}`}
          </span>
        </div>

        {/* Category chip */}
        <div className="absolute bottom-3 left-3">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-medium text-white/80 bg-black/40 backdrop-blur-md border border-white/10 uppercase tracking-wider">
            {getCategoryIcon(event.category)} {getCategoryLabel(event.category)}
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        <h3 className="font-semibold text-[15px] text-white line-clamp-2 group-hover:text-brand-blue-light transition-colors leading-snug">
          {event.title}
        </h3>

        <div className="space-y-1.5 text-sm text-white/50">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-white/30" />
            <span>{format(event.startDate, "EEE, dd MMM yyyy")}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-white/30" />
            <span className="line-clamp-1">
              {event.locationType === "online"
                ? "Online Event"
                : `${event.city}${event.state ? `, ${event.state}` : ""}`}
            </span>
          </div>
        </div>

        {/* Capacity bar */}
        <div>
          <div className="flex items-center justify-between text-xs mb-1.5">
            <span className="text-white/40">{event.registrationCount} / {event.capacity} spots</span>
            <span className={`font-medium ${capacityPercent > 80 ? "text-brand-orange" : "text-brand-blue-light"}`}>
              {capacityPercent}%
            </span>
          </div>
          <div className="w-full h-1.5 rounded-full bg-white/[0.06]">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                capacityPercent > 90 ? "bg-brand-red" : capacityPercent > 70 ? "bg-brand-orange" : "bg-brand-blue"
              }`}
              style={{ width: `${capacityPercent}%` }}
            />
          </div>
        </div>

        {/* Actions */}
        {action && (
          <div className="flex gap-2 pt-1">
            <button
              className="flex-1 flex items-center justify-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-white/80 border border-white/[0.08] bg-white/[0.04] hover:bg-white/[0.08] hover:text-white transition-all"
              onClick={(e) => {
                e.stopPropagation();
                onClick?.(e);
              }}
            >
              {action === "event" ? (
                <><Eye className="w-3.5 h-3.5" /> View</>
              ) : (
                <><QrCode className="w-3.5 h-3.5" /> Show Ticket</>
              )}
            </button>

            {onDelete && (
              <button
                className="flex items-center justify-center gap-1 px-3 py-2 rounded-lg text-sm font-medium text-red-400/80 border border-red-500/10 bg-red-500/5 hover:bg-red-500/10 hover:text-red-400 transition-all"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(event._id);
                }}
              >
                {action === "event" ? <Trash2 className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
