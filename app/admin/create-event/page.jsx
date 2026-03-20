"use client";
/* eslint-disable react-hooks/incompatible-library */

import { Suspense, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { State, City } from "country-state-city";
import {
  ArrowRight,
  CheckCircle2,
  Loader2,
  Plus,
  Shield,
  Sparkles,
  Wand2,
  X,
} from "lucide-react";
import { useAuth } from "@clerk/nextjs";
import { toast } from "sonner";

import { useConvexMutation, useConvexQuery } from "@/hooks/use-convex-query";
import { api } from "@/convex/_generated/api";
import { CATEGORIES } from "@/lib/data";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import DateTimeField from "@/components/ui/date-time-field";
import AIEventCreator from "./_components/ai-event-creator";
import AIDescriptionButton from "@/components/ai-description-button";
import UnsplashImagePicker from "@/components/unsplash-image-picker";
import UpgradeModal from "@/components/upgrade-modal";
import Image from "next/image";

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/;

const proposalSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters"),
  category: z.string().min(1, "Choose a category"),
  conceptNote: z.string().min(30, "Share enough detail for authorities to review"),
  objectivesText: z.string().min(10, "Add at least one clear objective"),
  targetAudience: z.string().min(4, "Tell us who this event is for"),
  preferredStartDate: z.date().optional(),
  preferredEndDate: z.date().optional(),
  preferredStartTime: z.string().optional(),
  preferredEndTime: z.string().optional(),
  locationPreference: z.enum(["internal", "external", "online"]).default("internal"),
  expectedCapacity: z.number().min(1, "Expected capacity must be at least 1").optional(),
  aiSupportPlan: z.string().optional(),
});

const builderSchema = z
  .object({
    title: z.string().min(5, "Title must be at least 5 characters"),
    description: z.string().min(20, "Description must be at least 20 characters"),
    category: z.string().min(1, "Please select a category"),
    startDate: z.date({ required_error: "Start date is required" }),
    endDate: z.date({ required_error: "End date is required" }),
    startTime: z.string().regex(timeRegex, "Start time must be HH:MM"),
    endTime: z.string().regex(timeRegex, "End time must be HH:MM"),
    locationType: z.enum(["physical", "online"]).default("physical"),
    venueScope: z.enum(["internal", "external"]).default("internal"),
    venue: z.string().url("Must be a valid URL").optional().or(z.literal("")),
    addressLine1: z.string().optional(),
    addressLine2: z.string().optional(),
    city: z.string().optional(),
    state: z.string().optional(),
    externalReason: z.string().optional(),
    capacity: z.number().min(1, "Capacity must be at least 1"),
    ticketType: z.enum(["free", "paid"]).default("free"),
    ticketPrice: z.number().optional(),
    coverImage: z.string().optional(),
    themeColor: z.string().default("#1e3a8a"),
    heroBlurb: z.string().optional(),
    whyAttendText: z.string().optional(),
    agendaText: z.string().optional(),
    faqText: z.string().optional(),
    resourcesText: z.string().optional(),
    attendeeNotes: z.string().optional(),
    contactEmail: z.string().email("Enter a valid contact email").optional().or(z.literal("")),
  })
  .superRefine((data, ctx) => {
    if (data.locationType === "physical" && data.venueScope === "external") {
      if (!data.state?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "State is required", path: ["state"] });
      }
      if (!data.city?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "City is required", path: ["city"] });
      }
      if (!data.addressLine1?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Address is required", path: ["addressLine1"] });
      }
      if (!data.externalReason?.trim()) {
        ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Approval note is required", path: ["externalReason"] });
      }
    }

    if (data.locationType === "online" && !data.venue) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Meeting link is required", path: ["venue"] });
    }

    if (data.ticketType === "paid" && (!data.ticketPrice || data.ticketPrice <= 0)) {
      ctx.addIssue({ code: z.ZodIssueCode.custom, message: "Add a valid ticket price", path: ["ticketPrice"] });
    }
  });

function combineDateTime(date, time) {
  if (!date || !time) return null;
  const [hh, mm] = time.split(":").map(Number);
  const nextDate = new Date(date);
  nextDate.setHours(hh, mm, 0, 0);
  return nextDate;
}

function splitLines(value) {
  return value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);
}

function parseAgenda(value) {
  return splitLines(value).map((line) => {
    const [timePart, titlePart, descriptionPart] = line.split("|").map((item) => item.trim());
    return { time: timePart || "", title: titlePart || "", description: descriptionPart || undefined };
  });
}

function parseFaqs(value) {
  return splitLines(value).map((line) => {
    const [question, answer] = line.split("|").map((item) => item.trim());
    return { question: question || "", answer: answer || "" };
  });
}

