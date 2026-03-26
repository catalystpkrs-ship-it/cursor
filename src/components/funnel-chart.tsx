"use client";

import { getAggregatedFunnel } from "@/lib/windsor";
import { cn } from "@/lib/utils";

export function FunnelChart() {
  const funnelData = getAggregatedFunnel();
  const maxValue = funnelData[0].value;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="text-sm font-semibold text-slate-800">Funil de Conversão</h3>
      <div className="mt-4 space-y-2.5">
        {funnelData.map((step, index) => {
          const widthPercent = (step.value / maxValue) * 100;
          const prevChange = (
            ((step.value - step.previousValue) / step.previousValue) * 100
          ).toFixed(1);
          const isPositive = step.value >= step.previousValue;
          const dropOff = index < funnelData.length - 1
            ? (((step.value - funnelData[index + 1].value) / step.value) * 100).toFixed(1)
            : null;

          return (
            <div key={step.label}>
              <div className="mb-1 flex items-center justify-between">
                <span className="text-xs font-medium text-slate-600">{step.label}</span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-slate-800">
                    {step.value.toLocaleString("pt-BR")}
                  </span>
                  <span className={cn("text-[10px] font-semibold", isPositive ? "text-emerald-500" : "text-red-500")}>
                    {isPositive ? "+" : ""}{prevChange}%
                  </span>
                </div>
              </div>
              <div className="h-7 w-full overflow-hidden rounded-lg bg-slate-50">
                <div
                  className="flex h-full items-center rounded-lg transition-all duration-500"
                  style={{ width: `${widthPercent}%`, backgroundColor: step.color }}
                >
                  <span className="px-2 text-[10px] font-semibold text-white/80">
                    {widthPercent.toFixed(0)}%
                  </span>
                </div>
              </div>
              {dropOff && (
                <p className="mt-0.5 pl-1 text-[10px] text-slate-300">
                  drop-off: {dropOff}%
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
