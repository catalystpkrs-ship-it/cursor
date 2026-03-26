"use client";

import dynamic from "next/dynamic";
import { FunnelChart } from "@/components/funnel-chart";
import { GlobalFilter } from "@/components/global-filter";
import { getAggregatedFunnel } from "@/lib/windsor";
import { cn } from "@/lib/utils";
import { AlertTriangle, ArrowDown, ArrowDownRight, ArrowUpRight, Lightbulb, Target } from "lucide-react";

const Funnel3D = dynamic(
  () => import("@/components/funnel-3d").then((m) => ({ default: m.Funnel3D })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[400px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="mx-auto h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-500" />
      </div>
    ),
  }
);

function FunnelInsights() {
  const funnel = getAggregatedFunnel();
  const overallRate = ((funnel[4].value / funnel[0].value) * 100).toFixed(2);
  const prevOverallRate = ((funnel[4].previousValue / funnel[0].previousValue) * 100).toFixed(2);
  const rateChange = parseFloat(overallRate) - parseFloat(prevOverallRate);

  const dropOffs = funnel.slice(0, -1).map((step, i) => {
    const next = funnel[i + 1];
    const dropRate = ((step.value - next.value) / step.value) * 100;
    const prevDropRate = ((step.previousValue - next.previousValue) / step.previousValue) * 100;
    return {
      from: step.label,
      to: next.label,
      dropRate,
      diff: dropRate - prevDropRate,
      worsened: dropRate > prevDropRate,
      lostUsers: step.value - next.value,
    };
  });

  const worstDrop = dropOffs.reduce((max, d) => (d.dropRate > max.dropRate ? d : max), dropOffs[0]);

  const suggestions = [
    { step: "Sessões → View Item", tip: "Melhore landing pages com banners de categorias populares e CTAs claros acima da dobra." },
    { step: "View Item → Add to Cart", tip: "Adicione urgência (estoque baixo), avaliações de clientes e fotos de caimento real." },
    { step: "Add to Cart → Checkout", tip: "Implemente mini-cart lateral e frete grátis progressivo." },
    { step: "Checkout → Purchase", tip: "Checkout em 1 página, Pix com desconto e selos de segurança visíveis." },
  ];

  return (
    <div className="space-y-3">
      {/* Conversion rate */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <div className="flex items-center gap-2">
          <Target className="h-4 w-4 text-indigo-500" />
          <span className="text-xs font-semibold text-slate-500">CONVERSÃO GERAL</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <span className="text-2xl font-bold text-slate-900">{overallRate}%</span>
          <div className={cn("flex items-center gap-0.5 text-xs font-semibold", rateChange >= 0 ? "text-emerald-500" : "text-red-500")}>
            {rateChange >= 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
            {rateChange >= 0 ? "+" : ""}{rateChange.toFixed(2)}pp
          </div>
        </div>
        <p className="mt-0.5 text-[10px] text-slate-400">vs {prevOverallRate}% período anterior</p>
      </div>

      {/* Biggest bottleneck */}
      <div className="rounded-2xl border border-red-100 bg-red-50/50 p-4">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-4 w-4 text-red-400" />
          <span className="text-xs font-semibold text-red-600">MAIOR GARGALO</span>
        </div>
        <p className="mt-2 text-sm font-semibold text-slate-800">
          {worstDrop.from} → {worstDrop.to}
        </p>
        <p className="text-xs text-slate-500">
          <span className="font-bold text-red-500">{worstDrop.dropRate.toFixed(1)}%</span> drop-off · {worstDrop.lostUsers.toLocaleString("pt-BR")} perdidos
        </p>
      </div>

      {/* Drop-offs */}
      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <span className="text-xs font-semibold text-slate-500">DROP-OFF POR ETAPA</span>
        <div className="mt-3 space-y-2.5">
          {dropOffs.map((d) => (
            <div key={d.from} className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <ArrowDown className="h-3 w-3 text-slate-300" />
                <span className="text-xs text-slate-600">{d.from} → {d.to}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-red-500">{d.dropRate.toFixed(1)}%</span>
                <span className={cn("rounded px-1 py-0.5 text-[10px] font-semibold", d.worsened ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-500")}>
                  {d.diff >= 0 ? "+" : ""}{d.diff.toFixed(1)}pp
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="rounded-2xl border border-amber-100 bg-amber-50/30 p-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-4 w-4 text-amber-500" />
          <span className="text-xs font-semibold text-amber-700">SUGESTÕES CRO</span>
        </div>
        <div className="mt-3 space-y-2">
          {suggestions.map((s) => (
            <div key={s.step} className="rounded-xl bg-white p-3">
              <p className="text-[10px] font-bold text-indigo-500">{s.step}</p>
              <p className="mt-0.5 text-xs text-slate-500">{s.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FunnelView() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Funil de Conversão</h1>
          <p className="text-xs text-slate-400">Análise completa com insights e sugestões</p>
        </div>
        <GlobalFilter />
      </div>

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-12">
        {/* Left: 3D + 2D funnel */}
        <div className="space-y-4 xl:col-span-8">
          <Funnel3D />
          <FunnelChart />
        </div>
        {/* Right: Insights panel */}
        <div className="xl:col-span-4">
          <FunnelInsights />
        </div>
      </div>
    </div>
  );
}
