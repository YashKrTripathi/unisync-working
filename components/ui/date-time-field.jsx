"use client";

import { useMemo, useState } from "react";
import { useEffect } from "react";
import { format } from "date-fns";
import { CalendarIcon, Clock3 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

const HOURS_12 = [12, ...Array.from({ length: 11 }, (_, i) => i + 1)]; // 12,1..11
const MINUTES = Array.from({ length: 12 }, (_, index) => index * 5);

function polarPosition(index, total, radius) {
  const angle = (index / total) * Math.PI * 2 - Math.PI / 2;
  return {
    left: `calc(50% + ${Math.cos(angle) * radius}px)`,
    top: `calc(50% + ${Math.sin(angle) * radius}px)`,
  };
}

function to12Hour(hour24) {
  const period = hour24 >= 12 ? "PM" : "AM";
  const hour12 = hour24 % 12 === 0 ? 12 : hour24 % 12;
  return { hour12, period };
}

function to24Hour(hour12, period) {
  const base = hour12 % 12;
  return period === "PM" ? base + 12 : base === 12 ? 0 : base;
}

function TimeClockPicker({ value, step, onStepChange, onPreview, onComplete }) {
  const parsed = useMemo(() => {
    if (!value || !/^\d{2}:\d{2}$/.test(value)) {
      return { hour24: null, minute: null, period: "AM", hour12: null };
    }
    const [hour, minute] = value.split(":").map(Number);
    const { hour12, period } = to12Hour(hour);
    return { hour24: hour, minute, hour12, period };
  }, [value]);

  const [period, setPeriod] = useState(parsed.period || "AM");

  useEffect(() => {
    if (parsed.period && parsed.period !== period) {
      setPeriod(parsed.period);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [parsed.period]);

  const selectHour = (hour12) => {
    const hour24 = to24Hour(hour12, period);
    const minute = parsed.minute ?? 0;
    onPreview(`${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
    onStepChange("minute");
  };

  const selectMinute = (minute) => {
    const hour24 = parsed.hour24 ?? to24Hour(12, period);
    onComplete(`${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
  };

  const activeValue = step === "hour" ? parsed.hour12 : parsed.minute;
  const items = step === "hour" ? HOURS_12 : MINUTES;
  const radius = step === "hour" ? 108 : 96;

  const formatted = parsed.hour24 !== null && parsed.minute !== null
    ? (() => {
        const { hour12, period: p } = to12Hour(parsed.hour24);
        return `${String(hour12).padStart(2, "0")}:${String(parsed.minute).padStart(2, "0")} ${p}`;
      })()
    : "--:--";

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-white">
        <div>
          <p className="text-[11px] uppercase tracking-[0.24em] text-white/45">Selected Time</p>
          <p className="mt-1 text-2xl font-semibold tracking-[0.08em]">{formatted}</p>
        </div>
        <div className="flex gap-2">
          <Button
            type="button"
            variant={step === "hour" ? "default" : "outline"}
            className="h-8 px-3 text-xs"
            onClick={() => onStepChange("hour")}
          >
            Hour
          </Button>
          <Button
            type="button"
            variant={step === "minute" ? "default" : "outline"}
            className="h-8 px-3 text-xs"
            onClick={() => onStepChange("minute")}
            disabled={parsed.hour24 === null}
          >
            Minute
          </Button>
          <div className="flex rounded-full border border-white/12 bg-white/5 text-xs font-semibold">
            {["AM", "PM"].map((p) => (
              <button
                key={p}
                type="button"
                className={`px-3 py-1 transition-colors ${period === p ? "bg-white text-black" : "text-white/70"}`}
                onClick={() => {
                  setPeriod(p);
                  if (parsed.hour12 !== null) {
                    const hour24 = to24Hour(parsed.hour12, p);
                    const minute = parsed.minute ?? 0;
                    onPreview(`${String(hour24).padStart(2, "0")}:${String(minute).padStart(2, "0")}`);
                  }
                }}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex justify-center">
        <div className="relative h-[260px] w-[260px] rounded-full border border-white/12 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.12)_0%,rgba(255,255,255,0.02)_42%,rgba(255,255,255,0.01)_100%)] shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
          <div className="absolute left-1/2 top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white/80" />
          {items.map((item, index) => {
            const position = polarPosition(index, items.length, radius);
            const selected = activeValue === item;

            return (
              <button
                key={`${step}-${item}`}
                type="button"
                className={`absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 rounded-full text-sm font-medium transition-all ${
                  selected
                    ? "bg-white text-black shadow-[0_8px_24px_rgba(255,255,255,0.28)]"
                    : "bg-white/6 text-white hover:bg-white/14"
                }`}
                style={position}
                onClick={() => (step === "hour" ? selectHour(item) : selectMinute(item))}
              >
                {String(item).padStart(2, "0")}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function DateTimeField({
  date,
  time,
  onDateChange,
  onTimeChange,
  datePlaceholder = "Pick date",
  timePlaceholder = "Pick time",
  disabledDates,
}) {
  const [dateOpen, setDateOpen] = useState(false);
  const [timeOpen, setTimeOpen] = useState(false);
  const [timeStep, setTimeStep] = useState("hour");

  return (
    <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
      <Popover open={dateOpen} onOpenChange={setDateOpen}>
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between bg-white/5 border-white/10 text-white">
            {date ? format(date, "PPP") : datePlaceholder}
            <CalendarIcon className="w-4 h-4 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0">
          <Calendar
            mode="single"
            selected={date}
            onSelect={(nextDate) => {
              onDateChange(nextDate);
              if (nextDate) {
                setDateOpen(false);
                setTimeStep("hour");
                setTimeOpen(true);
              }
            }}
            disabled={disabledDates}
          />
        </PopoverContent>
      </Popover>

      <Popover
        open={timeOpen}
        onOpenChange={(nextOpen) => {
          setTimeOpen(nextOpen);
          if (nextOpen) {
            setTimeStep("hour");
          }
        }}
      >
        <PopoverTrigger asChild>
          <Button variant="outline" className="w-full justify-between bg-white/5 border-white/10 text-white sm:min-w-[120px]">
            {time || timePlaceholder}
            <Clock3 className="w-4 h-4 opacity-60" />
          </Button>
        </PopoverTrigger>
        <PopoverContent
          align="start"
          side="bottom"
          sideOffset={8}
          className="w-[min(360px,calc(100vw-1.5rem))] max-w-[360px] border-white/10 bg-[#101827]/96 p-4 text-white"
        >
          <TimeClockPicker
            value={time}
            step={timeStep}
            onStepChange={setTimeStep}
            onPreview={onTimeChange}
            onComplete={(nextTime) => {
              onTimeChange(nextTime);
              setTimeOpen(false);
            }}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
}
