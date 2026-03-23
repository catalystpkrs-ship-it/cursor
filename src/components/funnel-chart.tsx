"use client";

import { getAggregatedFunnel } from "@/lib/windsor";
import { ArrowDown, TrendingUp } from "lucide-react";

export function FunnelChart() {
  const funnelData = getAggregatedFunnel();
  const maxValue = funnelData[0].value;
  const overallRate = ((funnelData[4].value / funnelData[0].value) * 100).toFixed(2);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h2 className="text-lg font-semibold text-slate-800">
            Funil de Conversão
          </h2>
          <p className="text-sm text-slate-500">
            GA4 Vortex · Últimos 30 dias (dados reais)
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-xs font-medium text-emerald-600">
          <TrendingUp className="h-3.5 w-3.5" />
          Taxa geral: {overallRate}%
        </div>
      </div>

      <div className="space-y-3">
        {funnelData.map((step, index) => {
          const widthPercent = (step.value / maxValue) * 100;
          const prevChange = (
            ((step.value - step.previousValue) / step.previousValue) * 100
          ).toFixed(1);
          const isPositive = step.value >= step.previousValue;

          return (
            <div key={step.label}>
              <div className="mb-1.5 flex items-baseline justify-between">
                <span className="text-sm font-medium text-slate-700">
                  {step.label}
                </span>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-slate-800">
                    {step.value.toLocaleString("pt-BR")}
                  </span>
                  <span
                    className={`text-xs font-medium ${
                      isPositive ? "text-emerald-500" : "text-red-500"
                    }`}
                  >
                    {isPositive ? "+" : ""}
                    {prevChange}%
                  </span>
                </div>
              </div>
              <div className="h-10 w-full overflow-hidden rounded-lg bg-slate-100">
                <div
                  className="flex h-full items-center rounded-lg transition-all duration-700 ease-out"
                  style={{
                    width: `${widthPercent}%`,
                    backgroundColor: step.color,
                  }}
                >
                  <span className="px-3 text-xs font-medium text-white/90">
                    {widthPercent.toFixed(1)}%
                  </span>
                </div>
              </div>
              {index < funnelData.length - 1 && (
                <div className="my-1 flex items-center gap-1 pl-2">
                  <ArrowDown className="h-3 w-3 text-slate-300" />
                  <span className="text-xs text-slate-400">
                    Drop-off:{" "}
                    {(((step.value - funnelData[index + 1].value) / step.value) * 100).toFixed(1)}%
                  </span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
