"use client";

import { cn } from "@/lib/utils";
import { Calendar, ChevronDown, GitCompareArrows } from "lucide-react";
import { useState } from "react";

const datePresets = [
  "Últimos 7 dias",
  "Últimos 14 dias",
  "Últimos 30 dias",
  "Este mês",
  "Mês anterior",
  "Personalizado",
];

const channels = [
  { id: "meta-ads", label: "Meta Ads", color: "bg-blue-500" },
  { id: "google-ads", label: "Google Ads", color: "bg-yellow-500" },
  { id: "organic", label: "Orgânico", color: "bg-green-500" },
  { id: "direct", label: "Direto", color: "bg-purple-500" },
];

export function GlobalFilter() {
  const [selectedDate, setSelectedDate] = useState("Últimos 30 dias");
  const [comparePrevious, setComparePrevious] = useState(false);
  const [selectedChannels, setSelectedChannels] = useState<string[]>([
    "meta-ads",
    "google-ads",
    "organic",
    "direct",
  ]);
  const [showDateDropdown, setShowDateDropdown] = useState(false);

  const toggleChannel = (id: string) => {
    setSelectedChannels((prev) =>
      prev.includes(id) ? prev.filter((c) => c !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-wrap items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-3.5 shadow-sm">
      {/* Date Selector */}
      <div className="relative">
        <button
          onClick={() => setShowDateDropdown(!showDateDropdown)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3.5 py-2 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-100"
        >
          <Calendar className="h-4 w-4 text-slate-400" />
          {selectedDate}
          <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
        </button>
        {showDateDropdown && (
          <div className="absolute left-0 top-full z-50 mt-1 w-56 rounded-lg border border-slate-200 bg-white py-1 shadow-lg">
            {datePresets.map((preset) => (
              <button
                key={preset}
                onClick={() => {
                  setSelectedDate(preset);
                  setShowDateDropdown(false);
                }}
                className={cn(
                  "block w-full px-4 py-2 text-left text-sm transition-colors",
                  selectedDate === preset
                    ? "bg-indigo-50 font-medium text-indigo-600"
                    : "text-slate-600 hover:bg-slate-50"
                )}
              >
                {preset}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Compare Toggle */}
      <button
        onClick={() => setComparePrevious(!comparePrevious)}
        className={cn(
          "flex items-center gap-2 rounded-lg border px-3.5 py-2 text-sm font-medium transition-colors",
          comparePrevious
            ? "border-indigo-200 bg-indigo-50 text-indigo-600"
            : "border-slate-200 bg-slate-50 text-slate-500 hover:bg-slate-100"
        )}
      >
        <GitCompareArrows className="h-4 w-4" />
        Comparar período anterior
      </button>

      {/* Divider */}
      <div className="h-8 w-px bg-slate-200" />

      {/* Channel Selectors */}
      <div className="flex items-center gap-2">
        <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
          Canais
        </span>
        {channels.map((channel) => (
          <button
            key={channel.id}
            onClick={() => toggleChannel(channel.id)}
            className={cn(
              "flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-medium transition-all",
              selectedChannels.includes(channel.id)
                ? "border-slate-300 bg-white text-slate-700 shadow-sm"
                : "border-transparent bg-slate-100 text-slate-400"
            )}
          >
            <div
              className={cn(
                "h-2 w-2 rounded-full transition-opacity",
                channel.color,
                !selectedChannels.includes(channel.id) && "opacity-30"
              )}
            />
            {channel.label}
          </button>
        ))}
      </div>
    </div>
  );
}
