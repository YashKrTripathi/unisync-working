"use client";

import { useEffect, useRef, useState } from "react";
import {
  Building2,
  CalendarRange,
  CheckCircle2,
  ChevronRight,
  Loader2,
  Sparkles,
  User2,
} from "lucide-react";
import { toast } from "sonner";

const initialState = {
  fullName: "",
  email: "",
  organisation: "",
  audienceType: "inside-university",
  eventTitle: "",
  eventFormat: "",
  expectedAudience: "",
  proposedWindow: "",
  venuePreference: "",
  pitch: "",
  supportNeeded: "",
};

const audienceOptions = [
  {
    value: "inside-university",
    title: "Inside DYPIU",
    description: "Clubs, societies, departments, and faculty-led initiatives.",
  },
  {
    value: "outside-university",
    title: "Outside collaborator",
    description: "Brands, startups, creators, agencies, and cultural partners.",
  },
  {
    value: "collaborative",
    title: "Joint collaboration",
    description: "Internal and external teams building one shared experience.",
  },
];

const formatOptions = [
  {
    value: "Hackathon",
    title: "Hackathon",
    description: "Build, prototype, and compete.",
  },
  {
    value: "Workshop",
    title: "Workshop",
    description: "Hands-on learning and guided sessions.",
  },
  {
    value: "Seminar",
    title: "Seminar",
    description: "Talks, panels, and expert-led discussion.",
  },
];

function SectionShell({ eyebrow, title, description, icon: Icon, children }) {
  return (
    <section className="rounded-[28px] border border-white/10 bg-white/[0.035] p-5 shadow-[inset_0_1px_0_rgba(255,255,255,0.03)] sm:p-6">
      <div className="flex items-start gap-4">
        <div className="mt-0.5 inline-flex h-11 w-11 items-center justify-center rounded-[16px] border border-white/10 bg-black/30 text-white/80">
          <Icon className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">{eyebrow}</p>
          <h3 className="mt-2 text-2xl font-semibold tracking-tight text-white">{title}</h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-white/62">{description}</p>
        </div>
      </div>
      <div className="mt-6 space-y-5">{children}</div>
    </section>
  );
}

function FieldLabel({ label, helper, required = false, children }) {
  return (
    <label className="space-y-2.5 text-sm font-medium text-white/86">
      <div className="flex flex-wrap items-center gap-2">
        <span>{label}</span>
        {required && (
          <span className="rounded-full border border-[#46e6ff]/25 bg-[#46e6ff]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8ef2ff]">
            Required
          </span>
        )}
      </div>
      {helper && <p className="text-xs leading-6 text-white/45">{helper}</p>}
      {children}
    </label>
  );
}

function AutoGrowTextarea({
  value,
  onChange,
  placeholder,
  className,
  minRows = 1,
  maxRows,
}) {
  const textareaRef = useRef(null);

  useEffect(() => {
    if (!textareaRef.current) return;
    textareaRef.current.style.height = "auto";

    if (maxRows) {
      const computed = window.getComputedStyle(textareaRef.current);
      const lineHeight = Number.parseFloat(computed.lineHeight || "24");
      const maxHeight = lineHeight * maxRows + 24;
      textareaRef.current.style.height = `${Math.min(
        textareaRef.current.scrollHeight,
        maxHeight
      )}px`;
      textareaRef.current.style.overflowY =
        textareaRef.current.scrollHeight > maxHeight ? "auto" : "hidden";
      return;
    }

    textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    textareaRef.current.style.overflowY = "hidden";
  }, [value, maxRows]);

  return (
    <textarea
      ref={textareaRef}
      rows={minRows}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className={`${className} resize-none overflow-hidden`}
    />
  );
}

