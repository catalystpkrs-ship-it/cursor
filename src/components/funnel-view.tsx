"use client";

import { Funnel2D } from "@/components/funnel-2d";
import { GlobalFilter } from "@/components/global-filter";
import { getAggregatedFunnel } from "@/lib/windsor";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight, Lightbulb } from "lucide-react";

export function FunnelView() {
  const funnel = getAggregatedFunnel();
  const overallRate = ((funnel[4].value / funnel[0].value) * 100).toFixed(2);
  const prevOverallRate = ((funnel[4].previousValue / funnel[0].previousValue) * 100).toFixed(2);
  const rateChange = parseFloat(overallRate) - parseFloat(prevOverallRate);
  const ratePositive = rateChange >= 0;

  const steps = funnel.map((step, i) => {
    const next = i < funnel.length - 1 ? funnel[i + 1] : null;
    const dropRate = next ? ((step.value - next.value) / step.value) * 100 : null;
    const prevDropRate = next ? ((step.previousValue - next.previousValue) / step.previousValue) * 100 : null;
    const change = ((step.value - step.previousValue) / step.previousValue) * 100;
    const isPositive = step.value >= step.previousValue;
    return { ...step, dropRate, prevDropRate, change, isPositive };
  });

  const worstDropIdx = steps.reduce((maxI, s, i, arr) =>
    s.dropRate !== null && (arr[maxI].dropRate === null || s.dropRate! > arr[maxI].dropRate!) ? i : maxI, 0);

  const suggestions = [
    "Banners com categorias populares e CTAs acima da dobra",
    "Fotos de caimento real + avaliações de clientes",
    "Mini-cart lateral + frete grátis progressivo",
    "Checkout 1 página + Pix com desconto",
  ];

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Funil de Conversão</h1>
          <p className="text-xs text-slate-400">Passe o mouse nas fatias para detalhes</p>
        </div>
        <GlobalFilter />
      </div>

      {/* Main: funnel left + data right */}
      <div className="grid grid-cols-1 gap-5 xl:grid-cols-12">
        {/* Left: 2D Funnel */}
        <div className="xl:col-span-5">
          <div className="rounded-2xl border border-slate-200 bg-slate-900 px-6 py-8">
            <Funnel2D />
          </div>
        </div>

        {/* Right: data */}
        <div className="space-y-4 xl:col-span-7">
          {/* Top metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3">
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Conversão Geral</p>
              <div className="mt-1 flex items-baseline gap-2">
                <span className="text-2xl font-bold text-slate-900">{overallRate}%</span>
                <div className={cn("flex items-center gap-0.5 text-xs font-bold", ratePositive ? "text-emerald-500" : "text-red-500")}>
                  {ratePositive ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                  {rateChange >= 0 ? "+" : ""}{rateChange.toFixed(2)}pp
                </div>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3">
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Sessões</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{(funnel[0].value / 1000).toFixed(1)}k</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white px-5 py-3">
              <p className="text-[10px] font-medium text-slate-400 uppercase tracking-wider">Compras</p>
              <p className="mt-1 text-2xl font-bold text-slate-900">{funnel[4].value}</p>
            </div>
          </div>

          {/* Steps table */}
          <div className="rounded-2xl border border-slate-200 bg-white">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-3 text-left text-[10px] font-medium uppercase tracking-wider text-slate-400">Etapa</th>
                  <th className="px-5 py-3 text-right text-[10px] font-medium uppercase tracking-wider text-slate-400">Volume</th>
                  <th className="px-5 py-3 text-right text-[10px] font-medium uppercase tracking-wider text-slate-400">vs anterior</th>
                  <th className="px-5 py-3 text-right text-[10px] font-medium uppercase tracking-wider text-slate-400">Drop-off</th>
                  <th className="px-5 py-3 text-right text-[10px] font-medium uppercase tracking-wider text-slate-400">Variação</th>
                </tr>
              </thead>
              <tbody>
                {steps.map((s, i) => {
                  const dropDiff = s.dropRate !== null && s.prevDropRate !== null
                    ? s.dropRate - s.prevDropRate : null;
                  const isWorst = i === worstDropIdx && s.dropRate !== null;

                  return (
                    <tr key={s.key} className={cn("border-b border-slate-50 last:border-0", isWorst && "bg-red-50/40")}>
                      <td className="px-5 py-3">
                        <div className="flex items-center gap-2">
                          <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.color }} />
                          <span className="text-xs font-medium text-slate-700">{s.label}</span>
                          {isWorst && (
                            <span className="rounded bg-red-100 px-1.5 py-0.5 text-[9px] font-bold text-red-600">GARGALO</span>
                          )}
                        </div>
                      </td>
                      <td className="px-5 py-3 text-right text-xs font-bold tabular-nums text-slate-800">
                        {s.value.toLocaleString("pt-BR")}
                      </td>
                      <td className="px-5 py-3 text-right">
                        <span className={cn("text-xs font-semibold tabular-nums", s.isPositive ? "text-emerald-500" : "text-red-500")}>
                          {s.change >= 0 ? "+" : ""}{s.change.toFixed(1)}%
                        </span>
                      </td>
                      <td className="px-5 py-3 text-right">
                        {s.dropRate !== null ? (
                          <span className="text-xs font-bold tabular-nums text-red-500">{s.dropRate.toFixed(1)}%</span>
                        ) : (
                          <span className="text-[10px] text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3 text-right">
                        {dropDiff !== null ? (
                          <span className={cn(
                            "rounded px-1.5 py-0.5 text-[10px] font-bold tabular-nums",
                            dropDiff > 0 ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"
                          )}>
                            {dropDiff >= 0 ? "+" : ""}{dropDiff.toFixed(1)}pp
                          </span>
                        ) : (
                          <span className="text-[10px] text-slate-300">—</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Bar visualization */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="space-y-2">
              {funnel.map((step) => {
                const pct = (step.value / funnel[0].value) * 100;
                return (
                  <div key={step.key} className="flex items-center gap-3">
                    <span className="w-24 text-[10px] font-medium text-slate-500 text-right">{step.label}</span>
                    <div className="flex-1 h-6 rounded-lg bg-slate-50 overflow-hidden">
                      <div
                        className="h-full rounded-lg flex items-center transition-all duration-500"
                        style={{ width: `${Math.max(pct, 3)}%`, backgroundColor: step.color }}
                      >
                        {pct > 8 && <span className="px-2 text-[10px] font-bold text-white/80">{pct.toFixed(1)}%</span>}
                      </div>
                    </div>
                    <span className="w-16 text-right text-[10px] font-bold tabular-nums text-slate-700">
                      {step.value.toLocaleString("pt-BR")}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* CRO Suggestions */}
          <div className="rounded-2xl border border-slate-200 bg-white p-5">
            <div className="flex items-center gap-2 mb-3">
              <Lightbulb className="h-4 w-4 text-amber-500" />
              <span className="text-xs font-bold text-slate-700">Sugestões de CRO</span>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {suggestions.map((tip, i) => (
                <div key={i} className="rounded-xl bg-slate-50 px-3.5 py-2.5">
                  <p className="text-[10px] font-bold text-indigo-500">{steps[i].label} → {steps[i + 1]?.label}</p>
                  <p className="mt-0.5 text-[11px] text-slate-500">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
