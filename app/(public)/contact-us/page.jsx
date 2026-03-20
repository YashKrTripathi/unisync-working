import { Mail, PhoneCall, MapPin, Sparkles, Clock3, ArrowRight } from "lucide-react";
import ContactForm from "@/components/contact/contact-form";
import AnimatedArrowButton from "@/components/ui/animated-arrow-button";

export const metadata = {
  title: "Contact Us | Uni Sync",
  description: "Reach the Uni Sync team for support, partnerships, and campus event collaborations.",
};

const CONTACT_CARDS = [
  {
    title: "General Support",
    detail: "rigved.aherrao.26@gmail.com",
    icon: Mail,
    accent: "from-[#ff4d9b]/35 to-[#ff7a18]/20",
  },
  {
    title: "Hotline",
    detail: "+91 1234567890",
    icon: PhoneCall,
    accent: "from-[#46e6ff]/30 to-[#4f46e5]/20",
  },
  {
    title: "Swagat Plaza",
    detail: "DYPIU Event Hub, Akurdi, Pune",
    icon: MapPin,
    accent: "from-[#a3ff5a]/25 to-[#facc15]/20",
  },
];

export default function ContactUsPage() {
  return (
    <div className="relative isolate overflow-hidden bg-[#07070b] px-6 pb-24 pt-28 text-white md:px-10">
      <div className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(circle_at_10%_15%,rgba(255,77,155,0.28),transparent_34%),radial-gradient(circle_at_82%_18%,rgba(70,230,255,0.22),transparent_32%),radial-gradient(circle_at_52%_88%,rgba(132,66,255,0.28),transparent_36%)]" />
      <div className="pointer-events-none absolute inset-0 -z-10 opacity-40 [background:linear-gradient(to_right,rgba(255,255,255,0.08)_1px,transparent_1px),linear-gradient(to_bottom,rgba(255,255,255,0.08)_1px,transparent_1px)] [background-size:48px_48px]" />

      <section className="mx-auto max-w-6xl">
        <div className="rounded-[42px] border border-white/15 bg-black/35 p-8 backdrop-blur-2xl md:p-12">
          <p className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-white/75">
            <Sparkles className="h-3.5 w-3.5 text-[#ff4d9b]" />
            Contact Experience
          </p>
          <h1 className="mt-8 max-w-4xl font-['var(--font-anton)'] text-5xl uppercase leading-[0.9] tracking-[-0.02em] text-white md:text-7xl">
            Reach out for support, partnerships, or a direct conversation
          </h1>
          <p className="mt-6 max-w-3xl text-lg text-white/75 md:text-xl">
            This page is for regular queries, support requests, partnerships, and general outreach. If you want to pitch a brand-new event concept,
            use the dedicated event pitch page built for both people inside and outside the university.
          </p>
          <div className="mt-8 flex flex-col gap-4 md:flex-row md:items-center">
            <AnimatedArrowButton href="/pitch-event" icon="right" color="#adff2f" textColor="#212121">
              Pitch A New Event
            </AnimatedArrowButton>
            <div className="inline-flex items-center gap-2 border border-white/12 bg-white/[0.04] px-4 py-3 text-sm text-white/75">
              <ArrowRight className="h-4 w-4 text-[#46e6ff]" />
              General contact stays here. New event proposals move to a separate intake path.
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 grid max-w-6xl gap-6 md:grid-cols-3">
        {CONTACT_CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <article
              key={card.title}
              className={`rounded-[30px] border border-white/15 bg-gradient-to-br ${card.accent} p-[1px] shadow-[0_12px_40px_rgba(0,0,0,0.45)]`}
            >
              <div className="h-full rounded-[28px] bg-[#09090f]/90 p-6">
                <Icon className="h-6 w-6 text-white/90" />
                <h2 className="mt-8 text-2xl font-semibold">{card.title}</h2>
                <p className="mt-2 text-base text-white/75">{card.detail}</p>
              </div>
            </article>
          );
        })}
      </section>

      <section className="mx-auto mt-10 grid max-w-6xl gap-8 rounded-[38px] border border-white/15 bg-black/35 p-7 backdrop-blur-2xl md:grid-cols-[1.05fr_0.95fr] md:p-10">
        <ContactForm />

        <div className="rounded-[28px] border border-white/15 bg-white/[0.03] p-6">
          <h3 className="text-2xl font-semibold">Fast lane support windows</h3>
          <div className="mt-6 space-y-4">
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-white/50">Response ETA</p>
              <p className="mt-2 flex items-center gap-2 text-lg font-medium">
                <Clock3 className="h-4 w-4 text-[#46e6ff]" /> Under 6 hours
              </p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-white/50">Partnership Desk</p>
              <p className="mt-2 text-lg font-medium">Mon - Sat, 10:00 AM to 7:00 PM</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-black/30 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-white/50">Priority Queue</p>
              <p className="mt-2 text-lg font-medium">Include your event date + expected footfall</p>
            </div>
            <div className="rounded-2xl border border-[#adff2f]/20 bg-[#adff2f]/10 p-4">
              <p className="text-xs uppercase tracking-[0.25em] text-[#d9ff91]">Pitching a new event?</p>
              <p className="mt-2 text-lg font-medium text-white">Use the dedicated pitch intake instead of the regular contact form.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
