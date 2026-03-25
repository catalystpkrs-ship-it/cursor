"use client";

import dynamic from "next/dynamic";
import { FunnelChart } from "@/components/funnel-chart";
import { getAggregatedFunnel } from "@/lib/windsor";
import { AlertTriangle, ArrowDown, Lightbulb, Target } from "lucide-react";

const Funnel3D = dynamic(
  () => import("@/components/funnel-3d").then((m) => ({ default: m.Funnel3D })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-slate-200 bg-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500" />
          <p className="mt-3 text-sm text-slate-500">Carregando funil 3D...</p>
        </div>
      </div>
    ),
  }
);

function FunnelInsightsPanel() {
  const funnel = getAggregatedFunnel();

  // Calculate drop-off rates between each step
  const dropOffs = funnel.slice(0, -1).map((step, i) => {
    const next = funnel[i + 1];
    const dropRate = ((step.value - next.value) / step.value) * 100;
    const prevDropRate = ((step.previousValue - next.previousValue) / step.previousValue) * 100;
    return {
      from: step.label,
      to: next.label,
      dropRate,
      prevDropRate,
      worsened: dropRate > prevDropRate,
      diff: dropRate - prevDropRate,
      lostUsers: step.value - next.value,
    };
  });

  // Find biggest bottleneck
  const worstDrop = dropOffs.reduce((max, d) => (d.dropRate > max.dropRate ? d : max), dropOffs[0]);

  const overallRate = ((funnel[4].value / funnel[0].value) * 100).toFixed(2);
  const prevOverallRate = ((funnel[4].previousValue / funnel[0].previousValue) * 100).toFixed(2);

  const suggestions = [
    {
      step: "Sessões → View Item",
      tip: "Melhore a relevância das landing pages. Use banners com categorias populares e CTAs claros acima da dobra.",
    },
    {
      step: "View Item → Add to Cart",
      tip: "Adicione urgência (estoque baixo), avaliações de clientes, e fotos de tamanho/caimento real.",
    },
    {
      step: "Add to Cart → Checkout",
      tip: "Implemente carrinho lateral (mini-cart), oferta de frete grátis progressivo, e lembretes de carrinho abandonado.",
    },
    {
      step: "Checkout → Purchase",
      tip: "Simplifique o checkout (1 página), ofereça Pix com desconto, e adicione selos de segurança visíveis.",
    },
  ];

  return (
    <div className="space-y-4">
      {/* Overall conversion */}
      <div className="rounded-xl border border-indigo-200 bg-indigo-50/50 p-5">
        <div className="flex items-center gap-2">
          <Target className="h-5 w-5 text-indigo-500" />
          <h3 className="font-semibold text-slate-800">Conversão Geral</h3>
        </div>
        <div className="mt-2 flex items-baseline gap-3">
          <span className="text-3xl font-bold text-indigo-600">{overallRate}%</span>
          <span className="text-sm text-slate-500">vs {prevOverallRate}% período anterior</span>
        </div>
      </div>

      {/* Biggest bottleneck */}
      <div className="rounded-xl border border-red-200 bg-red-50/50 p-5">
        <div className="flex items-center gap-2">
          <AlertTriangle className="h-5 w-5 text-red-500" />
          <h3 className="font-semibold text-slate-800">Maior Gargalo</h3>
        </div>
        <p className="mt-2 text-sm text-slate-700">
          <strong>{worstDrop.from} → {worstDrop.to}</strong>: drop-off de{" "}
          <span className="font-bold text-red-600">{worstDrop.dropRate.toFixed(1)}%</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">
          {worstDrop.lostUsers.toLocaleString("pt-BR")} usuários perdidos nesta etapa
        </p>
      </div>

      {/* Drop-off breakdown */}
      <div className="rounded-xl border border-slate-200 bg-white p-5">
        <h3 className="mb-3 font-semibold text-slate-800">Drop-off por Etapa</h3>
        <div className="space-y-3">
          {dropOffs.map((d) => (
            <div key={d.from} className="flex items-center justify-between">
              <div className="flex items-center gap-2 text-sm">
                <ArrowDown className="h-3.5 w-3.5 text-slate-400" />
                <span className="text-slate-600">
                  {d.from} → {d.to}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold text-red-500">{d.dropRate.toFixed(1)}%</span>
                {d.worsened ? (
                  <span className="rounded bg-red-100 px-1.5 py-0.5 text-xs font-medium text-red-600">
                    +{d.diff.toFixed(1)}pp
                  </span>
                ) : (
                  <span className="rounded bg-emerald-100 px-1.5 py-0.5 text-xs font-medium text-emerald-600">
                    {d.diff.toFixed(1)}pp
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Suggestions */}
      <div className="rounded-xl border border-amber-200 bg-amber-50/50 p-5">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h3 className="font-semibold text-slate-800">Sugestões de CRO</h3>
        </div>
        <div className="mt-3 space-y-3">
          {suggestions.map((s) => (
            <div key={s.step} className="rounded-lg bg-white p-3 shadow-sm">
              <p className="text-xs font-semibold text-indigo-600">{s.step}</p>
              <p className="mt-1 text-sm text-slate-600">{s.tip}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function FunnelView() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Funil de Conversão</h1>
        <p className="text-sm text-slate-500">
          Análise completa do funil e-commerce com insights e sugestões de melhoria
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 xl:grid-cols-3">
        <div className="xl:col-span-2 space-y-6">
          <Funnel3D />
          <FunnelChart />
        </div>
        <div>
          <FunnelInsightsPanel />
        </div>
      </div>
    </div>
  );
}
