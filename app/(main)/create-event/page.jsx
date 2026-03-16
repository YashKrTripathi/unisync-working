/* eslint-disable react-hooks/incompatible-library */
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { State, City } from "country-state-city";
import { CalendarIcon, Loader2, Sparkles } from "lucide-react";
import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { useAuth } from "@clerk/nextjs";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import UnsplashImagePicker from "@/components/unsplash-image-picker";
import AIEventCreator from "./_components/ai-event-creator";
import UpgradeModal from "@/components/upgrade-modal";
import { CATEGORIES } from "@/lib/data";
import Image from "next/image";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const eventSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    category: z.string().min(1, "Please select a category"),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    startTime: z.string().regex(timeRegex, "Start time must be HH:MM"),
    endTime: z.string().regex(timeRegex, "End time must be HH:MM"),
    locationType: z.enum(["physical", "online"]).default("physical"),
    venue: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    address: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    ticketType: z.enum(["free", "paid"]).default("free"),
    ticketPrice: z.number().optional(),
    coverImage: z.string().optional(),
    themeColor: z.string().default("#1e3a8a"),
  })
  .superRefine((data, ctx) => {
    if (data.locationType === "physical" && !data.city) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "City is required for physical events",
        path: ["city"],
      });
    }

    if (data.locationType === "online" && !data.venue) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Meeting link is required for online events",
        path: ["venue"],
      });
    }

    if (data.ticketType === "paid" && (!data.ticketPrice || data.ticketPrice <= 0)) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Enter a valid ticket price",
        path: ["ticketPrice"],
      });
    }
  });