export default function PitchEventForm() {
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCustomFormatOpen, setIsCustomFormatOpen] = useState(false);

  const updateField = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

  const setFieldValue = (field, value) => {
    setFormData((current) => ({
      ...current,
      [field]: value,
    }));
  };

  const isCustomFormatSelected =
    isCustomFormatOpen ||
    (Boolean(formData.eventFormat) &&
      !formatOptions.some((option) => option.value === formData.eventFormat));

  const handleSubmit = async (event) => {
    event.preventDefault();

    const requiredFields = [
      formData.fullName,
      formData.email,
      formData.eventTitle,
      formData.eventFormat,
      formData.expectedAudience,
      formData.proposedWindow,
      formData.pitch,
    ];

    if (requiredFields.some((value) => !String(value).trim())) {
      toast.error("Please complete the highlighted core details before submitting your pitch.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/pitch-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          fullName: formData.fullName.trim(),
          email: formData.email.trim(),
          organisation: formData.organisation.trim(),
          audienceType: formData.audienceType,
          eventTitle: formData.eventTitle.trim(),
          eventFormat: formData.eventFormat.trim(),
          expectedAudience: formData.expectedAudience.trim(),
          proposedWindow: formData.proposedWindow.trim(),
          venuePreference: formData.venuePreference.trim(),
          pitch: formData.pitch.trim(),
          supportNeeded: formData.supportNeeded.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Could not submit your event pitch right now.");
      }

      setFormData(initialState);
      setIsCustomFormatOpen(false);
      toast.success("Your event pitch has been delivered to the UniSync team.");
    } catch (error) {
      toast.error(error?.message || "Could not submit your event pitch right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClassName =
    "h-13 w-full rounded-[18px] border border-white/12 bg-[#0f0d16] px-4 text-white outline-none transition duration-200 placeholder:text-white/30 focus:border-[#46e6ff] focus:bg-[#13111c]";
  const textAreaClassName =
    "w-full rounded-[22px] border border-white/12 bg-[#0f0d16] px-4 py-3 text-white outline-none transition duration-200 placeholder:text-white/30 focus:border-[#46e6ff] focus:bg-[#13111c]";
  const compactAreaClassName =
    "w-full rounded-[18px] border border-white/12 bg-[#0f0d16] px-4 py-3 text-white outline-none transition duration-200 placeholder:text-white/30 focus:border-[#46e6ff] focus:bg-[#13111c]";

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div className="overflow-hidden rounded-[30px] border border-[#46e6ff]/14 bg-[linear-gradient(180deg,rgba(70,230,255,0.11),rgba(255,255,255,0.02))]">
        <div className="border-b border-white/8 px-5 py-4 sm:px-6">
          <div className="flex flex-wrap items-center gap-3">
            <span className="inline-flex items-center gap-2 rounded-full border border-[#46e6ff]/20 bg-[#46e6ff]/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.26em] text-[#8ef2ff]">
              <Sparkles className="h-3.5 w-3.5" />
              Submit Event Pitch
            </span>
            <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-black/20 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.2em] text-white/52">
              3 short sections
            </span>
          </div>
          <h3 className="mt-4 text-2xl font-semibold tracking-tight text-white">
            Tell us who is pitching, what the event is, and why it should happen.
          </h3>
          <p className="mt-2 max-w-2xl text-sm leading-7 text-white/65">
            Fill the essentials first. If the concept is promising, the UniSync team can take it into review and planning.
          </p>
        </div>

        <div className="grid gap-3 px-5 py-4 sm:grid-cols-3 sm:px-6">
          {[
            "1. Introduce yourself",
            "2. Define the event basics",
            "3. Explain the pitch and support needed",
          ].map((step) => (
            <div
              key={step}
              className="rounded-[18px] border border-white/8 bg-black/20 px-4 py-3 text-sm text-white/78"
            >
              {step}
            </div>
          ))}
        </div>
      </div>

      <SectionShell
        eyebrow="Section One"
        title="Who is submitting this pitch?"
        description="This helps us understand whether the request comes from within the university, an outside partner, or a joint collaboration."
        icon={User2}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FieldLabel label="Full name" helper="The primary person we should contact." required>
            <input
              type="text"
              value={formData.fullName}
              onChange={updateField("fullName")}
              placeholder="Aarav Sharma"
              className={fieldClassName}
            />
          </FieldLabel>

          <FieldLabel label="Email" helper="Use the address where you want follow-up updates." required>
            <input
              type="email"
              value={formData.email}
              onChange={updateField("email")}
              placeholder="you@example.com"
              className={fieldClassName}
            />
          </FieldLabel>
        </div>

        <div className="grid gap-5 md:grid-cols-[0.95fr_1.05fr]">
          <FieldLabel
            label="Organisation / society / brand"
            helper="Optional, but useful if you represent a club, department, startup, or sponsor."
          >
            <AutoGrowTextarea
              value={formData.organisation}
              onChange={updateField("organisation")}
              placeholder="DYPIU Robotics Club / Independent organiser / External brand"
              className={compactAreaClassName}
              minRows={2}
              maxRows={5}
            />
          </FieldLabel>

          <div className="space-y-2.5">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-sm font-medium text-white/86">Who are you pitching as?</span>
              <span className="rounded-full border border-[#46e6ff]/25 bg-[#46e6ff]/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[#8ef2ff]">
                Required
              </span>
            </div>
            <p className="text-xs leading-6 text-white/45">
              Pick the route that best matches the ownership of this event idea.
            </p>
            <div className="grid gap-3">
              {audienceOptions.map((option) => {
                const isActive = formData.audienceType === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => setFieldValue("audienceType", option.value)}
                    className={`cursor-pointer rounded-[20px] border px-4 py-4 text-left transition duration-200 ${
                      isActive
                        ? "border-[#46e6ff]/45 bg-[#46e6ff]/12 shadow-[0_0_0_1px_rgba(70,230,255,0.12)]"
                        : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-sm font-semibold text-white">{option.title}</p>
                        <p className="mt-1 text-xs leading-6 text-white/56">{option.description}</p>
                      </div>
                      {isActive && <CheckCircle2 className="mt-0.5 h-4 w-4 text-[#46e6ff]" />}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow="Section Two"
        title="What is the event?"
        description="Keep this section concrete. Think title, format, timing, size, and venue preference."
        icon={CalendarRange}
      >
        <div className="grid gap-5 md:grid-cols-2">
          <FieldLabel label="Event title" helper="The working name of the experience." required>
            <input
              type="text"
              value={formData.eventTitle}
              onChange={updateField("eventTitle")}
              placeholder="Future of Sound Festival"
              className={fieldClassName}
            />
          </FieldLabel>

          <FieldLabel label="Event format" helper="Pick the closest format first. Use Other if this pitch needs a different structure." required>
            <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
              {formatOptions.map((option) => {
                const isActive = formData.eventFormat === option.value;
                return (
                  <button
                    key={option.value}
                    type="button"
                    onClick={() => {
                      setFieldValue("eventFormat", option.value);
                      setIsCustomFormatOpen(false);
                    }}
                    className={`cursor-pointer rounded-[20px] border px-4 py-4 text-left transition duration-200 ${
                      isActive
                        ? "border-[#ff4d9b]/45 bg-[#ff4d9b]/12 shadow-[0_0_0_1px_rgba(255,77,155,0.12)]"
                        : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/[0.04]"
                    }`}
                  >
                    <p className="text-sm font-semibold text-white">{option.title}</p>
                    <p className="mt-1 text-xs leading-6 text-white/56">{option.description}</p>
                  </button>
                );
              })}

              <button
                type="button"
                onClick={() => {
                  setFieldValue("eventFormat", "");
                  setIsCustomFormatOpen(true);
                }}
                className={`cursor-pointer rounded-[20px] border px-4 py-4 text-left transition duration-200 ${
                  isCustomFormatSelected
                    ? "border-[#46e6ff]/45 bg-[#46e6ff]/12 shadow-[0_0_0_1px_rgba(70,230,255,0.12)]"
                    : "border-white/10 bg-black/20 hover:border-white/20 hover:bg-white/[0.04]"
                }`}
              >
                <p className="text-sm font-semibold text-white">Other format</p>
                <p className="mt-1 text-xs leading-6 text-white/56">
                  Use this when the event is not a hackathon, workshop, or seminar.
                </p>
              </button>
            </div>

            {(!formData.eventFormat || isCustomFormatSelected) && (
              <AutoGrowTextarea
                value={formData.eventFormat}
                onChange={updateField("eventFormat")}
                placeholder="Type a custom format such as summit, showcase, competition, festival..."
                className={`${compactAreaClassName} mt-3`}
                minRows={2}
                maxRows={5}
              />
            )}
          </FieldLabel>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          <FieldLabel label="Expected audience" helper="Estimate who and how many may attend." required>
            <AutoGrowTextarea
              value={formData.expectedAudience}
              onChange={updateField("expectedAudience")}
              placeholder="300 students / mixed public audience"
              className={compactAreaClassName}
              minRows={2}
              maxRows={4}
            />
          </FieldLabel>

          <FieldLabel label="Proposed date window" helper="A rough month or time range is enough." required>
            <AutoGrowTextarea
              value={formData.proposedWindow}
              onChange={updateField("proposedWindow")}
              placeholder="Mid September 2026"
              className={compactAreaClassName}
              minRows={2}
              maxRows={4}
            />
          </FieldLabel>

          <FieldLabel label="Venue preference" helper="Optional if you already have a format in mind.">
            <AutoGrowTextarea
              value={formData.venuePreference}
              onChange={updateField("venuePreference")}
              placeholder="Campus auditorium / external venue / hybrid"
              className={compactAreaClassName}
              minRows={2}
              maxRows={4}
            />
          </FieldLabel>
        </div>
      </SectionShell>

      <SectionShell
        eyebrow="Section Three"
        title="Why should this event happen?"
        description="This is the most important part. Help us understand the concept, audience value, and where you want UniSync support."
        icon={Building2}
      >
        <div className="rounded-[24px] border border-[#adff2f]/14 bg-[#adff2f]/6 p-4">
          <p className="text-[11px] font-semibold uppercase tracking-[0.24em] text-[#d6ff92]">What makes a strong pitch</p>
          <ul className="mt-3 grid gap-2 text-sm leading-7 text-white/72 md:grid-cols-2">
            <li>What is the concept and why does it matter?</li>
            <li>Who is it for and why will they care?</li>
            <li>What scale are you aiming for?</li>
            <li>What support should UniSync bring in?</li>
          </ul>
        </div>

        <FieldLabel
          label="Event pitch"
          helper="Describe the concept, the experience, why it matters, and why UniSync should back it."
          required
        >
          <AutoGrowTextarea
            value={formData.pitch}
            onChange={updateField("pitch")}
            placeholder="Tell us the concept, who it is for, why it matters, and what success looks like."
            className={textAreaClassName}
            minRows={7}
            maxRows={14}
          />
        </FieldLabel>

        <FieldLabel
          label="Support needed"
          helper="Optional, but useful if you already know what kind of help you want."
        >
          <AutoGrowTextarea
            value={formData.supportNeeded}
            onChange={updateField("supportNeeded")}
            placeholder="Production support, ticketing, campus partnerships, venue guidance, sponsor outreach, branding..."
            className={textAreaClassName}
            minRows={5}
            maxRows={12}
          />
        </FieldLabel>
      </SectionShell>

      <div className="rounded-[28px] border border-white/10 bg-[linear-gradient(180deg,rgba(255,255,255,0.04),rgba(255,255,255,0.02))] p-5 sm:p-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-[0.28em] text-white/42">Final step</p>
            <h4 className="mt-2 text-xl font-semibold text-white">Submit the pitch for review</h4>
            <p className="mt-2 max-w-2xl text-sm leading-7 text-white/62">
              Once submitted, the UniSync team receives your details and reviews the concept for fit, timing, and execution potential.
            </p>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-h-14 items-center justify-center gap-3 rounded-full border border-[#ff4d9b]/28 bg-[linear-gradient(135deg,rgba(255,77,155,0.18),rgba(255,122,24,0.12))] px-7 text-sm font-semibold uppercase tracking-[0.22em] text-[#ffd2e7] transition duration-200 hover:border-[#ff4d9b]/58 hover:bg-[linear-gradient(135deg,rgba(255,77,155,0.28),rgba(255,122,24,0.18))] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? (
              <>
                Sending Pitch
                <Loader2 className="h-4 w-4 animate-spin" />
              </>
            ) : (
              <>
                Submit Event Pitch
                <ChevronRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </div>
    </form>
  );
}
