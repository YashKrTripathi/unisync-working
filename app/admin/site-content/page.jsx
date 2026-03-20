"use client";

import React, { useMemo, useState, useCallback } from "react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import {
  Globe, Save, Check, AlertCircle, ChevronDown, ChevronUp,
  Plus, Trash2, GripVertical, Home, MapPin, HelpCircle,
  Handshake, Phone, BarChart3, Sparkles,
} from "lucide-react";
import { DEFAULT_CONTACT_MAIL_TEMPLATES } from "@/lib/contact-mail-templates";

// ─── Default content shapes for each page ───
const PAGE_CONFIGS = [
  {
    pageId: "home_hero",
    label: "Home — Hero Section",
    icon: Home,
    description: "University name, badge text, tagline, and hero stats",
    defaultContent: {
      badge: "Official Portal",
      headingLines: ["D Y Patil", "International", "University"],
      tagline: "The Pulse of Campus Life. Centralizing event coordination, venue booking, and student engagement in one seamless ecosystem.",
      stats: [
        { value: "45+", label: "Active Clubs" },
        { value: "200+", label: "Annual Events" },
        { value: "12k+", label: "Students" },
      ],
    },
  },
  {
    pageId: "home_statistics",
    label: "Home — Statistics Section",
    icon: BarChart3,
    description: "Impact section heading, subheading, and stat counters",
    defaultContent: {
      sectionHeading: "IMPACT",
      sectionSubheading: "Numbers speak louder than words. Discover how our platform is uniting the entire campus ecosystem.",
      stats: [
        { value: 120, suffix: "+", label: "EVENTS HOSTED" },
        { value: 12450, suffix: "+", label: "ACTIVE STUDENTS" },
        { value: 12, suffix: "", label: "DEPARTMENTS" },
        { value: 95, suffix: "%", label: "ENGAGEMENT RATE" },
      ],
    },
  },
  {
    pageId: "home_features",
    label: "Home — Features Section",
    icon: Sparkles,
    description: "Feature cards with titles, descriptions, and icons",
    defaultContent: {
      sectionHeading: "EXPERIENCE",
      sectionSubheading: "MORE",
      sectionDescription: "A seamless ecosystem designed to make every event an absolute success.",
      features: [
        { icon: "Search", title: "DISCOVER", description: "Browse and search for upcoming campus events effortlessly." },
        { icon: "CalendarPlus", title: "ORGANIZE", description: "Create and manage events with an intuitive dashboard." },
        { icon: "QrCode", title: "ATTEND", description: "Mark attendance instantly with simple QR code scanning." },
        { icon: "BarChart3", title: "ANALYZE", description: "Generate comprehensive reports and real-time analytics." },
      ],
    },
  },
  {
    pageId: "faq",
    label: "FAQ Page",
    icon: HelpCircle,
    description: "Frequently asked questions and answers",
    defaultContent: {
      heading: { prefix: "FREQ ", middle: "ASKED ", suffix: "QUES" },
      subtitle: "Everything you need to know about UNISYNC.",
      faqs: [
        { q: "WHEN WILL THE TICKETS GO ON SALE?", a: "Early bird tickets will go live strictly 14 days prior to the festival date." },
        { q: "WHAT IS THE MINIMUM AGE REQUIRED TO ENTER?", a: "UNISYNC is strictly an 18+ event." },
        { q: "CAN I REFUND MY TICKET IF I CANNOT ATTEND?", a: "All purchased tickets are strictly non-refundable." },
        { q: "IS RE-ENTRY ALLOWED?", a: "No, once you leave the festival venue, your ticket/wristband becomes void." },
        { q: "WHAT PAYMENT METHODS ARE ACCEPTED INSIDE?", a: "UNISYNC is a completely cashless campus experience." },
      ],
    },
  },
  {
    pageId: "location",
    label: "Location Page",
    icon: MapPin,
    description: "Venue location, directions, and transportation options",
    defaultContent: {
      heading: { prefix: "THE ", highlight: "LOCATION" },
      subtitle: "How to get to the festival grounds in Pune.",
      mapLabel: "Interactive Map",
      directions: [
        { icon: "Plane", title: "By Air", description: "Fly into Pune International Airport (PNQ)." },
        { icon: "Train", title: "By Train", description: "Akurdi Railway Station is right across the street." },
        { icon: "Car", title: "By Car", description: "Take the Pune-Mumbai Expressway." },
      ],
    },
  },
  {
    pageId: "partners",
    label: "Partners Page",
    icon: Handshake,
    description: "Sponsor tiers and brand names",
    defaultContent: {
      heading: { prefix: "OUR ", highlight: "PARTNERS" },
      subtitle: "The brands making the UNISYNC experience unforgettable.",
      tiers: [
        { tierName: "Headline Sponsors", brands: ["BRAND A", "BRAND B", "BRAND C", "BRAND D"], cols: 4, height: "h-40" },
        { tierName: "Official Partners", brands: ["Partner 1", "Partner 2", "Partner 3", "Partner 4", "Partner 5", "Partner 6"], cols: 6, height: "h-24" },
      ],
    },
  },
  {
    pageId: "contact",
    label: "Contact Us Page",
    icon: Phone,
    description: "Contact info, support hours, and page copy",
    defaultContent: {
      cards: [
        { title: "General Support", detail: "rigved.aherrao.26@gmail.com", icon: "Mail", accent: "from-[#ff4d9b]/35 to-[#ff7a18]/20" },
        { title: "Hotline", detail: "+91 1234567890", icon: "PhoneCall", accent: "from-[#46e6ff]/30 to-[#4f46e5]/20" },
        { title: "Swagat Plaza", detail: "DYPIU Event Hub, Akurdi, Pune", icon: "MapPin", accent: "from-[#a3ff5a]/25 to-[#facc15]/20" },
      ],
      hero: {
        badge: "Contact Experience",
        heading: "Reach out for support, partnerships, or a direct conversation",
        description: "This page is for regular queries, support requests, partnerships, and general outreach.",
      },
      support: {
        responseEta: "Under 6 hours",
        partnershipHours: "Mon - Sat, 10:00 AM to 7:00 PM",
        priorityTip: "Include your event date + expected footfall",
        pitchNote: "Use the dedicated pitch intake instead of the regular contact form.",
      },
    },
  },
  {
    pageId: "contact_mail_templates",
    label: "Contact Mail Templates",
    icon: Phone,
    description: "Edit the subject lines and email copy used by the contact form relay. Available tokens: {{name}}, {{email}}, {{topic}}, {{message}}, {{submittedAt}}, {{source}}",
    defaultContent: DEFAULT_CONTACT_MAIL_TEMPLATES,
  },
];

