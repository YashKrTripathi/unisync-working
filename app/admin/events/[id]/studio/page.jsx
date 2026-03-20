"use client";

import { use, useState, useEffect } from "react";
import { useMutation, useQuery } from "convex/react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  ChevronRight,
  Eye,
  Layout,
  Loader2,
  Maximize2,
  Minimize2,
  Palette,
  Save,
  Sparkles,
  Type,
  Zap,
} from "lucide-react";
import { toast } from "sonner";
import { api } from "@/convex/_generated/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

const LAYOUT_VARIANTS = [
  { id: "modern", name: "Modern Dark", description: "Glassmorphism with vibrant accents" },
  { id: "minimal", name: "Minimalist", description: "Clean, spacious and focused" },
  { id: "vibrant", name: "Vibrant", description: "Bold colors and high contrast" },
];

const FONTS = [
  { id: "sans", name: "Modern Sans (Inter)", class: "font-sans" },
  { id: "serif", name: "Elegant Serif", class: "font-serif" },
  { id: "mono", name: "Technical Mono", class: "font-mono" },
];

export default function CreativeStudioPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const adminCheck = useQuery(api.admin.isAdmin);
  const event = useQuery(api.adminEvents.getEventWithStats, { eventId: id });
  const updateVisuals = useMutation(api.adminEvents.updateEventVisuals);

  const [activePanel, setActivePanel] = useState("ai"); // ai, visuals, content
  const [isPreviewExpanded, setIsPreviewExpanded] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [aiPrompt, setAiPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Local state for visuals
  const [visuals, setVisuals] = useState({
    themeColor: "#f97316",
    primaryColor: "#000000",
    secondaryColor: "#ffffff",
    fontFamily: "sans",
    layoutVariant: "modern",
  });

  // Local state for content
  const [content, setContent] = useState({});

  useEffect(() => {
    if (event) {
      setVisuals({
        themeColor: event.themeColor || "#f97316",
        primaryColor: event.primaryColor || "#000000",
        secondaryColor: event.secondaryColor || "#ffffff",
        fontFamily: event.fontFamily || "sans",
        layoutVariant: event.layoutVariant || "modern",
      });
      setContent(event.contentSections || {});
    }
  }, [event]);

  if (!event || !adminCheck) {
    return (
      <div className="flex h-screen items-center justify-center bg-[#050505]">
        <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
      </div>
    );
  }

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateVisuals({
        eventId: id,
        ...visuals,
        contentSections: content,
      });
      toast.success("Event visuals updated successfully!");
    } catch (error) {
      toast.error(error.message || "Failed to save changes");
    } finally {
      setIsSaving(false);
    }
  };

  const handleAiBeautify = async () => {
    if (!aiPrompt.trim()) {
      toast.error("Please enter a prompt (e.g., 'make it look like a futuristic hackathon')");
      return;
    }
    
    setIsGenerating(true);
    try {
      const response = await fetch("/api/generate-event", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          task: "beautifyEvent",
          prompt: aiPrompt,
          eventDetails: {
            title: event.title,
            category: event.category,
            description: event.description,
          },
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result?.error || "AI generation failed");
      }

      if (result) {
        // Apply AI results to local state
        setVisuals(prev => ({
          ...prev,
          themeColor: result.themeColor || prev.themeColor,
          primaryColor: result.primaryColor || prev.primaryColor,
          fontFamily: result.fontFamily || prev.fontFamily,
          layoutVariant: result.layoutVariant || prev.layoutVariant,
          customCss: result.customCss || prev.customCss
        }));

        setContent(prev => ({
          ...prev,
          ...result.updates,
          heroBlurb: result.heroBlurb || prev.heroBlurb,
          description: result.updates?.description || prev.description,
          whyAttend: result.updates?.whyAttend || prev.whyAttend
        }));

        toast.success("AI Beautification applied! Check the preview.");
        setAiPrompt("");
      }
    } catch (error) {
      console.error("AI Error:", error);
      toast.error(error.message || "AI generation failed. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="flex h-screen flex-col overflow-hidden bg-[#050505] text-white">
      {/* Top Header */}
      <header className="flex h-16 items-center justify-between border-b border-white/5 bg-[#0a0a0a] px-6">
        <div className="flex items-center gap-4">
          <Link href={`/admin/events/${id}`} className="rounded-full p-2 hover:bg-white/5">
            <ArrowLeft className="h-5 w-5" />
          </Link>
          <div>
            <h1 className="text-lg font-semibold">{event.title}</h1>
            <p className="text-xs text-slate-400 font-mono tracking-tighter uppercase opacity-60">Creative Studio</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button variant="ghost" onClick={() => window.open(`/events/${event.slug}`, "_blank")} className="text-slate-300">
            <Eye className="mr-2 h-4 w-4" />
            Live View
          </Button>
          <Button onClick={handleSave} disabled={isSaving} className="bg-orange-600 hover:bg-orange-500 text-white px-6">
            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
            Publish Changes
          </Button>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Left Sidebar - Editor Tools */}
        <aside className="w-80 flex flex-col border-r border-white/5 bg-[#0a0a0a] overflow-y-auto">
          <div className="flex border-b border-white/5">
            {[
              { id: "ai", icon: Sparkles, label: "AI" },
              { id: "visuals", icon: Palette, label: "Visual" },
              { id: "content", icon: Layout, label: "Content" },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActivePanel(tab.id)}
                className={`flex flex-1 flex-col items-center gap-1 py-3 text-[10px] uppercase tracking-widest transition-colors ${
                  activePanel === tab.id ? "bg-orange-600/10 text-orange-500" : "text-slate-500 hover:text-slate-300"
                }`}
              >
                <tab.icon className={`h-5 w-5 ${activePanel === tab.id ? "text-orange-500" : ""}`} />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="p-5 space-y-6">
            {activePanel === "ai" && (
              <div className="space-y-4">
                <div className="rounded-2xl bg-orange-600/10 border border-orange-600/20 p-4">
                  <div className="flex items-center gap-2 text-orange-400 mb-2">
                    <Sparkles className="h-4 w-4" />
                    <span className="text-sm font-semibold tracking-tight">AI Beautifier</span>
                  </div>
                  <p className="text-xs text-orange-200/70 leading-relaxed italic">
                    Describe how you want the event to look. I'll handle the content, colors, and layout for you.
                  </p>
                </div>
                
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Your Prompt</label>
                  <Textarea 
                    value={aiPrompt}
                    onChange={(e) => setAiPrompt(e.target.value)}
                    placeholder="e.g. Make it look like a futuristic cyberpunk hackathon with deep purple accents and a detailed agenda..."
                    className="min-h-[140px] bg-white/[0.03] border-white/10 rounded-xl text-sm focus:ring-orange-500/50"
                  />
                </div>
                
                <Button 
                  onClick={handleAiBeautify}
                  disabled={isGenerating}
                  className="w-full bg-[linear-gradient(135deg,#ff6b1a,#ff8c00)] hover:brightness-110 h-11 rounded-xl font-semibold shadow-lg shadow-orange-950/20"
                >
                  {isGenerating ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                  Generate Style
                </Button>

                <div className="pt-4 border-t border-white/5">
                  <p className="text-xs text-slate-500 mb-3 uppercase tracking-widest font-bold">Suggested Presets</p>
                  <div className="grid gap-2">
                    {[
                      { name: "Competition", prompt: "Make it look like a professional competition page (reference: ecelldypiu.in/events/innovate-for-impact). Focus on clear tracks, prizes, and a detailed timeline." },
                      { name: "Workshop", prompt: "Make it look like an interactive workshop page (reference: ecelldypiu.in/events/finbiz). Focus on learning outcomes, tools needed, and a step-by-step agenda." },
                      { name: "Seminar", prompt: "Make it look like a premium seminar page (reference: ecelldypiu.in/events/elevate). Focus on speaker profiles, key talking points, and networking sessions." }
                    ].map(p => (
                      <button 
                        key={p.name} 
                        onClick={() => setAiPrompt(p.prompt)}
                        className="text-left text-xs p-3 rounded-lg border border-white/5 bg-white/5 hover:bg-white/10 transition-colors flex items-center justify-between group"
                      >
                        {p.name}
                        <ChevronRight className="h-3 w-3 text-slate-600 group-hover:text-slate-300" />
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activePanel === "visuals" && (
              <div className="space-y-6">
                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-bold flex items-center gap-2">
                    <Palette className="h-3 w-3" />
                    Accent Color
                  </label>
                  <div className="flex gap-2 items-center">
                    <input 
                      type="color" 
                      value={visuals.themeColor}
                      onChange={(e) => setVisuals({...visuals, themeColor: e.target.value})}
                      className="h-10 w-20 bg-transparent cursor-pointer rounded overflow-hidden border-0"
                    />
                    <Input 
                      value={visuals.themeColor}
                      onChange={(e) => setVisuals({...visuals, themeColor: e.target.value})}
                      className="bg-white/5 border-white/10 h-10 font-mono text-xs"
                    />
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-bold flex items-center gap-2">
                    <Type className="h-3 w-3" />
                    Typography
                  </label>
                  <div className="grid gap-2">
                    {FONTS.map(f => (
                      <button 
                        key={f.id}
                        onClick={() => setVisuals({...visuals, fontFamily: f.id})}
                        className={`p-3 rounded-xl border transition-all text-left ${
                          visuals.fontFamily === f.id ? "border-orange-500 bg-orange-500/10" : "border-white/5 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <p className={`text-sm ${f.class}`}>{f.name}</p>
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-xs uppercase tracking-widest text-slate-500 font-bold flex items-center gap-2">
                    <Layout className="h-3 w-3" />
                    Layout Variant
                  </label>
                  <div className="grid gap-2">
                    {LAYOUT_VARIANTS.map(l => (
                      <button 
                        key={l.id}
                        onClick={() => setVisuals({...visuals, layoutVariant: l.id})}
                        className={`p-3 rounded-xl border transition-all text-left ${
                          visuals.layoutVariant === l.id ? "border-orange-500 bg-orange-500/10" : "border-white/5 bg-white/5 hover:bg-white/10"
                        }`}
                      >
                        <p className="text-sm font-medium">{l.name}</p>
                        <p className="text-[10px] text-slate-500 mt-0.5">{l.description}</p>
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {activePanel === "content" && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Hero Blurb</label>
                  <Textarea 
                    value={content.heroBlurb || ""}
                    onChange={(e) => setContent({...content, heroBlurb: e.target.value})}
                    placeholder="Short punchy hook..."
                    className="bg-white/5 border-white/10 text-sm h-20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Event Description</label>
                  <Textarea 
                    value={content.description || ""}
                    onChange={(e) => setContent({...content, description: e.target.value})}
                    placeholder="Provide a detailed description..."
                    className="bg-white/5 border-white/10 text-sm h-32"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Why Attend (Comma separated)</label>
                  <Textarea 
                    value={Array.isArray(content.whyAttend) ? content.whyAttend.join(', ') : (content.whyAttend || "")}
                    onChange={(e) => setContent({...content, whyAttend: e.target.value.split(',').map(s => s.trim())})}
                    placeholder="Inspiration, Networking, Learning..."
                    className="bg-white/5 border-white/10 text-sm h-20"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-xs uppercase tracking-wider text-slate-500 font-bold">Contact Email</label>
                  <Input 
                    value={content.contactEmail || ""}
                    onChange={(e) => setContent({...content, contactEmail: e.target.value})}
                    className="bg-white/5 border-white/10 text-sm"
                  />
                </div>

                <div className="rounded-xl border border-white/5 bg-white/5 p-4">
                  <p className="text-xs font-semibold text-slate-400 mb-2">Complex Fields</p>
                  <p className="text-[10px] text-slate-500 italic mb-3">Agenda and FAQs are best managed via the AI tab or the full event editor.</p>
                  <div className="flex gap-2">
                    <Pill tone="bg-blue-500/10 text-blue-400 border border-blue-500/20">{content.agenda?.length || 0} Agenda items</Pill>
                    <Pill tone="bg-purple-500/10 text-purple-400 border border-purple-500/20">{content.faqs?.length || 0} FAQs</Pill>
                  </div>
                </div>
                {/* More content fields can be added here */}
                <p className="text-[10px] text-slate-600 italic">Tip: Use the AI tab to generate complex fields like Agendas and FAQs automatically.</p>
              </div>
            )}
          </div>
        </aside>

        {/* Right Content - Live Preview */}
        <main className={`relative flex-1 bg-[#050505] transition-all ${isPreviewExpanded ? "p-0" : "p-8"}`}>
          <div className={`relative mx-auto flex h-full flex-col overflow-hidden rounded-[32px] border border-white/10 bg-black shadow-2xl transition-all ${isPreviewExpanded ? "max-w-none rounded-none border-0" : "max-w-5xl"}`}>
            {/* Browser Header Emulation */}
            <div className="flex h-12 items-center justify-between bg-[#151515] px-4 border-b border-white/5">
              <div className="flex items-center gap-6">
                 <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/50" />
                  <div className="h-3 w-3 rounded-full bg-yellow-500/50" />
                  <div className="h-3 w-3 rounded-full bg-green-500/50" />
                </div>
                <div className="rounded-full bg-white/5 px-4 py-1 flex items-center gap-2">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                  <span className="text-[10px] font-mono text-slate-400">unisync.app/events/{event.slug}</span>
                </div>
              </div>
              <button 
                onClick={() => setIsPreviewExpanded(!isPreviewExpanded)}
                className="rounded-lg p-2 hover:bg-white/10 text-slate-400"
              >
                {isPreviewExpanded ? <Minimize2 className="h-4 w-4" /> : <Maximize2 className="h-4 w-4" />}
              </button>
            </div>

            {/* Preview Iframe */}
            <div className="flex-1 bg-[#080607] overflow-hidden">
               <iframe 
                src={`/events/${event.slug}?preview=true&themeColor=${encodeURIComponent(visuals.themeColor)}&font=${visuals.fontFamily}&layout=${visuals.layoutVariant}`}
                className="h-full w-full"
                style={{ border: 'none' }}
               />
            </div>
            
            {/* Floating Banner */}
            {!isPreviewExpanded && (
              <div className="absolute bottom-6 left-1/2 -translate-x-1/2 flex items-center gap-3 bg-black/80 backdrop-blur-xl border border-white/10 rounded-full px-5 py-2.5 text-xs text-white/60">
                <div className="flex items-center gap-1.5">
                  <div className="h-1.5 w-1.5 rounded-full bg-orange-500" />
                  <span>Interactive Preview Mode</span>
                </div>
                <div className="w-px h-3 bg-white/10" />
                <span>Changes reflect live here</span>
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
}
