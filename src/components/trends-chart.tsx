"use client";

import { ga4DailyData, ga4PreviousPeriodData } from "@/lib/windsor";
import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useState } from "react";

type MetricKey = "sessions" | "active_users" | "purchase_revenue" | "ecommerce_purchases" | "bounce_rate" | "add_to_carts";

const metrics: { key: MetricKey; label: string; color: string; format: "number" | "currency" | "percent" }[] = [
  { key: "sessions", label: "Sessões", color: "#6366f1", format: "number" },
  { key: "active_users", label: "Usuários", color: "#8b5cf6", format: "number" },
  { key: "purchase_revenue", label: "Receita", color: "#10b981", format: "currency" },
  { key: "ecommerce_purchases", label: "Compras", color: "#f59e0b", format: "number" },
  { key: "bounce_rate", label: "Bounce Rate", color: "#ef4444", format: "percent" },
  { key: "add_to_carts", label: "Add to Cart", color: "#a78bfa", format: "number" },
];

function fmt(value: number, format: string): string {
  if (format === "currency") return `R$ ${(value / 1000).toFixed(1)}k`;
  if (format === "percent") return `${(value * 100).toFixed(1)}%`;
  if (value >= 1000) return `${(value / 1000).toFixed(1)}k`;
  return value.toLocaleString("pt-BR");
}

function fmtFull(value: number, format: string): string {
  if (format === "currency") return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  if (format === "percent") return `${(value * 100).toFixed(1)}%`;
  return value.toLocaleString("pt-BR");
}

