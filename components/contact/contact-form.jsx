"use client";

import { useState } from "react";
import { Send, Loader2 } from "lucide-react";
import { toast } from "sonner";

const initialState = {
  name: "",
  email: "",
  topic: "",
  message: "",
};

export default function ContactForm() {
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

    if (!formData.name.trim() || !formData.email.trim() || !formData.topic.trim() || !formData.message.trim()) {
      toast.error("Please fill in all fields before sending your message.");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/contact-us", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: formData.name.trim(),
          email: formData.email.trim(),
          topic: formData.topic.trim(),
          message: formData.message.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Could not send your message right now.");
      }

      setFormData(initialState);
      toast.success("Your message has been sent to the UniSync inbox.");
    } catch (error) {
      toast.error(error?.message || "Could not send your message right now.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form className="space-y-5" onSubmit={handleSubmit}>
      <div className="grid gap-5 md:grid-cols-2">
        <label className="space-y-2 text-sm font-medium text-white/80">
          Full Name
          <input
            type="text"
            value={formData.name}
            onChange={updateField("name")}
            placeholder="Aarav Sharma"
            className="h-12 w-full rounded-2xl border border-white/20 bg-white/5 px-4 text-white outline-none transition focus:border-[#46e6ff]"
          />
        </label>
        <label className="space-y-2 text-sm font-medium text-white/80">
          Email
          <input
            type="email"
            value={formData.email}
            onChange={updateField("email")}
            placeholder="you@dypiu.ac.in"
            className="h-12 w-full rounded-2xl border border-white/20 bg-white/5 px-4 text-white outline-none transition focus:border-[#ff4d9b]"
          />
        </label>
      </div>
      <label className="space-y-2 text-sm font-medium text-white/80">
        Topic
        <input
          type="text"
          value={formData.topic}
          onChange={updateField("topic")}
          placeholder="Sponsorship, ticketing, collaboration..."
          className="h-12 w-full rounded-2xl border border-white/20 bg-white/5 px-4 text-white outline-none transition focus:border-[#a3ff5a]"
        />
      </label>
      <label className="space-y-2 text-sm font-medium text-white/80">
        Your Message
        <textarea
          rows={5}
          value={formData.message}
          onChange={updateField("message")}
          placeholder="Share your goals, date window, and expected audience size."
          className="w-full rounded-2xl border border-white/20 bg-white/5 px-4 py-3 text-white outline-none transition focus:border-white/60"
        />
      </label>
      <button
        type="submit"
        disabled={isSubmitting}
        className="group inline-flex h-12 items-center gap-2 rounded-full bg-gradient-to-r from-[#ff4d9b] via-[#ff7a18] to-[#facc15] px-6 text-sm font-semibold uppercase tracking-[0.18em] text-black transition hover:scale-[1.02] disabled:cursor-not-allowed disabled:opacity-70"
      >
        {isSubmitting ? (
          <>
            Sending
            <Loader2 className="h-4 w-4 animate-spin" />
          </>
        ) : (
          <>
            Send Message
            <Send className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </>
        )}
      </button>
    </form>
  );
}
