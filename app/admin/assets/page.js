"use client";

import React, { useState } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "@/convex/_generated/api";
import { BarLoader } from "react-spinners";
import { format } from "date-fns";
import {
    ImageIcon,
    Plus,
    Trash2,
    LayoutGrid,
    Layers,
    Sparkles,
    X,
    ExternalLink,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

const CATEGORY_CONFIG = {
    hero_slider: { label: "Hero Sliders", icon: Layers, color: "text-blue-400 bg-blue-500/20" },
    event_cover: { label: "Event Covers", icon: ImageIcon, color: "text-blue-400 bg-blue-500/20" },
    logo: { label: "Logos", icon: Sparkles, color: "text-amber-400 bg-amber-500/20" },
    gallery: { label: "Gallery", icon: LayoutGrid, color: "text-green-400 bg-green-500/20" },
};

const CATEGORIES = ["hero_slider", "event_cover", "logo", "gallery"];

function AddAssetModal({ open, onClose }) {
    const createAsset = useMutation(api.assets.createAsset);
    const [form, setForm] = useState({ url: "", title: "", category: "gallery" });
    const [loading, setLoading] = useState(false);

    if (!open) return null;

    async function handleSubmit(e) {
        e.preventDefault();
        if (!form.url.trim() || !form.title.trim()) {
            toast.error("Please fill in URL and title");
            return;
        }
        setLoading(true);
        try {
            await createAsset({
                url: form.url.trim(),
                title: form.title.trim(),
                category: form.category,
            });
            toast.success("Asset added successfully");
            setForm({ url: "", title: "", category: "gallery" });
            onClose();
        } catch (err) {
            toast.error(err.message || "Failed to add asset");
        }
        setLoading(false);
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <div className="bg-[#0c1222] border border-white/[0.06] rounded-2xl w-full max-w-lg">
                <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
                    <h2 className="text-lg font-semibold text-white flex items-center gap-2">
                        <Plus className="w-5 h-5 text-blue-400" />
                        Add Asset
                    </h2>
                    <button onClick={onClose} className="p-1.5 rounded-lg hover:bg-white/[0.06] text-gray-400 hover:text-white transition-colors">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-6 space-y-4">
                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5">Image URL</label>
                        <input
                            type="url"
                            value={form.url}
                            onChange={(e) => setForm((f) => ({ ...f, url: e.target.value }))}
                            placeholder="https://images.unsplash.com/..."
                            className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5">Title</label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm((f) => ({ ...f, title: e.target.value }))}
                            placeholder="Asset title..."
                            className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5">Category</label>
                        <select
                            value={form.category}
                            onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
                            className="w-full bg-white/[0.06] border border-white/[0.08] rounded-lg px-4 py-2.5 text-sm text-white focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                            {CATEGORIES.map((cat) => (
                                <option key={cat} value={cat}>{CATEGORY_CONFIG[cat].label}</option>
                            ))}
                        </select>
                    </div>

                    {form.url && (
                        <div>
                            <label className="block text-xs text-gray-400 uppercase tracking-wider font-medium mb-1.5">Preview</label>
                            <div className="rounded-lg overflow-hidden border border-white/[0.08] h-40 bg-white/[0.06] flex items-center justify-center">
                                <img
                                    src={form.url}
                                    alt="Preview"
                                    className="w-full h-full object-cover"
                                    onError={(e) => { e.target.style.display = "none"; }}
                                />
                            </div>
                        </div>
                    )}

                    <div className="flex items-center justify-end gap-3 pt-2">
                        <Button type="button" variant="ghost" onClick={onClose} className="text-gray-400">Cancel</Button>
                        <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700 text-white">
                            {loading ? "Adding..." : "Add Asset"}
                        </Button>
                    </div>
                </form>
            </div>
        </div>
    );
}