export default function CreateEventPage() {
  const router = useRouter();
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("limit");

  const { has } = useAuth();
  const hasPro = has?.({ plan: "pro" });

  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const { mutate: createEvent, isLoading } = useConvexMutation(api.events.createEvent);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      locationType: "physical",
      ticketType: "free",
      capacity: 50,
      themeColor: "#1e3a8a",
      category: "",
      state: "",
      city: "",
      startTime: "",
      endTime: "",
    },
  });

  const themeColor = watch("themeColor");
  const ticketType = watch("ticketType");
  const locationType = watch("locationType");
  const selectedState = watch("state");
  const startDate = watch("startDate");
  const endDate = watch("endDate");
  const coverImage = watch("coverImage");

  const indianStates = useMemo(() => State.getStatesOfCountry("IN"), []);
  const cities = useMemo(() => {
    if (!selectedState) return [];
    const st = indianStates.find((s) => s.name === selectedState);
    if (!st) return [];
    return City.getCitiesOfState("IN", st.isoCode);
  }, [selectedState, indianStates]);

  const colorPresets = [
    "#1e3a8a",
    ...(hasPro ? ["#4c1d95", "#065f46", "#92400e", "#7f1d1d", "#831843"] : []),
  ];

  const handleColorClick = (color) => {
    if (color !== "#1e3a8a" && !hasPro) {
      setUpgradeReason("color");
      setShowUpgradeModal(true);
      return;
    }
    setValue("themeColor", color);
  };

  const combineDateTime = (date, time) => {
    if (!date || !time) return null;
    const [hh, mm] = time.split(":").map(Number);
    const d = new Date(date);
    d.setHours(hh, mm, 0, 0);
    return d;
  };

  const onSubmit = async (data) => {
    try {
      const start = combineDateTime(data.startDate, data.startTime);
      const end = combineDateTime(data.endDate, data.endTime);

      if (!start || !end) {
        toast.error("Please select both date and time for start and end.");
        return;
      }
      if (end.getTime() <= start.getTime()) {
        toast.error("End date/time must be after start date/time.");
        return;
      }

      if (!hasPro && currentUser?.freeEventsCreated >= 1) {
        setUpgradeReason("limit");
        setShowUpgradeModal(true);
        return;
      }

      if (data.themeColor !== "#1e3a8a" && !hasPro) {
        setUpgradeReason("color");
        setShowUpgradeModal(true);
        return;
      }

      await createEvent({
        title: data.title,
        description: data.description,
        category: data.category,
        tags: [data.category],
        startDate: start.getTime(),
        endDate: end.getTime(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locationType: data.locationType,
        venue: data.venue || undefined,
        address: data.address || undefined,
        city: data.city || "Online",
        state: data.state || undefined,
        country: "India",
        capacity: data.capacity,
        ticketType: data.ticketType,
        ticketPrice: data.ticketPrice || undefined,
        coverImage: data.coverImage || undefined,
        themeColor: data.themeColor,
        hasPro,
      });

      toast.success("Event created successfully!");
      router.push("/my-events");
    } catch (error) {
      toast.error(error.message || "Failed to create event");
    }
  };

  const handleAIGenerate = (generatedData) => {
    setValue("title", generatedData.title);
    setValue("description", generatedData.description);
    setValue("category", generatedData.category);
    setValue("capacity", generatedData.suggestedCapacity);
    setValue("ticketType", generatedData.suggestedTicketType);
    toast.success("Event details filled! Customize as needed.");
  };

  return (
    <div className="relative min-h-screen -mt-6 md:-mt-10 px-4 sm:px-6 py-8">
      <div
        className="absolute inset-0 -z-10 opacity-20 blur-3xl"
        style={{
          background: `radial-gradient(circle at 20% 20%, ${themeColor}, transparent 45%), radial-gradient(circle at 80% 70%, #1e3a8a, transparent 40%)`,
        }}
      />

      <div className="max-w-6xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-5 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">Create New Event</h1>
          <p className="text-sm text-gray-300 mt-2">Fill the essentials, then publish with confidence.</p>
          {!hasPro && (
            <p className="text-xs text-gray-400 mt-1">Free plan usage: {currentUser?.freeEventsCreated || 0}/1 events</p>
          )}
        </div>
        <AIEventCreator onEventGenerated={handleAIGenerate} />
      </div>

      <div className="max-w-6xl mx-auto grid lg:grid-cols-[300px_1fr] gap-7">
        <aside className="space-y-5">
          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <p className="text-xs uppercase tracking-widest text-gray-400 mb-3">Cover Image</p>
            <div
              className="aspect-square w-full rounded-xl overflow-hidden flex items-center justify-center cursor-pointer border border-white/10 bg-black/30 hover:border-white/30 transition-colors"
              onClick={() => setShowImagePicker(true)}
            >
              {coverImage ? (
                <Image src={coverImage} alt="Cover" className="w-full h-full object-cover" width={500} height={500} priority />
              ) : (
                <span className="opacity-70 text-sm text-gray-300">Click to choose image</span>
              )}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-black/25 p-4">
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs uppercase tracking-widest text-gray-400">Theme</p>
              {!hasPro && (
                <Badge variant="secondary" className="text-xs gap-1">
                  <Sparkles className="w-3 h-3" />
                  Pro
                </Badge>
              )}
            </div>
            <div className="flex gap-2 flex-wrap">
              {colorPresets.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-9 h-9 rounded-full border-2 transition-all ${
                    !hasPro && color !== "#1e3a8a" ? "opacity-40 cursor-not-allowed" : "hover:scale-105"
                  }`}
                  style={{
                    backgroundColor: color,
                    borderColor: themeColor === color ? "white" : "transparent",
                  }}
                  onClick={() => handleColorClick(color)}
                />
              ))}
            </div>
          </div>
        </aside>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <section className="rounded-2xl border border-white/10 bg-black/25 p-5 space-y-4">
            <h2 className="text-base font-semibold text-white">Basic Details</h2>
            <div className="space-y-2">
              <Label className="text-gray-300">Event Title</Label>
              <Input {...register("title")} placeholder="Event name" className="h-11 bg-white/5 border-white/10 text-white" />
              {errors.title && <p className="text-sm text-red-400">{errors.title.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Category</Label>
              <Controller
                control={control}
                name="category"
                render={({ field }) => (
                  <Select value={field.value} onValueChange={field.onChange}>
                    <SelectTrigger className="w-full h-11 bg-white/5 border-white/10 text-white">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.icon} {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && <p className="text-sm text-red-400">{errors.category.message}</p>}
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Description</Label>
              <Textarea
                {...register("description")}
                placeholder="Tell attendees what this event is about..."
                rows={5}
                className="bg-white/5 border-white/10 text-white"
              />
              {errors.description && <p className="text-sm text-red-400">{errors.description.message}</p>}
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/25 p-5 space-y-4">
            <h2 className="text-base font-semibold text-white">Schedule</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Start</Label>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-between bg-white/5 border-white/10 text-white">
                        {startDate ? format(startDate, "PPP") : "Pick date"}
                        <CalendarIcon className="w-4 h-4 opacity-60" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar mode="single" selected={startDate} onSelect={(date) => setValue("startDate", date)} />
                    </PopoverContent>
                  </Popover>
                  <Input type="time" {...register("startTime")} className="bg-white/5 border-white/10 text-white" />
                </div>
                {(errors.startDate || errors.startTime) && (
                  <p className="text-sm text-red-400">{errors.startDate?.message || errors.startTime?.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">End</Label>
                <div className="grid grid-cols-[1fr_auto] gap-2">
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="justify-between bg-white/5 border-white/10 text-white">
                        {endDate ? format(endDate, "PPP") : "Pick date"}
                        <CalendarIcon className="w-4 h-4 opacity-60" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="p-0">
                      <Calendar
                        mode="single"
                        selected={endDate}
                        onSelect={(date) => setValue("endDate", date)}
                        disabled={(date) => date < (startDate || new Date())}
                      />
                    </PopoverContent>
                  </Popover>
                  <Input type="time" {...register("endTime")} className="bg-white/5 border-white/10 text-white" />
                </div>
                {(errors.endDate || errors.endTime) && (
                  <p className="text-sm text-red-400">{errors.endDate?.message || errors.endTime?.message}</p>
                )}
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/25 p-5 space-y-4">
            <h2 className="text-base font-semibold text-white">Location</h2>
            <div className="flex flex-wrap gap-2">
              <label className={`px-4 py-2 rounded-full border text-sm cursor-pointer transition-colors ${locationType === "physical" ? "bg-white/15 border-white/30 text-white" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}>
                <input type="radio" value="physical" {...register("locationType")} className="sr-only" />
                Physical
              </label>
              <label className={`px-4 py-2 rounded-full border text-sm cursor-pointer transition-colors ${locationType === "online" ? "bg-white/15 border-white/30 text-white" : "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10"}`}>
                <input type="radio" value="online" {...register("locationType")} className="sr-only" />
                Online
              </label>
            </div>

            {locationType === "physical" ? (
              <>
                <div className="grid sm:grid-cols-2 gap-4">
                  <Controller
                    control={control}
                    name="state"
                    render={({ field }) => (
                      <Select
                        value={field.value}
                        onValueChange={(val) => {
                          field.onChange(val);
                          setValue("city", "");
                        }}
                      >
                        <SelectTrigger className="w-full h-11 bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent>
                          {indianStates.map((s) => (
                            <SelectItem key={s.isoCode} value={s.name}>
                              {s.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />

                  <Controller
                    control={control}
                    name="city"
                    render={({ field }) => (
                      <Select value={field.value} onValueChange={field.onChange} disabled={!selectedState}>
                        <SelectTrigger className="w-full h-11 bg-white/5 border-white/10 text-white">
                          <SelectValue placeholder={selectedState ? "Select city" : "Select state first"} />
                        </SelectTrigger>
                        <SelectContent>
                          {cities.map((c) => (
                            <SelectItem key={c.name} value={c.name}>
                              {c.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>
                {errors.city && <p className="text-sm text-red-400">{errors.city.message}</p>}

                <Input {...register("address")} placeholder="Full address / street / building" className="h-11 bg-white/5 border-white/10 text-white" />
                <Input {...register("venue")} placeholder="Google Maps link (optional)" type="url" className="h-11 bg-white/5 border-white/10 text-white" />
              </>
            ) : (
              <>
                <Input
                  {...register("venue")}
                  placeholder="Meeting link (Zoom / GMeet / Teams)"
                  type="url"
                  className="h-11 bg-white/5 border-white/10 text-white"
                />
                {errors.venue && <p className="text-sm text-red-400">{errors.venue.message}</p>}
              </>
            )}
          </section>

          <section className="rounded-2xl border border-white/10 bg-black/25 p-5 space-y-4">
            <h2 className="text-base font-semibold text-white">Capacity & Tickets</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Capacity</Label>
                <Input
                  type="number"
                  {...register("capacity", { valueAsNumber: true })}
                  placeholder="Ex: 100"
                  className="h-11 bg-white/5 border-white/10 text-white"
                />
                {errors.capacity && <p className="text-sm text-red-400">{errors.capacity.message}</p>}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Ticket Type</Label>
                <div className="flex h-11 items-center gap-2 rounded-md border border-white/10 bg-white/5 px-2">
                  <label className={`px-3 py-1.5 rounded-md text-sm cursor-pointer ${ticketType === "free" ? "bg-white/20 text-white" : "text-gray-300"}`}>
                    <input type="radio" value="free" {...register("ticketType")} className="sr-only" />
                    Free
                  </label>
                  <label className={`px-3 py-1.5 rounded-md text-sm cursor-pointer ${ticketType === "paid" ? "bg-white/20 text-white" : "text-gray-300"}`}>
                    <input type="radio" value="paid" {...register("ticketType")} className="sr-only" />
                    Paid
                  </label>
                </div>
              </div>
            </div>

            {ticketType === "paid" && (
              <div className="space-y-2">
                <Label className="text-gray-300">Ticket Price</Label>
                <Input
                  type="number"
                  placeholder="Ticket price in INR"
                  {...register("ticketPrice", { valueAsNumber: true })}
                  className="h-11 bg-white/5 border-white/10 text-white"
                />
                {errors.ticketPrice && <p className="text-sm text-red-400">{errors.ticketPrice.message}</p>}
              </div>
            )}
          </section>

          <Button type="submit" disabled={isLoading} className="w-full h-12 text-base rounded-xl bg-white text-black hover:bg-gray-100">
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Creating Event...
              </>
            ) : (
              "Create Event"
            )}
          </Button>
        </form>
      </div>

      {showImagePicker && (
        <UnsplashImagePicker
          isOpen={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onSelect={(url) => {
            setValue("coverImage", url);
            setShowImagePicker(false);
          }}
        />
      )}

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} trigger={upgradeReason} />
    </div>
  );
}
