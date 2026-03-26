"use client";

import { getKPIs } from "@/lib/windsor";
import { cn } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";

export function KPICards() {
  const kpis = getKPIs();

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const change = ((kpi.value - kpi.previousValue) / kpi.previousValue) * 100;
        const isPositive = kpi.format === "percent" ? change < 0 : change >= 0;

        let displayValue: string;
        if (kpi.format === "currency") {
          displayValue = `R$ ${(kpi.value / 1000).toFixed(1)}k`;
        } else if (kpi.format === "percent") {
          displayValue = `${(kpi.value * 100).toFixed(1)}%`;
        } else {
          displayValue = (kpi.value / 1000).toFixed(1) + "k";
        }

        return (
          <div
            key={kpi.label}
            className="rounded-2xl border border-slate-200 bg-white p-4"
          >
            <p className="text-xs font-medium text-slate-400">{kpi.label}</p>
            <p className="mt-1 text-xl font-bold text-slate-900">{displayValue}</p>
            <div className="mt-1 flex items-center gap-1">
              {isPositive ? (
                <ArrowUpRight className="h-3 w-3 text-emerald-500" />
              ) : (
                <ArrowDownRight className="h-3 w-3 text-red-500" />
              )}
              <span className={cn("text-xs font-semibold", isPositive ? "text-emerald-500" : "text-red-500")}>
                {change >= 0 ? "+" : ""}{change.toFixed(1)}%
              </span>
              <span className="text-[10px] text-slate-300">vs anterior</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