function fmtDate(d: string): string {
  const date = new Date(d + "T00:00:00");
  return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}`;
}

export function TrendsChart() {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("sessions");
  const metric = metrics.find((m) => m.key === selectedMetric)!;

  const currentValues = ga4DailyData.map((d) => d[selectedMetric] as number);
  const previousValues = ga4PreviousPeriodData.map((d) => d[selectedMetric] as number);

  const allValues = [...currentValues, ...previousValues];
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const range = maxValue - minValue || 1;

  const currentTotal = currentValues.reduce((a, b) => a + b, 0);
  const previousTotal = previousValues.reduce((a, b) => a + b, 0);
  const isAvg = metric.format === "percent";
  const currAgg = isAvg ? currentTotal / currentValues.length : currentTotal;
  const prevAgg = isAvg ? previousTotal / previousValues.length : previousTotal;
  const change = ((currAgg - prevAgg) / prevAgg) * 100;
  const isPositive = metric.key === "bounce_rate" ? change < 0 : change >= 0;

  const W = 760;
  const H = 240;
  const pad = { t: 15, r: 15, b: 25, l: 10 };
  const iW = W - pad.l - pad.r;
  const iH = H - pad.t - pad.b;

  function toPath(vals: number[]): string {
    return vals.map((v, i) => {
      const x = pad.l + (i / (vals.length - 1)) * iW;
      const y = pad.t + iH - ((v - minValue) / range) * iH;
      return `${i === 0 ? "M" : "L"} ${x} ${y}`;
    }).join(" ");
  }

  function toArea(vals: number[]): string {
    const line = toPath(vals);
    return `${line} L ${pad.l + iW} ${pad.t + iH} L ${pad.l} ${pad.t + iH} Z`;
  }

  // 5 grid lines
  const gridLines = Array.from({ length: 5 }, (_, i) => minValue + (range * i) / 4);

  return (
    <div className="space-y-4">
      {/* Metric pills */}
      <div className="flex flex-wrap gap-2">
        {metrics.map((m) => {
          const vals = ga4DailyData.map((d) => d[m.key] as number);
          const prevVals = ga4PreviousPeriodData.map((d) => d[m.key] as number);
          const curr = m.format === "percent" ? vals.reduce((a, b) => a + b, 0) / vals.length : vals.reduce((a, b) => a + b, 0);
          const prev = m.format === "percent" ? prevVals.reduce((a, b) => a + b, 0) / prevVals.length : prevVals.reduce((a, b) => a + b, 0);
          const ch = ((curr - prev) / prev) * 100;
          const pos = m.key === "bounce_rate" ? ch < 0 : ch >= 0;

          return (
            <button
              key={m.key}
              onClick={() => setSelectedMetric(m.key)}
              className={cn(
                "flex items-center gap-2 rounded-xl border px-4 py-2.5 text-left transition-all",
                selectedMetric === m.key
                  ? "border-slate-300 bg-white shadow-sm"
                  : "border-slate-100 bg-slate-50 hover:border-slate-200"
              )}
            >
              <div>
                <p className="text-[10px] font-medium text-slate-400">{m.label}</p>
                <p className="text-sm font-bold text-slate-800">{fmt(curr, m.format)}</p>
              </div>
              <span className={cn("text-[10px] font-bold", pos ? "text-emerald-500" : "text-red-500")}>
                {ch >= 0 ? "+" : ""}{ch.toFixed(1)}%
              </span>
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <div className="mb-3 flex items-center justify-between">
          <div>
            <h3 className="text-sm font-semibold text-slate-800">{metric.label}</h3>
            <p className="text-[10px] text-slate-400">30 dias vs período anterior</p>
          </div>
          <div className={cn("flex items-center gap-1 text-xs font-bold", isPositive ? "text-emerald-500" : "text-red-500")}>
            {isPositive ? <ArrowUpRight className="h-3.5 w-3.5" /> : <ArrowDownRight className="h-3.5 w-3.5" />}
            {change >= 0 ? "+" : ""}{change.toFixed(1)}%
          </div>
        </div>

        <svg viewBox={`0 0 ${W} ${H}`} className="w-full" preserveAspectRatio="xMidYMid meet">
          {gridLines.map((v, i) => {
            const y = pad.t + iH - ((v - minValue) / range) * iH;
            return (
              <g key={i}>
                <line x1={pad.l} y1={y} x2={W - pad.r} y2={y} stroke="#f1f5f9" strokeWidth={1} />
                <text x={W - pad.r + 4} y={y + 3} fontSize={8} fill="#cbd5e1">{fmtFull(v, metric.format)}</text>
              </g>
            );
          })}

          {ga4DailyData.filter((_, i) => i % 7 === 0).map((d) => {
            const idx = ga4DailyData.indexOf(d);
            const x = pad.l + (idx / (ga4DailyData.length - 1)) * iW;
            return <text key={d.date} x={x} y={H - 5} fontSize={8} fill="#cbd5e1" textAnchor="middle">{fmtDate(d.date)}</text>;
          })}

          <path d={toArea(previousValues)} fill="#e2e8f0" opacity={0.2} />
          <path d={toPath(previousValues)} fill="none" stroke="#cbd5e1" strokeWidth={1} strokeDasharray="3 3" />
          <path d={toArea(currentValues)} fill={metric.color} opacity={0.08} />
          <path d={toPath(currentValues)} fill="none" stroke={metric.color} strokeWidth={2} />

          {currentValues.map((v, i) => {
            const x = pad.l + (i / (currentValues.length - 1)) * iW;
            const y = pad.t + iH - ((v - minValue) / range) * iH;
            return <circle key={i} cx={x} cy={y} r={2} fill={metric.color} stroke="white" strokeWidth={1} />;
          })}
        </svg>

        <div className="mt-3 flex items-center justify-center gap-6 text-[10px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-5 rounded" style={{ backgroundColor: metric.color }} />
            Período atual
          </div>
          <div className="flex items-center gap-1.5">
            <div className="h-0.5 w-5 rounded border-b border-dashed border-slate-300" />
            Período anterior
          </div>
        </div>
      </div>

      {/* Daily table */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5">
        <h3 className="mb-3 text-sm font-semibold text-slate-800">Dados Diários</h3>
        <div className="max-h-[350px] overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-slate-100">
                <th className="pb-2 text-left font-medium text-slate-400">Data</th>
                <th className="pb-2 text-right font-medium text-slate-400">Sessões</th>
                <th className="pb-2 text-right font-medium text-slate-400">Usuários</th>
                <th className="pb-2 text-right font-medium text-slate-400">Receita</th>
                <th className="pb-2 text-right font-medium text-slate-400">Compras</th>
                <th className="pb-2 text-right font-medium text-slate-400">Bounce</th>
              </tr>
            </thead>
            <tbody>
              {[...ga4DailyData].reverse().map((d) => (
                <tr key={d.date} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50">
                  <td className="py-2 font-medium text-slate-600">{fmtDate(d.date)}</td>
                  <td className="py-2 text-right tabular-nums text-slate-500">{d.sessions.toLocaleString("pt-BR")}</td>
                  <td className="py-2 text-right tabular-nums text-slate-500">{d.active_users.toLocaleString("pt-BR")}</td>
                  <td className="py-2 text-right tabular-nums text-slate-500">R$ {d.purchase_revenue.toLocaleString("pt-BR", { maximumFractionDigits: 0 })}</td>
                  <td className="py-2 text-right tabular-nums text-slate-500">{d.ecommerce_purchases}</td>
                  <td className="py-2 text-right tabular-nums text-slate-500">{(d.bounce_rate * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
