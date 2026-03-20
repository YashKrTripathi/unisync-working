import { BadgeCheck, Building2, Globe2, Sparkles, Users2 } from "lucide-react";
import PitchEventForm from "@/components/pitch/pitch-event-form";
import AnimatedArrowButton from "@/components/ui/animated-arrow-button";

export const metadata = {
  title: "Pitch A New Event | Uni Sync",
  description: "Pitch a new event to UniSync whether you are inside or outside the university.",
};

const audienceCards = [
  {
    title: "Inside the university",
    description: "Student clubs, societies, faculty teams, and campus-led communities can propose new experiences, festivals, workshops, and showcases.",
    icon: Users2,
  },
  {
    title: "Outside the university",
    description: "Brands, creators, startups, and cultural partners can pitch collaborative formats for campus engagement and high-visibility activations.",
    icon: Globe2,
  },
  {
    title: "Production-ready support",
    description: "Pitch the idea first. UniSync can help shape the buildout, audience plan, venue logic, and execution stack if the concept fits.",
    icon: BadgeCheck,
  },
];

export default function PitchEventPage() {
  return (
    <div className="relative overflow-hidden bg-[#07070b] px-4 pb-20 pt-28 text-white sm:px-6 lg:px-10">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_14%_16%,rgba(255,77,155,0.2),transparent_28%),radial-gradient(circle_at_84%_18%,rgba(70,230,255,0.14),transparent_24%),radial-gradient(circle_at_50%_88%,rgba(132,66,255,0.16),transparent_28%),linear-gradient(180deg,#07070b_0%,#0a0810_48%,#06050a_100%)]" />
      <div className="pointer-events-none absolute inset-0 opacity-35 [background:linear-gradient(to_right,rgba(255,255,255,0.06)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.06)_1px,transparent_1px)] [background-size:52px_52px]" />

      <section className="relative grid min-h-[78vh] items-end gap-10 rounded-[36px] border border-white/12 bg-black/35 p-6 shadow-[0_30px_80px_rgba(0,0,0,0.26)] backdrop-blur-2xl lg:grid-cols-[1.15fr_0.85fr] lg:p-10">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-white/14 bg-white/[0.04] px-4 py-2 text-[11px] font-semibold uppercase tracking-[0.34em] text-white/72">
            <Sparkles className="h-3.5 w-3.5 text-[#ec4899]" />
            New Event Intake
          </div>

          <h1 className="mt-8 font-display text-[clamp(4rem,11vw,10rem)] leading-[0.82] tracking-[-0.06em] text-white">
            PITCH
            <br />
            THE NEXT
            <br />
            BIG ONE
          </h1>

          <p className="mt-6 max-w-2xl text-lg leading-8 text-white/74 md:text-xl">
            Contact Us is now for general queries, partnerships, and support. If you want to launch a new event concept,
            use this dedicated pitch flow built for both university organisers and outside collaborators.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row">
            <AnimatedArrowButton
              href="/contact-us"
              icon="left"
              color="#ec4899"
              textColor="#1a0a13"
            >
              General Contact
            </AnimatedArrowButton>
            <div className="inline-flex min-h-14 items-center gap-3 rounded-[20px] border border-white/12 bg-white/[0.04] px-5 text-sm font-medium text-white/80">
              <Building2 className="h-4 w-4 text-[#ec4899]" />
              Internal and external event ideas welcome
            </div>
          </div>
        </div>

        <div className="grid gap-4">
          {audienceCards.map((card) => {
            const Icon = card.icon;
            return (
              <article key={card.title} className="rounded-[26px] border border-white/12 bg-white/[0.04] p-5">
                <div className="flex items-start gap-4">
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-[16px] bg-white text-black">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-semibold text-white">{card.title}</h2>
                    <p className="mt-2 text-sm leading-7 text-white/68">{card.description}</p>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="relative mt-8 grid gap-8 rounded-[36px] border border-white/12 bg-black/35 p-6 shadow-[0_24px_70px_rgba(0,0,0,0.24)] backdrop-blur-2xl lg:grid-cols-[1fr_0.85fr] lg:p-10">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/48">Pitch Form</p>
          <h2 className="mt-4 text-4xl font-semibold tracking-tight text-white">Tell us what should exist next.</h2>
          <p className="mt-4 max-w-2xl text-base leading-8 text-white/68">
            Share the concept, audience, format, and timing. We review event pitches for creative quality, operational fit,
            campus relevance, and collaboration potential.
          </p>

          <div className="mt-8 grid gap-4 md:grid-cols-3">
            <div className="rounded-[24px] border border-white/12 bg-white/[0.04] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">Best fit</p>
              <p className="mt-3 text-sm leading-7 text-white/74">Hackathons, summits, showcases, festivals, cultural experiences, and high-signal collaborations.</p>
            </div>
            <div className="rounded-[24px] border border-white/12 bg-white/[0.04] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">Include</p>
              <p className="mt-3 text-sm leading-7 text-white/74">Why it matters, who it serves, expected footfall, timing, and what support you need from UniSync.</p>
            </div>
            <div className="rounded-[24px] border border-white/12 bg-white/[0.04] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/45">Outcome</p>
              <p className="mt-3 text-sm leading-7 text-white/74">If the concept fits, the team can move it into review, planning, and execution support.</p>
            </div>
          </div>
        </div>

        <div className="rounded-[30px] border border-white/12 bg-[#0c0b11]/92 p-6">
          <PitchEventForm />
        </div>
      </section>

      <section className="relative mt-8 flex flex-col gap-4 rounded-[32px] border border-white/12 bg-[#09090b] p-6 text-white lg:flex-row lg:items-center lg:justify-between lg:p-8">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-[0.34em] text-white/50">Need a softer route?</p>
          <h3 className="mt-3 text-2xl font-semibold">For general support, outreach, or collaboration questions, use the regular contact page.</h3>
        </div>
        <AnimatedArrowButton
          href="/contact-us"
          icon="right"
          color="#adff2f"
          textColor="#212121"
        >
          Open Contact Desk
        </AnimatedArrowButton>
      </section>
    </div>
  );
}
