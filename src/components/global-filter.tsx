"use client";

import { cn } from "@/lib/utils";
import { Calendar } from "lucide-react";
import { useState } from "react";

export type DateRange = "7d" | "15d" | "30d" | "1y" | "custom";

interface GlobalFilterProps {
  selected?: DateRange;
  onDateChange?: (range: DateRange) => void;
}

const quickFilters: { value: DateRange; label: string }[] = [
  { value: "7d", label: "7D" },
  { value: "15d", label: "15D" },
  { value: "30d", label: "30D" },
  { value: "1y", label: "1 Ano" },
];

export function GlobalFilter({ selected = "30d", onDateChange }: GlobalFilterProps) {
  const [activeRange, setActiveRange] = useState<DateRange>(selected);
  const [showCustom, setShowCustom] = useState(false);
  const [startDate, setStartDate] = useState("2026-02-21");
  const [endDate, setEndDate] = useState("2026-03-22");

  const handleSelect = (range: DateRange) => {
    setActiveRange(range);
    setShowCustom(false);
    onDateChange?.(range);
  };

  return (
    <div className="flex items-center gap-2">
      {/* Quick filter buttons */}
      <div className="flex items-center rounded-lg border border-slate-200 bg-white p-1">
        {quickFilters.map((f) => (
          <button
            key={f.value}
            onClick={() => handleSelect(f.value)}
            className={cn(
              "rounded-md px-3 py-1.5 text-xs font-semibold transition-all",
              activeRange === f.value
                ? "bg-slate-900 text-white shadow-sm"
                : "text-slate-500 hover:text-slate-800"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Custom date picker */}
      <div className="relative">
        <button
          onClick={() => { setShowCustom(!showCustom); setActiveRange("custom"); }}
          className={cn(
            "flex items-center gap-2 rounded-lg border px-3 py-1.5 text-xs font-medium transition-all",
            activeRange === "custom"
              ? "border-slate-900 bg-slate-900 text-white"
              : "border-slate-200 bg-white text-slate-500 hover:border-slate-300"
          )}
        >
          <Calendar className="h-3.5 w-3.5" />
          {activeRange === "custom" ? `${startDate} — ${endDate}` : "Personalizado"}
        </button>

        {showCustom && (
          <div className="absolute left-0 top-full z-50 mt-2 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
            <div className="flex items-center gap-3">
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Início</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
              </div>
              <span className="mt-5 text-slate-300">—</span>
              <div>
                <label className="mb-1 block text-xs font-medium text-slate-500">Fim</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="rounded-lg border border-slate-200 px-3 py-1.5 text-sm text-slate-700 focus:border-indigo-400 focus:outline-none focus:ring-1 focus:ring-indigo-400"
                />
              </div>
              <button
                onClick={() => { handleSelect("custom"); setShowCustom(false); }}
                className="mt-5 rounded-lg bg-slate-900 px-4 py-1.5 text-xs font-semibold text-white hover:bg-slate-800"
              >
                Aplicar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Period comparison badge */}
      <div className="rounded-lg border border-dashed border-slate-200 px-3 py-1.5 text-xs text-slate-400">
        vs período anterior
      </div>
    </div>
  );
}
