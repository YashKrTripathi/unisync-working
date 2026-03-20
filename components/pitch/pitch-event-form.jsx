"use client";

import { useState } from "react";
import { Loader2 } from "lucide-react";
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

export default function PitchEventForm() {
  const [formData, setFormData] = useState(initialState);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const updateField = (field) => (event) => {
    setFormData((current) => ({
      ...current,
      [field]: event.target.value,
    }));
  };

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
      toast.error("Please complete the core event pitch details before submitting.");
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
      toast.success("Your event pitch has been delivered to the UniSync team.");
    } catch (error) {
      toast.error(error?.message || "Could not submit your event pitch right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const fieldClassName = "h-12 w-full rounded-none border border-white/12 bg-white/[0.04] px-4 text-white outline-none transition placeholder:text-white/35 focus:border-[#ff4d9b]";
  const textAreaClassName = "w-full rounded-none border border-white/12 bg-white/[0.04] px-4 py-3 text-white outline-none transition placeholder:text-white/35 focus:border-[#ff4d9b]";

  return (
    <form className="grid gap-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-white/82">
          Full Name
          <input
            type="text"
            value={formData.fullName}
            onChange={updateField("fullName")}
            placeholder="Aarav Sharma"
            className={fieldClassName}
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-white/82">
          Email
          <input
            type="email"
            value={formData.email}
            onChange={updateField("email")}
            placeholder="you@example.com"
            className={fieldClassName}
          />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-white/82">
          Organisation / Society / Brand
          <input
            type="text"
            value={formData.organisation}
            onChange={updateField("organisation")}
            placeholder="DYPIU Robotics Club / External brand / Independent organiser"
            className={fieldClassName}
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-white/82">
          Who are you pitching as?
          <select
            value={formData.audienceType}
            onChange={updateField("audienceType")}
            className={fieldClassName}
          >
            <option value="inside-university">Inside the university</option>
            <option value="outside-university">Outside the university</option>
            <option value="collaborative">Joint internal + external collaboration</option>
          </select>
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-white/82">
          Event Title
          <input
            type="text"
            value={formData.eventTitle}
            onChange={updateField("eventTitle")}
            placeholder="Future of Sound Festival"
            className={fieldClassName}
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-white/82">
          Event Format
          <input
            type="text"
            value={formData.eventFormat}
            onChange={updateField("eventFormat")}
            placeholder="Hackathon, summit, workshop, showcase, concert..."
            className={fieldClassName}
          />
        </label>
      </div>

      <div className="grid gap-5 md:grid-cols-3">
        <label className="space-y-2 text-sm font-medium text-white/82">
          Expected Audience
          <input
            type="text"
            value={formData.expectedAudience}
            onChange={updateField("expectedAudience")}
            placeholder="300 students / mixed public audience"
            className={fieldClassName}
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-white/82">
          Proposed Date Window
          <input
            type="text"
            value={formData.proposedWindow}
            onChange={updateField("proposedWindow")}
            placeholder="Mid September 2026"
            className={fieldClassName}
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-white/82">
          Venue Preference
          <input
            type="text"
            value={formData.venuePreference}
            onChange={updateField("venuePreference")}
            placeholder="Campus auditorium / external venue / hybrid"
            className={fieldClassName}
          />
        </label>
      </div>

      <label className="space-y-2 text-sm font-medium text-white/82">
        Event Pitch
        <textarea
          rows={6}
          value={formData.pitch}
          onChange={updateField("pitch")}
          placeholder="Tell us the concept, why it matters, who it is for, and why UniSync should back it."
          className={textAreaClassName}
        />
      </label>

      <label className="space-y-2 text-sm font-medium text-white/82">
        Support Needed
        <textarea
          rows={4}
          value={formData.supportNeeded}
          onChange={updateField("supportNeeded")}
          placeholder="Production support, venue guidance, ticketing, campus partnerships, sponsor outreach, branding..."
          className={textAreaClassName}
        />
      </label>

      <button
        type="submit"
        disabled={isSubmitting}
        className="inline-flex min-h-14 items-center justify-center gap-3 rounded-none border border-[#ff4d9b]/30 bg-[#ff4d9b]/12 px-7 text-sm font-semibold uppercase tracking-[0.2em] text-[#ffd2e7] transition hover:border-[#ff4d9b]/55 hover:bg-[#ff4d9b]/20 disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            Sending Pitch
            <Loader2 className="h-4 w-4 animate-spin" />
          </>
        ) : (
          "Submit Event Pitch"
        )}
      </button>
    </form>
  );
}
