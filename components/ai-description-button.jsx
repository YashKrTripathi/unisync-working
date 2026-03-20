"use client";

import { useState } from "react";
import { Loader2, Sparkles } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

export default function AIDescriptionButton({ description, onApply, className = "" }) {
  const [isLoading, setIsLoading] = useState(false);

  const handleBeautify = async () => {
    if (!description?.trim()) {
      toast.error("Write a short description first.");
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch("/api/generate-event", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          task: "polishDescription",
          prompt: description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data?.error || "Failed to beautify description");
      }

      if (!data?.description) {
        throw new Error("No description returned");
      }

      onApply(data.description);
      toast.success("Description polished with AI.");
    } catch (error) {
      toast.error(error.message || "Failed to beautify description");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      type="button"
      variant="outline"
      onClick={handleBeautify}
      disabled={isLoading}
      className={`gap-2 border-white/15 bg-white/5 text-white hover:bg-white/10 ${className}`.trim()}
    >
      {isLoading ? (
        <>
          <Loader2 className="h-4 w-4 animate-spin" />
          Beautifying...
        </>
      ) : (
        <>
          <Sparkles className="h-4 w-4" />
          Beautify with AI
        </>
      )}
    </Button>
  );
}