export default function AssetsAdminPage() {
    const adminCheck = useQuery(api.admin.isAdmin);
    const isAdmin = adminCheck?.canAccessAdminPanel === true;
    const [activeCategory, setActiveCategory] = useState(null);
    const assets = useQuery(
        api.assets.getAssets,
        isAdmin ? (activeCategory ? { category: activeCategory } : {}) : "skip"
    );
    const deleteAsset = useMutation(api.assets.deleteAsset);

    const [modalOpen, setModalOpen] = useState(false);
    const [deleteLoading, setDeleteLoading] = useState(null);

    async function handleDelete(id) {
        if (!confirm("Delete this asset?")) return;
        setDeleteLoading(id);
        try {
            await deleteAsset({ assetId: id });
            toast.success("Asset deleted");
        } catch (err) {
            toast.error(err.message || "Failed to delete");
        }
        setDeleteLoading(null);
    }

    if (assets === undefined) {
        return (
            <div>
                <h1 className="text-2xl font-bold text-white mb-2">Assets</h1>
                <p className="text-gray-400 text-sm mb-8">Manage hero sliders, logos, gallery, and media files</p>
                <div className="flex justify-center py-20">
                    <BarLoader width={200} color="#0288D1" />
                </div>
            </div>
        );
    }

    return (
        <div>
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white">Assets</h1>
                    <p className="text-gray-400 text-sm mt-1">Manage hero sliders, logos, gallery, and media files</p>
                </div>
                <Button onClick={() => setModalOpen(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Asset
                </Button>
            </div>

            {/* Category tabs */}
            <div className="flex gap-1 bg-white/[0.03] border border-white/[0.06] rounded-xl p-1 mb-6 w-fit flex-wrap">
                <button
                    onClick={() => setActiveCategory(null)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${!activeCategory
                        ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                        : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.06]"
                    }`}
                >
                    All
                </button>
                {CATEGORIES.map((cat) => {
                    const cfg = CATEGORY_CONFIG[cat];
                    return (
                        <button
                            key={cat}
                            onClick={() => setActiveCategory(cat)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeCategory === cat
                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/20"
                                : "text-gray-400 hover:text-gray-200 hover:bg-white/[0.06]"
                            }`}
                        >
                            <cfg.icon className="w-4 h-4" />
                            {cfg.label}
                        </button>
                    );
                })}
            </div>

            <p className="text-gray-500 text-xs mb-3">
                {assets.length} asset{assets.length !== 1 ? "s" : ""}
            </p>

            {/* Assets grid */}
            {assets.length === 0 ? (
                <div className="bg-white/[0.03] border border-white/[0.06] rounded-xl p-12 text-center">
                    <ImageIcon className="w-10 h-10 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-500">No assets found</p>
                    <p className="text-gray-600 text-sm mt-1">Add images from Unsplash or external URLs</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {assets.map((asset) => {
                        const catCfg = CATEGORY_CONFIG[asset.category] || CATEGORY_CONFIG.gallery;
                        const CatIcon = catCfg.icon;

                        return (
                            <div
                                key={asset._id}
                                className="bg-white/[0.03] border border-white/[0.06] rounded-xl overflow-hidden hover:border-white/[0.12] transition-colors group"
                            >
                                <div className="relative h-40 bg-white/[0.06] flex items-center justify-center">
                                    <img
                                        src={asset.url}
                                        alt={asset.title}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            e.target.style.display = "none";
                                        }}
                                    />
                                    <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <a
                                            href={asset.url}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="p-1.5 rounded-lg bg-black/60 text-gray-300 hover:text-white transition-colors"
                                        >
                                            <ExternalLink className="w-3.5 h-3.5" />
                                        </a>
                                        <button
                                            onClick={() => handleDelete(asset._id)}
                                            disabled={deleteLoading === asset._id}
                                            className="p-1.5 rounded-lg bg-black/60 text-red-400 hover:text-red-300 transition-colors disabled:opacity-50"
                                        >
                                            <Trash2 className="w-3.5 h-3.5" />
                                        </button>
                                    </div>
                                </div>
                                <div className="p-3">
                                    <p className="text-white text-sm font-medium truncate">{asset.title}</p>
                                    <div className="flex items-center justify-between mt-2">
                                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${catCfg.color}`}>
                                            <CatIcon className="w-3 h-3" />
                                            {catCfg.label}
                                        </span>
                                        <span className="text-gray-600 text-xs">
                                            {format(new Date(asset.createdAt), "MMM d")}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}

            <AddAssetModal open={modalOpen} onClose={() => setModalOpen(false)} />
        </div>
    );
}