function parseResources(value) {
  return splitLines(value).map((line) => {
    const [label, url] = line.split("|").map((item) => item.trim());
    return { label: label || "", url: url || "" };
  });
}

function StageCard({ number, title, text, active }) {
  return (
    <div className={`rounded-2xl border p-4 transition-all ${active ? "border-blue-300/50 bg-white text-slate-950 shadow-[0_20px_60px_rgba(30,64,175,0.18)]" : "border-white/15 bg-white/6 text-white/80"}`}>
      <div className="flex items-center gap-3">
        <div className={`flex h-10 w-10 items-center justify-center rounded-2xl text-sm font-bold ${active ? "bg-blue-600 text-white" : "bg-white/10 text-white"}`}>
          {number}
        </div>
        <div>
          <p className="text-sm font-semibold">{title}</p>
          <p className={`text-xs ${active ? "text-slate-600" : "text-slate-300/80"}`}>{text}</p>
        </div>
      </div>
    </div>
  );
}

function EventWorkflowPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const proposalId = searchParams.get("proposalId");
  const [showImagePicker, setShowImagePicker] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [upgradeReason, setUpgradeReason] = useState("limit");
  const [assignedAdminIds, setAssignedAdminIds] = useState([""]);
  const { has } = useAuth();
  const hasPro = has?.({ plan: "pro" });

  const { data: currentUser } = useConvexQuery(api.users.getCurrentUser);
  const { data: proposal } = useConvexQuery(api.events.getProposalById, proposalId ? { proposalId } : "skip");
  const { data: myProposals } = useConvexQuery(api.events.getMyEventProposals);
  const { data: adminUsers } = useConvexQuery(api.admin.getAdminUsers);
  const { mutate: createProposal, isLoading: isSubmittingProposal } = useConvexMutation(api.events.createProposal);
  const { mutate: createEventFromProposal, isLoading: isBuildingEvent } = useConvexMutation(api.adminEvents.createEventFromProposal);

  const proposalForm = useForm({
    resolver: zodResolver(proposalSchema),
    defaultValues: {
      category: "",
      locationPreference: "internal",
      objectivesText: "",
      aiSupportPlan: "",
    },
  });

  const builderForm = useForm({
    resolver: zodResolver(builderSchema),
    defaultValues: {
      title: proposal?.title || "",
      description: proposal?.conceptNote || "",
      category: proposal?.category || "",
      locationType: proposal?.locationPreference === "online" ? "online" : "physical",
      venueScope: proposal?.locationPreference === "external" ? "external" : "internal",
      ticketType: "free",
      capacity: proposal?.expectedCapacity || 50,
      themeColor: "#1e3a8a",
      coverImage: "",
      heroBlurb: proposal?.conceptNote || "",
      whyAttendText: proposal?.objectives?.join("\n") || "",
      attendeeNotes: "",
      agendaText: "",
      faqText: "",
      resourcesText: "",
      contactEmail: currentUser?.email || "",
    },
  });

  useEffect(() => {
    if (!proposalId || !proposal) return;
    builderForm.reset({
      title: proposal.title || "",
      description: proposal.conceptNote || "",
      category: proposal.category || "",
      locationType: proposal.locationPreference === "online" ? "online" : "physical",
      venueScope: proposal.locationPreference === "external" ? "external" : "internal",
      ticketType: "free",
      capacity: proposal.expectedCapacity || 50,
      themeColor: "#1e3a8a",
      coverImage: "",
      heroBlurb: proposal.conceptNote || "",
      whyAttendText: (proposal.objectives || []).join("\n"),
      attendeeNotes: "",
      agendaText: "",
      faqText: "",
      resourcesText: "",
      contactEmail: currentUser?.email || "",
    });
  }, [builderForm, currentUser?.email, proposal, proposalId]);

  const themeColor = builderForm.watch("themeColor");
  const ticketType = builderForm.watch("ticketType");
  const locationType = builderForm.watch("locationType");
  const venueScope = builderForm.watch("venueScope");
  const startDate = builderForm.watch("startDate");
  const endDate = builderForm.watch("endDate");
  const coverImage = builderForm.watch("coverImage");
  const stateValue = builderForm.watch("state") || "";
  const cityValue = builderForm.watch("city") || "";

  const allStates = useMemo(() => State.getStatesOfCountry("IN"), []);
  const selectedState = useMemo(() => allStates.find((item) => item.name.toLowerCase() === stateValue.trim().toLowerCase()), [allStates, stateValue]);
  const allCitiesForState = useMemo(() => (selectedState ? City.getCitiesOfState("IN", selectedState.isoCode) : []), [selectedState]);
  const matchingStates = useMemo(() => {
    const query = stateValue.trim().toLowerCase();
    if (query.length < 2) return [];
    return allStates.filter((item) => item.name.toLowerCase().includes(query)).slice(0, 8);
  }, [allStates, stateValue]);
  const matchingCities = useMemo(() => {
    if (!selectedState) return [];
    const query = cityValue.trim().toLowerCase();
    return allCitiesForState.filter((item) => item.name.toLowerCase().includes(query || "")).slice(0, 50);
  }, [allCitiesForState, cityValue, selectedState]);

  const colorPresets = ["#1e3a8a", ...(hasPro ? ["#0f766e", "#7c3aed", "#b45309", "#be123c", "#155e75"] : [])];
  const availableAdmins = (adminUsers || []).filter((admin) => admin._id !== proposal?.proposerId);

  const applyGeneratedDraft = (generatedData) => {
    builderForm.setValue("title", generatedData.title);
    builderForm.setValue("description", generatedData.description);
    builderForm.setValue("category", generatedData.category);
    builderForm.setValue("capacity", generatedData.suggestedCapacity);
    builderForm.setValue("ticketType", generatedData.suggestedTicketType);
    builderForm.setValue("heroBlurb", generatedData.description);
    toast.success("Draft filled. You can fine-tune the public page content now.");
  };

  const onSubmitProposal = async (data) => {
    try {
      await createProposal({
        title: data.title,
        category: data.category,
        conceptNote: data.conceptNote,
        objectives: splitLines(data.objectivesText),
        targetAudience: data.targetAudience,
        preferredStartDate: data.preferredStartDate ? combineDateTime(data.preferredStartDate, data.preferredStartTime || "09:00")?.getTime() : undefined,
        preferredEndDate: data.preferredEndDate ? combineDateTime(data.preferredEndDate, data.preferredEndTime || "17:00")?.getTime() : undefined,
        locationPreference: data.locationPreference,
        expectedCapacity: data.expectedCapacity,
        aiSupportPlan: data.aiSupportPlan || undefined,
      });
      toast.success("Proposal submitted for authority review.");
      proposalForm.reset();
    } catch (error) {
      toast.error(error.message || "Failed to submit proposal");
    }
  };

  const onSubmitEventBuilder = async (data) => {
    try {
      const cleanAdminIds = assignedAdminIds.filter(Boolean);
      if (cleanAdminIds.length < 1) {
        toast.error("Assign at least one event admin before creating the event.");
        return;
      }

      const start = combineDateTime(data.startDate, data.startTime);
      const end = combineDateTime(data.endDate, data.endTime);
      if (!start || !end || end.getTime() <= start.getTime()) {
        toast.error("Set a valid start and end schedule.");
        return;
      }

      if (data.themeColor !== "#1e3a8a" && !hasPro) {
        setUpgradeReason("color");
        setShowUpgradeModal(true);
        return;
      }

      const eventId = await createEventFromProposal({
        proposalId,
        adminIds: cleanAdminIds,
        title: data.title,
        description: data.description,
        category: data.category,
        tags: [data.category],
        startDate: start.getTime(),
        endDate: end.getTime(),
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
        locationType: data.locationType,
        venueScope: data.locationType === "physical" ? data.venueScope : undefined,
        venue: data.venue || undefined,
        address: [data.addressLine1, data.addressLine2].filter(Boolean).join(", ") || undefined,
        city: data.locationType === "online" ? "Online" : data.city || "Pune",
        state: data.locationType === "online" ? undefined : data.state || "Maharashtra",
        country: "India",
        externalReason: data.externalReason || undefined,
        capacity: data.capacity,
        ticketType: data.ticketType,
        ticketPrice: data.ticketPrice || undefined,
        coverImage: data.coverImage || undefined,
        themeColor: data.themeColor,
        contentSections: {
          heroBlurb: data.heroBlurb || undefined,
          attendeeNotes: data.attendeeNotes || undefined,
          contactEmail: data.contactEmail || undefined,
          whyAttend: splitLines(data.whyAttendText),
          agenda: parseAgenda(data.agendaText),
          faqs: parseFaqs(data.faqText),
          resources: parseResources(data.resourcesText),
        },
      });

      toast.success("Approved proposal converted into a live event workspace.");
      router.push(`/admin/events/${eventId}`);
    } catch (error) {
      toast.error(error.message || "Failed to create event");
    }
  };

  const handleColorClick = (color) => {
    if (color !== "#1e3a8a" && !hasPro) {
      setUpgradeReason("color");
      setShowUpgradeModal(true);
      return;
    }
    builderForm.setValue("themeColor", color);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(135deg,_#0f172a_0%,_#111827_44%,_#1e3a8a_100%)] px-4 py-8 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      <div className="relative mx-auto max-w-7xl space-y-8">
        <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="rounded-[28px] border border-white/15 bg-white/8 p-6 backdrop-blur-xl sm:p-8">
            <Badge className="border-white/15 bg-white/10 text-blue-100 hover:bg-white/10">UniSync Event Workflow</Badge>
            <h1 className="mt-4 max-w-3xl font-mono text-3xl font-semibold leading-tight text-white sm:text-5xl">
              {proposalId ? "Approved Event Builder" : "Propose First, Build After Approval"}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-200 sm:text-base">
              Organisers submit lean proposals, authorities review them, and approved events only go live after at least one event admin is appointed and the full attendee page is built.
            </p>
            <div className="mt-6 grid gap-3 sm:grid-cols-3">
              <StageCard number="01" title="Proposal" text="Organiser shares the concept and expected impact." active={!proposalId} />
              <StageCard number="02" title="Authority Review" text="Pending proposals get approved or denied with notes." active={Boolean(proposalId)} />
              <StageCard number="03" title="Page Build" text="Approved proposals become events only after admin assignment." active={Boolean(proposalId)} />
            </div>
          </div>

          <div className="rounded-[28px] border border-blue-200/20 bg-slate-950/70 p-6 backdrop-blur-xl">
            <p className="text-xs uppercase tracking-[0.3em] text-blue-200/80">Workflow Rules</p>
            <div className="mt-5 space-y-4">
              <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-emerald-200">
                  <CheckCircle2 className="h-4 w-4" />
                  Mandatory admin assignment
                </div>
                <p className="mt-2 text-sm text-emerald-100/85">
                  Approved events cannot be created until at least one event admin is selected. Use “Add another admin” for multi-owner events.
                </p>
              </div>
              <div className="rounded-2xl border border-amber-300/20 bg-amber-300/10 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-amber-100">
                  <Shield className="h-4 w-4" />
                  AI changes still need approval
                </div>
                <p className="mt-2 text-sm text-amber-50/85">
                  Event admins can prepare AI-assisted page updates, but those content changes stay in a pending queue until authority approval.
                </p>
              </div>
              <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
                <div className="flex items-center gap-2 text-sm font-semibold text-white">
                  <Sparkles className="h-4 w-4 text-blue-300" />
                  Better attendee pages
                </div>
                <p className="mt-2 text-sm text-slate-300">
                  The build step now includes hero messaging, reasons to attend, agenda blocks, FAQs, resources, and attendee notes for a fuller public event experience.
                </p>
              </div>
            </div>
          </div>
        </div>

        {!proposalId ? (
          <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
            <form onSubmit={proposalForm.handleSubmit(onSubmitProposal)} className="space-y-5">
              <section className="rounded-[28px] border border-white/15 bg-white/8 p-6 backdrop-blur-xl">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-blue-200/80">Step 1</p>
                    <h2 className="mt-2 text-2xl font-semibold">Event Proposal Studio</h2>
                    <p className="mt-2 max-w-2xl text-sm text-slate-300">Share intent, audience, timing, and why the event deserves approval. Authorities will use this to decide whether the build phase should unlock.</p>
                  </div>
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-200">Proposal Title</Label>
                    <Input {...proposalForm.register("title")} placeholder="Women in AI Summit 2026" className="h-12 border-white/10 bg-slate-950/50 text-white" />
                    {proposalForm.formState.errors.title && <p className="text-sm text-rose-300">{proposalForm.formState.errors.title.message}</p>}
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Category</Label>
                    <Controller
                      control={proposalForm.control}
                      name="category"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-12 border-white/10 bg-slate-950/50 text-white">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Location Preference</Label>
                    <Controller
                      control={proposalForm.control}
                      name="locationPreference"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-12 border-white/10 bg-slate-950/50 text-white">
                            <SelectValue placeholder="Where should it happen?" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="internal">Inside campus</SelectItem>
                            <SelectItem value="external">External venue</SelectItem>
                            <SelectItem value="online">Online</SelectItem>
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-200">Concept Note</Label>
                    <Textarea {...proposalForm.register("conceptNote")} rows={5} placeholder="Describe the event, why it matters, and what makes it worth approving." className="border-white/10 bg-slate-950/50 text-white" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-200">Objectives</Label>
                    <Textarea {...proposalForm.register("objectivesText")} rows={4} placeholder={"One objective per line\nBuild industry exposure\nCreate placement conversations"} className="border-white/10 bg-slate-950/50 text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Target Audience</Label>
                    <Input {...proposalForm.register("targetAudience")} placeholder="2nd to 4th year students, faculty, invited alumni" className="h-12 border-white/10 bg-slate-950/50 text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Expected Capacity</Label>
                    <Input type="number" {...proposalForm.register("expectedCapacity", { valueAsNumber: true })} placeholder="250" className="h-12 border-white/10 bg-slate-950/50 text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Preferred Start</Label>
                    <DateTimeField
                      date={proposalForm.watch("preferredStartDate")}
                      time={proposalForm.watch("preferredStartTime") || ""}
                      onDateChange={(date) => proposalForm.setValue("preferredStartDate", date)}
                      onTimeChange={(time) => proposalForm.setValue("preferredStartTime", time)}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Preferred End</Label>
                    <DateTimeField
                      date={proposalForm.watch("preferredEndDate")}
                      time={proposalForm.watch("preferredEndTime") || ""}
                      onDateChange={(date) => proposalForm.setValue("preferredEndDate", date)}
                      onTimeChange={(time) => proposalForm.setValue("preferredEndTime", time)}
                    />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-200">How AI/Admins Might Help</Label>
                    <Textarea {...proposalForm.register("aiSupportPlan")} rows={3} placeholder="Example: AI will help expand the public page, generate FAQs, and refine attendee messaging after approval." className="border-white/10 bg-slate-950/50 text-white" />
                  </div>
                </div>
              </section>

              <Button type="submit" disabled={isSubmittingProposal} className="h-12 w-full rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 text-base font-semibold text-white hover:opacity-95">
                {isSubmittingProposal ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <ArrowRight className="mr-2 h-4 w-4" />}
                Submit For Approval
              </Button>
            </form>

            <aside className="space-y-5">
              <div className="rounded-[28px] border border-white/15 bg-slate-950/70 p-6 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-200/80">My Proposal Queue</p>
                <div className="mt-4 space-y-3">
                  {(myProposals || []).slice(0, 5).map((item) => (
                    <div key={item._id} className="rounded-2xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <p className="font-semibold text-white">{item.title}</p>
                          <p className="mt-1 text-xs uppercase tracking-[0.2em] text-slate-400">{item.category}</p>
                        </div>
                        <Badge className={`${item.status === "approved" ? "bg-emerald-500/15 text-emerald-200" : item.status === "denied" ? "bg-rose-500/15 text-rose-200" : "bg-amber-500/15 text-amber-100"} border-0`}>
                          {item.status}
                        </Badge>
                      </div>
                      <p className="mt-3 text-sm text-slate-300 line-clamp-3">{item.conceptNote}</p>
                    </div>
                  ))}
                  {(!myProposals || myProposals.length === 0) && (
                    <div className="rounded-2xl border border-dashed border-white/15 p-5 text-sm text-slate-400">
                      No proposals yet. Your submissions will appear here with approval status and review notes.
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        ) : (
          <div className="grid gap-6 lg:grid-cols-[300px_1fr]">
            <aside className="space-y-5">
              <div className="rounded-[28px] border border-white/15 bg-slate-950/70 p-5 backdrop-blur-xl">
                <p className="text-xs uppercase tracking-[0.3em] text-blue-200/80">Approved Proposal</p>
                <h2 className="mt-3 text-xl font-semibold text-white">{proposal?.title || "Loading proposal..."}</h2>
                <p className="mt-3 text-sm text-slate-300">{proposal?.conceptNote}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  <Badge className="border-0 bg-emerald-500/15 text-emerald-100">{proposal?.status || "pending"}</Badge>
                  <Badge className="border-0 bg-white/10 text-slate-200">{proposal?.locationPreference || "internal"}</Badge>
                </div>
                {proposal?.reviewNotes && <p className="mt-4 rounded-2xl border border-white/10 bg-white/5 p-3 text-sm text-slate-300">{proposal.reviewNotes}</p>}
              </div>
              <div className="rounded-[28px] border border-white/15 bg-slate-950/70 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200/80">Cover Image</p>
                  <Button type="button" variant="outline" size="sm" className="border-white/10 bg-white/5 text-white hover:bg-white/10" onClick={() => setShowImagePicker(true)}>
                    Choose
                  </Button>
                </div>
                <div className="mt-4 overflow-hidden rounded-[24px] border border-white/10 bg-white/5">
                  {coverImage ? (
                    <Image src={coverImage} alt="Cover" className="h-64 w-full object-cover" width={500} height={500} />
                  ) : (
                    <div className="flex h-64 items-center justify-center text-sm text-slate-400">Select a hero image for the public page</div>
                  )}
                </div>
              </div>

              <div className="rounded-[28px] border border-white/15 bg-slate-950/70 p-5 backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-[0.3em] text-blue-200/80">Theme Tokens</p>
                  {!hasPro && <Badge className="border-0 bg-white/10 text-slate-200">Pro palette</Badge>}
                </div>
                <div className="mt-4 flex flex-wrap gap-3">
                  {colorPresets.map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => handleColorClick(color)}
                      className={`h-10 w-10 rounded-2xl border-2 transition ${themeColor === color ? "border-white scale-105" : "border-transparent"} ${!hasPro && color !== "#1e3a8a" ? "cursor-not-allowed opacity-40" : "hover:scale-105"}`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>
            </aside>

            <form onSubmit={builderForm.handleSubmit(onSubmitEventBuilder)} className="space-y-5">
              <section className="rounded-[28px] border border-white/15 bg-white/8 p-6 backdrop-blur-xl">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-blue-200/80">Step 3</p>
                    <h2 className="mt-2 text-2xl font-semibold text-white">Build The Approved Event</h2>
                    <p className="mt-2 text-sm text-slate-300">This is where the approved proposal turns into a detailed event page. Event admins are mandatory before the event can be created.</p>
                  </div>
                  <AIEventCreator onEventGenerated={applyGeneratedDraft} />
                </div>

                <div className="mt-6 grid gap-5 md:grid-cols-2">
                  <div className="space-y-2 md:col-span-2">
                    <Label className="text-slate-200">Event Title</Label>
                    <Input {...builderForm.register("title")} className="h-12 border-white/10 bg-slate-950/50 text-white" />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Category</Label>
                    <Controller
                      control={builderForm.control}
                      name="category"
                      render={({ field }) => (
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger className="h-12 border-white/10 bg-slate-950/50 text-white">
                            <SelectValue placeholder="Select category" />
                          </SelectTrigger>
                          <SelectContent>
                            {CATEGORIES.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.label}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      )}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Capacity</Label>
                    <Input type="number" {...builderForm.register("capacity", { valueAsNumber: true })} className="h-12 border-white/10 bg-slate-950/50 text-white" />
                  </div>

                  <div className="space-y-2 md:col-span-2">
                    <div className="flex items-center justify-between gap-3">
                      <Label className="text-slate-200">Description</Label>
                      <AIDescriptionButton
                        description={builderForm.watch("description")}
                        onApply={(value) => builderForm.setValue("description", value, { shouldDirty: true, shouldValidate: true })}
                        className="h-9 border-white/10 bg-white/5 text-xs text-white hover:bg-white/10"
                      />
                    </div>
                    <Textarea {...builderForm.register("description")} rows={5} className="border-white/10 bg-slate-950/50 text-white" />
                  </div>
                </div>
              </section>

              <section className="rounded-[28px] border border-emerald-300/20 bg-emerald-400/10 p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-emerald-100/80">Mandatory Setup</p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Assign Event Admins</h3>
                    <p className="mt-2 text-sm text-emerald-50/85">These admins will manage content, logistics, and AI-assisted update requests for this event.</p>
                  </div>
                  <Button type="button" variant="outline" onClick={() => setAssignedAdminIds((current) => [...current, ""])} className="border-white/15 bg-white/10 text-white hover:bg-white/15">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Another Admin
                  </Button>
                </div>

                <div className="mt-5 space-y-3">
                  {assignedAdminIds.map((adminId, index) => (
                    <div key={`${index}-${adminId}`} className="grid gap-3 rounded-2xl border border-white/10 bg-slate-950/50 p-4 md:grid-cols-[1fr_auto]">
                      <Select
                        value={adminId}
                        onValueChange={(value) => setAssignedAdminIds((current) => current.map((item, itemIndex) => (itemIndex === index ? value : item)))}
                      >
                        <SelectTrigger className="h-12 border-white/10 bg-white/5 text-white">
                          <SelectValue placeholder="Choose an event admin" />
                        </SelectTrigger>
                        <SelectContent>
                          {availableAdmins.map((admin) => (
                            <SelectItem key={admin._id} value={admin._id}>
                              {admin.name} · {admin.email}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button type="button" variant="outline" disabled={assignedAdminIds.length === 1} onClick={() => setAssignedAdminIds((current) => current.filter((_, itemIndex) => itemIndex !== index))} className="h-12 border-white/10 bg-white/5 text-white hover:bg-white/10 disabled:opacity-40">
                        <X className="mr-2 h-4 w-4" />
                        Remove
                      </Button>
                    </div>
                  ))}
                </div>
              </section>

              <section className="rounded-[28px] border border-white/15 bg-white/8 p-6 backdrop-blur-xl">
                <h3 className="text-xl font-semibold text-white">Schedule, Location, and Ticketing</h3>
                <div className="mt-5 grid gap-5 md:grid-cols-2">
                  <div className="space-y-2">
                    <Label className="text-slate-200">Start</Label>
                    <DateTimeField
                      date={startDate}
                      time={builderForm.watch("startTime")}
                      onDateChange={(date) => builderForm.setValue("startDate", date)}
                      onTimeChange={(time) => builderForm.setValue("startTime", time)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200">End</Label>
                    <DateTimeField
                      date={endDate}
                      time={builderForm.watch("endTime")}
                      onDateChange={(date) => builderForm.setValue("endDate", date)}
                      onTimeChange={(time) => builderForm.setValue("endTime", time)}
                      disabledDates={(date) => date < (startDate || new Date())}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Location Type</Label>
                    <div className="flex gap-2">
                      {["physical", "online"].map((option) => (
                        <label key={option} className={`flex-1 cursor-pointer rounded-2xl border px-4 py-3 text-center text-sm capitalize transition ${locationType === option ? "border-blue-300/60 bg-blue-400/15 text-white" : "border-white/10 bg-slate-950/50 text-slate-300"}`}>
                          <input type="radio" value={option} {...builderForm.register("locationType")} className="sr-only" />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label className="text-slate-200">Ticket Type</Label>
                    <div className="flex gap-2">
                      {["free", "paid"].map((option) => (
                        <label key={option} className={`flex-1 cursor-pointer rounded-2xl border px-4 py-3 text-center text-sm capitalize transition ${ticketType === option ? "border-emerald-300/60 bg-emerald-400/15 text-white" : "border-white/10 bg-slate-950/50 text-slate-300"}`}>
                          <input type="radio" value={option} {...builderForm.register("ticketType")} className="sr-only" />
                          {option}
                        </label>
                      ))}
                    </div>
                  </div>

                  {locationType === "physical" ? (
                    <>
                      <div className="space-y-2 md:col-span-2">
                        <Label className="text-slate-200">Venue Scope</Label>
                        <div className="grid gap-2 md:grid-cols-2">
                          {[
                            { value: "internal", label: "Inside campus" },
                            { value: "external", label: "External venue" },
                          ].map((option) => (
                            <label key={option.value} className={`cursor-pointer rounded-2xl border px-4 py-3 text-sm transition ${venueScope === option.value ? "border-blue-300/60 bg-blue-400/15 text-white" : "border-white/10 bg-slate-950/50 text-slate-300"}`}>
                              <input type="radio" value={option.value} {...builderForm.register("venueScope")} className="sr-only" />
                              {option.label}
                            </label>
                          ))}
                        </div>
                      </div>

                      {venueScope === "external" ? (
                        <>
                          <div className="space-y-2">
                            <Label className="text-slate-200">State</Label>
                            <Input {...builderForm.register("state")} list="state-options" className="h-12 border-white/10 bg-slate-950/50 text-white" />
                            <datalist id="state-options">
                              {matchingStates.map((state) => <option key={state.isoCode} value={state.name} />)}
                            </datalist>
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-200">City</Label>
                            <Input {...builderForm.register("city")} list="city-options" className="h-12 border-white/10 bg-slate-950/50 text-white" />
                            <datalist id="city-options">
                              {matchingCities.map((city) => <option key={city.name} value={city.name} />)}
                            </datalist>
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-slate-200">Address Line 1</Label>
                            <Input {...builderForm.register("addressLine1")} className="h-12 border-white/10 bg-slate-950/50 text-white" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-slate-200">Address Line 2</Label>
                            <Input {...builderForm.register("addressLine2")} className="h-12 border-white/10 bg-slate-950/50 text-white" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-200">Map Link</Label>
                            <Input type="url" {...builderForm.register("venue")} className="h-12 border-white/10 bg-slate-950/50 text-white" />
                          </div>
                          <div className="space-y-2">
                            <Label className="text-slate-200">External Approval Note</Label>
                            <Textarea {...builderForm.register("externalReason")} rows={3} className="border-white/10 bg-slate-950/50 text-white" />
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-slate-200">On-campus Venue</Label>
                            <Input {...builderForm.register("addressLine1")} placeholder="Auditorium, hall, lab, or block name" className="h-12 border-white/10 bg-slate-950/50 text-white" />
                          </div>
                          <div className="space-y-2 md:col-span-2">
                            <Label className="text-slate-200">Optional Map Link</Label>
                            <Input type="url" {...builderForm.register("venue")} className="h-12 border-white/10 bg-slate-950/50 text-white" />
                          </div>
                        </>
                      )}
                    </>
                  ) : (
                    <div className="space-y-2 md:col-span-2">
                      <Label className="text-slate-200">Meeting Link</Label>
                      <Input type="url" {...builderForm.register("venue")} className="h-12 border-white/10 bg-slate-950/50 text-white" />
                    </div>
                  )}

                  {ticketType === "paid" && (
                    <div className="space-y-2">
                      <Label className="text-slate-200">Ticket Price</Label>
                      <Input type="number" {...builderForm.register("ticketPrice", { valueAsNumber: true })} className="h-12 border-white/10 bg-slate-950/50 text-white" />
                    </div>
                  )}
                </div>
              </section>

              <section className="rounded-[28px] border border-white/15 bg-white/8 p-6 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <Wand2 className="h-5 w-5 text-blue-300" />
                  <h3 className="text-xl font-semibold text-white">Public Page Content Blocks</h3>
                </div>
                <p className="mt-2 text-sm text-slate-300">These sections are what event admins will later refine through approved AI/content requests.</p>
                <div className="mt-5 grid gap-5">
                  <div className="space-y-2">
                    <Label className="text-slate-200">Hero Blurb</Label>
                    <Textarea {...builderForm.register("heroBlurb")} rows={3} className="border-white/10 bg-slate-950/50 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200">Why Attend</Label>
                    <Textarea {...builderForm.register("whyAttendText")} rows={4} placeholder={"One line per reason\nMeet recruiters\nHands-on workshops"} className="border-white/10 bg-slate-950/50 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200">Agenda</Label>
                    <Textarea {...builderForm.register("agendaText")} rows={5} placeholder={"Use one line per item: time | title | description\n09:00 | Registration | Check-in and networking\n10:00 | Keynote | Opening session"} className="border-white/10 bg-slate-950/50 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200">FAQs</Label>
                    <Textarea {...builderForm.register("faqText")} rows={4} placeholder={"Use one line per FAQ: question | answer\nIs prior registration required? | Yes, seats are limited."} className="border-white/10 bg-slate-950/50 text-white" />
                  </div>
                  <div className="space-y-2">
                    <Label className="text-slate-200">Resources</Label>
                    <Textarea {...builderForm.register("resourcesText")} rows={4} placeholder={"Use one line per resource: label | url\nSpeaker deck | https://example.com/deck"} className="border-white/10 bg-slate-950/50 text-white" />
                  </div>
                  <div className="grid gap-5 md:grid-cols-2">
                    <div className="space-y-2">
                      <Label className="text-slate-200">Attendee Notes</Label>
                      <Textarea {...builderForm.register("attendeeNotes")} rows={4} className="border-white/10 bg-slate-950/50 text-white" />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-slate-200">Contact Email</Label>
                      <Input {...builderForm.register("contactEmail")} className="h-12 border-white/10 bg-slate-950/50 text-white" />
                    </div>
                  </div>
                </div>
              </section>

              <Button type="submit" disabled={isBuildingEvent} className="h-12 w-full rounded-2xl bg-gradient-to-r from-blue-500 to-emerald-500 text-base font-semibold text-white hover:opacity-95">
                {isBuildingEvent ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Shield className="mr-2 h-4 w-4" />}
                Create Event From Approved Proposal
              </Button>
            </form>
          </div>
        )}
      </div>

      {showImagePicker && (
        <UnsplashImagePicker
          isOpen={showImagePicker}
          onClose={() => setShowImagePicker(false)}
          onSelect={(url) => {
            builderForm.setValue("coverImage", url);
            setShowImagePicker(false);
          }}
        />
      )}

      <UpgradeModal isOpen={showUpgradeModal} onClose={() => setShowUpgradeModal(false)} trigger={upgradeReason} />
    </div>
  );
}

function EventWorkflowPageFallback() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-[radial-gradient(circle_at_top_left,_rgba(59,130,246,0.18),_transparent_32%),linear-gradient(135deg,_#0f172a_0%,_#111827_44%,_#1e3a8a_100%)] px-4 py-8 text-white sm:px-6">
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.04)_1px,transparent_1px)] bg-[size:40px_40px] opacity-20" />
      <div className="relative mx-auto flex min-h-[70vh] max-w-7xl items-center justify-center">
        <div className="rounded-[28px] border border-white/15 bg-white/8 px-8 py-6 text-center backdrop-blur-xl">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-blue-200" />
          <p className="mt-4 text-sm text-slate-200">Preparing the event workflow...</p>
        </div>
      </div>
    </div>
  );
}

export default function EventWorkflowPage() {
  return (
    <Suspense fallback={<EventWorkflowPageFallback />}>
      <EventWorkflowPageContent />
    </Suspense>
  );
}