// ─── Generic JSON editor for a single section ───
function SectionEditor({ config, savedContent, onSave, isSaving }) {
  const [isOpen, setIsOpen] = useState(false);
  const initialContent = useMemo(
    () => JSON.parse(JSON.stringify(savedContent || config.defaultContent)),
    [savedContent, config.defaultContent]
  );
  const [content, setContent] = useState(initialContent);
  const [jsonMode, setJsonMode] = useState(false);
  const [jsonText, setJsonText] = useState(() =>
    JSON.stringify(initialContent, null, 2)
  );
  const [jsonError, setJsonError] = useState("");
  const [saved, setSaved] = useState(false);

  const handleSave = useCallback(() => {
    let toSave = content;
    if (jsonMode) {
      try {
        toSave = JSON.parse(jsonText);
        setJsonError("");
        setContent(toSave);
      } catch (e) {
        setJsonError("Invalid JSON: " + e.message);
        return;
      }
    }
    onSave(config.pageId, toSave);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  }, [content, jsonMode, jsonText, config.pageId, onSave]);

  const handleReset = () => {
    const defaults = JSON.parse(JSON.stringify(config.defaultContent));
    setContent(defaults);
    setJsonText(JSON.stringify(defaults, null, 2));
  };

  if (!content) return null;

  const Icon = config.icon;

  return (
    <div className="border border-white/10 rounded-2xl bg-[#1a1a1a] overflow-hidden">
      {/* Header */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-5 hover:bg-white/[0.03] transition-colors text-left"
      >
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <Icon className="w-5 h-5 text-white/70" />
          </div>
          <div>
            <h3 className="text-[15px] font-semibold text-white">{config.label}</h3>
            <p className="text-xs text-gray-500 mt-0.5">{config.description}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          {savedContent && (
            <span className="text-[10px] font-semibold uppercase tracking-wider text-emerald-400/80 bg-emerald-400/10 px-2 py-1 rounded-full">
              Customized
            </span>
          )}
          {isOpen ? <ChevronUp className="w-4 h-4 text-gray-500" /> : <ChevronDown className="w-4 h-4 text-gray-500" />}
        </div>
      </button>

      {/* Body */}
      {isOpen && (
        <div className="border-t border-white/[0.06] p-5 space-y-5">
          {/* Mode toggle */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setJsonMode(false); setJsonError(""); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${!jsonMode ? "bg-white/15 text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              Visual Editor
            </button>
            <button
              onClick={() => { setJsonMode(true); setJsonText(JSON.stringify(content, null, 2)); }}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${jsonMode ? "bg-white/15 text-white" : "text-gray-500 hover:text-gray-300"}`}
            >
              JSON Editor
            </button>
          </div>

          {jsonMode ? (
            <div className="space-y-2">
              <textarea
                value={jsonText}
                onChange={(e) => { setJsonText(e.target.value); setJsonError(""); }}
                className="w-full h-80 bg-[#111] border border-white/10 rounded-xl p-4 text-sm font-mono text-green-300 focus:outline-none focus:ring-1 focus:ring-white/20 resize-y"
                spellCheck={false}
              />
              {jsonError && (
                <p className="text-xs text-red-400 flex items-center gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5" /> {jsonError}
                </p>
              )}
            </div>
          ) : (
            <VisualEditor content={content} setContent={setContent} pageId={config.pageId} />
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2 border-t border-white/[0.06]">
            <button
              onClick={handleSave}
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-white text-black text-sm font-bold hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              {saved ? <Check className="w-4 h-4" /> : <Save className="w-4 h-4" />}
              {saved ? "Saved!" : isSaving ? "Saving..." : "Save Changes"}
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2.5 rounded-xl border border-white/10 text-sm text-gray-400 hover:text-white hover:border-white/20 transition-colors"
            >
              Reset to Default
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Visual editor renders smart form fields based on content shape ───
function VisualEditor({ content, setContent, pageId }) {
  const updateField = (path, value) => {
    setContent((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = next;
      for (let i = 0; i < keys.length - 1; i++) {
        const key = isNaN(keys[i]) ? keys[i] : parseInt(keys[i]);
        obj = obj[key];
      }
      const lastKey = isNaN(keys[keys.length - 1]) ? keys[keys.length - 1] : parseInt(keys[keys.length - 1]);
      obj[lastKey] = value;
      return next;
    });
  };

  const addArrayItem = (path, template) => {
    setContent((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = next;
      for (const key of keys) {
        obj = obj[isNaN(key) ? key : parseInt(key)];
      }
      obj.push(JSON.parse(JSON.stringify(template)));
      return next;
    });
  };

  const removeArrayItem = (path, index) => {
    setContent((prev) => {
      const next = JSON.parse(JSON.stringify(prev));
      const keys = path.split(".");
      let obj = next;
      for (const key of keys) {
        obj = obj[isNaN(key) ? key : parseInt(key)];
      }
      obj.splice(index, 1);
      return next;
    });
  };

  return (
    <div className="space-y-4">
      {Object.entries(content).map(([key, value]) => {
        if (typeof value === "string" || typeof value === "number") {
          return (
            <FieldInput
              key={key}
              label={formatLabel(key)}
              value={value}
              onChange={(v) => updateField(key, typeof value === "number" ? Number(v) || 0 : v)}
              type={typeof value === "number" ? "number" : key.length > 60 ? "textarea" : "text"}
            />
          );
        }
        if (Array.isArray(value) && typeof value[0] === "string") {
          return (
            <div key={key} className="space-y-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{formatLabel(key)}</label>
              {value.map((item, i) => (
                <div key={i} className="flex gap-2">
                  <input
                    value={item}
                    onChange={(e) => updateField(`${key}.${i}`, e.target.value)}
                    className="flex-1 bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                  />
                  <button
                    onClick={() => removeArrayItem(key, i)}
                    className="p-2 text-gray-600 hover:text-red-400 transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
              <button
                onClick={() => addArrayItem(key, "")}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors"
              >
                <Plus className="w-3 h-3" /> Add item
              </button>
            </div>
          );
        }
        if (Array.isArray(value) && typeof value[0] === "object") {
          const template = value[0];
          return (
            <div key={key} className="space-y-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{formatLabel(key)}</label>
              {value.map((item, i) => (
                <div key={i} className="border border-white/[0.06] rounded-xl p-4 bg-[#111] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500 font-medium flex items-center gap-1.5">
                      <GripVertical className="w-3 h-3" /> Item {i + 1}
                    </span>
                    <button
                      onClick={() => removeArrayItem(key, i)}
                      className="p-1 text-gray-600 hover:text-red-400 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  {Object.entries(item).map(([subKey, subVal]) => {
                    if (typeof subVal === "string" || typeof subVal === "number") {
                      return (
                        <FieldInput
                          key={subKey}
                          label={formatLabel(subKey)}
                          value={subVal}
                          onChange={(v) => updateField(`${key}.${i}.${subKey}`, typeof subVal === "number" ? Number(v) || 0 : v)}
                          type={typeof subVal === "number" ? "number" : subVal.length > 80 ? "textarea" : "text"}
                        />
                      );
                    }
                    if (Array.isArray(subVal) && typeof subVal[0] === "string") {
                      return (
                        <div key={subKey} className="space-y-2">
                          <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{formatLabel(subKey)}</label>
                          {subVal.map((s, si) => (
                            <div key={si} className="flex gap-2">
                              <input
                                value={s}
                                onChange={(e) => updateField(`${key}.${i}.${subKey}.${si}`, e.target.value)}
                                className="flex-1 bg-[#0c0c0c] border border-white/8 rounded-lg px-3 py-1.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20"
                              />
                              <button
                                onClick={() => removeArrayItem(`${key}.${i}.${subKey}`, si)}
                                className="p-1 text-gray-600 hover:text-red-400 transition-colors"
                              >
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => addArrayItem(`${key}.${i}.${subKey}`, "")}
                            className="flex items-center gap-1 text-[10px] text-gray-500 hover:text-white transition-colors"
                          >
                            <Plus className="w-3 h-3" /> Add
                          </button>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              ))}
              <button
                onClick={() => addArrayItem(key, template)}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-white transition-colors mt-2"
              >
                <Plus className="w-3.5 h-3.5" /> Add {formatLabel(key).slice(0, -1) || "item"}
              </button>
            </div>
          );
        }
        if (typeof value === "object" && value !== null && !Array.isArray(value)) {
          return (
            <div key={key} className="border border-white/[0.06] rounded-xl p-4 bg-[#111] space-y-3">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{formatLabel(key)}</label>
              {Object.entries(value).map(([subKey, subVal]) => (
                <FieldInput
                  key={subKey}
                  label={formatLabel(subKey)}
                  value={subVal}
                  onChange={(v) => updateField(`${key}.${subKey}`, v)}
                  type={String(subVal).length > 80 ? "textarea" : "text"}
                />
              ))}
            </div>
          );
        }
        return null;
      })}
    </div>
  );
}

// ─── Reusable field input ───
function FieldInput({ label, value, onChange, type = "text" }) {
  return (
    <div className="space-y-1.5">
      <label className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">{label}</label>
      {type === "textarea" ? (
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          rows={3}
          className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20 resize-y"
        />
      ) : (
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-[#111] border border-white/10 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:ring-1 focus:ring-white/20"
        />
      )}
    </div>
  );
}

function formatLabel(key) {
  return key
    .replace(/([A-Z])/g, " $1")
    .replace(/[_-]/g, " ")
    .replace(/^\w/, (c) => c.toUpperCase())
    .trim();
}

// ─── Main Page ───
export default function SiteContentPage() {
  const adminCheck = useQuery(api.admin.isAdmin);
  const allContent = useQuery(api.siteContent.getAllContent);
  const updateContent = useMutation(api.siteContent.updatePageContent);
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = useCallback(async (pageId, content) => {
    setIsSaving(true);
    try {
      await updateContent({
        pageId,
        content: JSON.stringify(content),
      });
    } catch (err) {
      console.error("Failed to save:", err);
      alert("Failed to save: " + err.message);
    }
    setIsSaving(false);
  }, [updateContent]);

  // Build lookup of saved content
  const savedContentMap = {};
  if (allContent) {
    for (const doc of allContent) {
      savedContentMap[doc.pageId] = doc.parsedContent;
    }
  }

  if (!adminCheck?.isSuperAdmin) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-red-400 mx-auto" />
          <h2 className="text-xl font-semibold text-white">Access Denied</h2>
          <p className="text-gray-500 text-sm">Only Superadmin and Owner can edit site content.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-10">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500/20 to-purple-500/20 border border-white/10 flex items-center justify-center">
            <Globe className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Site Content</h1>
            <p className="text-sm text-gray-500">Edit all public page content from one place. Changes are live instantly.</p>
          </div>
        </div>
      </div>

      {/* Section Editors */}
      <div className="space-y-4">
        {PAGE_CONFIGS.map((config) => (
          <SectionEditor
            key={`${config.pageId}:${JSON.stringify(savedContentMap[config.pageId] || config.defaultContent)}`}
            config={config}
            savedContent={savedContentMap[config.pageId]}
            onSave={handleSave}
            isSaving={isSaving}
          />
        ))}
      </div>
    </div>
  );
}
