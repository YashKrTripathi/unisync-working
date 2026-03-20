"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { Search, Loader2, Upload, ImagePlus } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function UnsplashImagePicker({ isOpen, onClose, onSelect }) {
  const [query, setQuery] = useState("event");
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [activeMode, setActiveMode] = useState("upload");
  const [uploadError, setUploadError] = useState("");
  const fileInputRef = useRef(null);

  const searchImages = async (searchQuery) => {
    setLoading(true);
    try {
      const response = await fetch(
        `https://api.unsplash.com/search/photos?query=${searchQuery}&per_page=12&client_id=${process.env.NEXT_PUBLIC_UNSPLASH_ACCESS_KEY}`
      );
      const data = await response.json();
      setImages(data.results || []);
    } catch (error) {
      console.error("Error fetching images:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    searchImages(query);
  };

  const handleUploadClick = () => {
    setUploadError("");
    fileInputRef.current?.click();
  };

  const handleFileChange = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setUploadError("Please choose an image file.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") {
        onSelect(reader.result);
      }
    };
    reader.onerror = () => {
      setUploadError("Could not read that image. Please try another file.");
    };
    reader.readAsDataURL(file);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Choose Cover Image</DialogTitle>
          <DialogDescription>
            Upload your own cover image or search Unsplash for one to use on the event page.
          </DialogDescription>
        </DialogHeader>

        <div className="flex gap-2">
          <Button
            type="button"
            variant={activeMode === "upload" ? "default" : "outline"}
            onClick={() => setActiveMode("upload")}
            className="gap-2"
          >
            <Upload className="w-4 h-4" />
            Upload
          </Button>
          <Button
            type="button"
            variant={activeMode === "search" ? "default" : "outline"}
            onClick={() => setActiveMode("search")}
            className="gap-2"
          >
            <Search className="w-4 h-4" />
            Unsplash
          </Button>
        </div>

        {activeMode === "search" ? (
          <form onSubmit={handleSearch} className="flex gap-2">
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for images..."
              className="flex-1"
            />
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Search className="w-4 h-4" />
              )}
            </Button>
          </form>
        ) : null}

        <div className="overflow-y-auto flex-1 -mx-6 px-6">
          {activeMode === "upload" ? (
            <div className="flex h-full min-h-64 items-center justify-center py-6">
              <div className="w-full max-w-xl rounded-2xl border border-dashed border-white/15 bg-white/5 p-8 text-center">
                <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white/8">
                  <ImagePlus className="h-8 w-8 text-white/80" />
                </div>
                <h3 className="text-lg font-semibold text-white">Upload a cover image</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Choose an image from your device. It will be used as the event cover.
                </p>
                <Button type="button" className="mt-6 gap-2" onClick={handleUploadClick}>
                  <Upload className="w-4 h-4" />
                  Choose Image
                </Button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleFileChange}
                />
                {uploadError ? (
                  <p className="mt-3 text-sm text-red-400">{uploadError}</p>
                ) : null}
              </div>
            </div>
          ) : (
            <>
              {loading ? (
                <div className="flex items-center justify-center h-64">
                  <Loader2 className="w-8 h-8 animate-spin text-purple-500" />
                </div>
              ) : (
                <div className="grid grid-cols-3 gap-4 py-4">
                  {images.map((image) => (
                    <button
                      key={image.id}
                      type="button"
                      onClick={() => onSelect(image.urls.regular)}
                      className="relative aspect-video overflow-hidden rounded-lg border-2 border-transparent hover:border-purple-500 transition-all"
                    >
                      <Image
                        src={image.urls.small}
                        alt={image.description || "Unsplash image"}
                        className="w-full h-full object-cover"
                        width={400}
                        height={300}
                      />
                    </button>
                  ))}
                </div>
              )}

              {!loading && images.length === 0 && (
                <div className="text-center text-muted-foreground py-12">
                  Search for images to get started
                </div>
              )}
            </>
          )}
        </div>

        {activeMode === "search" ? (
          <p className="text-xs text-muted-foreground">
            Photos from{" "}
            <a
              href="https://unsplash.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline"
            >
              Unsplash
            </a>
          </p>
        ) : (
          <p className="text-xs text-muted-foreground">
            Upload from your device or switch to Unsplash search.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}
