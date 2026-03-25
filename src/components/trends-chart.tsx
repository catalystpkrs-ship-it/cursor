"use client";

import { ga4DailyData, ga4PreviousPeriodData } from "@/lib/windsor";
import { cn } from "@/lib/utils";
import {
  ArrowDownRight,
  ArrowUpRight,
} from "lucide-react";
import { useState } from "react";

type MetricKey = "sessions" | "active_users" | "purchase_revenue" | "ecommerce_purchases" | "bounce_rate" | "add_to_carts";

const metrics: { key: MetricKey; label: string; color: string; format: "number" | "currency" | "percent" }[] = [
  { key: "sessions", label: "Sessões", color: "#6366f1", format: "number" },
  { key: "active_users", label: "Usuários Ativos", color: "#8b5cf6", format: "number" },
  { key: "purchase_revenue", label: "Receita", color: "#10b981", format: "currency" },
  { key: "ecommerce_purchases", label: "Compras", color: "#f59e0b", format: "number" },
  { key: "bounce_rate", label: "Taxa de Rejeição", color: "#ef4444", format: "percent" },
  { key: "add_to_carts", label: "Add to Cart", color: "#a78bfa", format: "number" },
];

function formatValue(value: number, format: string): string {
  if (format === "currency") return `R$ ${value.toLocaleString("pt-BR", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  if (format === "percent") return `${(value * 100).toFixed(1)}%`;
  return value.toLocaleString("pt-BR");
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return `${d.getDate().toString().padStart(2, "0")}/${(d.getMonth() + 1).toString().padStart(2, "0")}`;
}

export function TrendsChart() {
  const [selectedMetric, setSelectedMetric] = useState<MetricKey>("sessions");
  const metric = metrics.find((m) => m.key === selectedMetric)!;

  const currentValues = ga4DailyData.map((d) => d[selectedMetric] as number);
  const previousValues = ga4PreviousPeriodData.map((d) => d[selectedMetric] as number);

  const maxValue = Math.max(...currentValues, ...previousValues);
  const minValue = Math.min(...currentValues, ...previousValues);
  const range = maxValue - minValue || 1;

  const currentTotal = currentValues.reduce((a, b) => a + b, 0);
  const previousTotal = previousValues.reduce((a, b) => a + b, 0);
  const isAvgMetric = metric.format === "percent";
  const currentAgg = isAvgMetric ? currentTotal / currentValues.length : currentTotal;
  const previousAgg = isAvgMetric ? previousTotal / previousValues.length : previousTotal;
  const change = ((currentAgg - previousAgg) / previousAgg) * 100;
  const isPositive = metric.key === "bounce_rate" ? change < 0 : change >= 0;

  const chartHeight = 280;
  const chartWidth = 800;
  const padding = { top: 20, right: 20, bottom: 30, left: 10 };
  const innerWidth = chartWidth - padding.left - padding.right;
  const innerHeight = chartHeight - padding.top - padding.bottom;

  function buildPath(values: number[]): string {
    return values
      .map((v, i) => {
        const x = padding.left + (i / (values.length - 1)) * innerWidth;
        const y = padding.top + innerHeight - ((v - minValue) / range) * innerHeight;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
  }

  function buildAreaPath(values: number[]): string {
    const linePath = values
      .map((v, i) => {
        const x = padding.left + (i / (values.length - 1)) * innerWidth;
        const y = padding.top + innerHeight - ((v - minValue) / range) * innerHeight;
        return `${i === 0 ? "M" : "L"} ${x} ${y}`;
      })
      .join(" ");
    const lastX = padding.left + innerWidth;
    const firstX = padding.left;
    const bottom = padding.top + innerHeight;
    return `${linePath} L ${lastX} ${bottom} L ${firstX} ${bottom} Z`;
  }

  // Compute 7-day moving average
  function movingAvg(values: number[], window: number = 7): number[] {
    return values.map((_, i) => {
      const start = Math.max(0, i - window + 1);
      const slice = values.slice(start, i + 1);
      return slice.reduce((a, b) => a + b, 0) / slice.length;
    });
  }

  const currentMA = movingAvg(currentValues);

  // Grid lines
  const gridLines = 5;
  const gridValues = Array.from({ length: gridLines }, (_, i) => minValue + (range * i) / (gridLines - 1));

  return (
    <div className="space-y-6">
      {/* Metric selector */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
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
                "rounded-xl border p-4 text-left transition-all",
                selectedMetric === m.key
                  ? "border-indigo-300 bg-indigo-50 shadow-sm"
                  : "border-slate-200 bg-white hover:border-slate-300"
              )}
            >
              <p className="text-xs font-medium text-slate-500">{m.label}</p>
              <p className="mt-1 text-lg font-bold text-slate-800">{formatValue(curr, m.format)}</p>
              <div className="mt-1 flex items-center gap-1">
                {pos ? (
                  <ArrowUpRight className="h-3 w-3 text-emerald-500" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 text-red-500" />
                )}
                <span className={cn("text-xs font-medium", pos ? "text-emerald-500" : "text-red-500")}>
                  {ch >= 0 ? "+" : ""}{ch.toFixed(1)}%
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Chart */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">{metric.label}</h3>
            <p className="text-sm text-slate-500">Últimos 30 dias vs período anterior</p>
          </div>
          <div className="flex items-center gap-2">
            <div className={cn("flex items-center gap-1", isPositive ? "text-emerald-500" : "text-red-500")}>
              {isPositive ? <ArrowUpRight className="h-4 w-4" /> : <ArrowDownRight className="h-4 w-4" />}
              <span className="text-sm font-semibold">{change >= 0 ? "+" : ""}{change.toFixed(1)}%</span>
            </div>
          </div>
        </div>

        <svg viewBox={`0 0 ${chartWidth} ${chartHeight}`} className="w-full" preserveAspectRatio="xMidYMid meet">
          {/* Grid */}
          {gridValues.map((v, i) => {
            const y = padding.top + innerHeight - ((v - minValue) / range) * innerHeight;
            return (
              <g key={i}>
                <line x1={padding.left} y1={y} x2={chartWidth - padding.right} y2={y} stroke="#e2e8f0" strokeWidth={1} />
                <text x={chartWidth - padding.right + 5} y={y + 4} fontSize={9} fill="#94a3b8" textAnchor="start">
                  {formatValue(v, metric.format)}
                </text>
              </g>
            );
          })}

          {/* X-axis labels */}
          {ga4DailyData.filter((_, i) => i % 5 === 0).map((d) => {
            const idx = ga4DailyData.indexOf(d);
            const x = padding.left + (idx / (ga4DailyData.length - 1)) * innerWidth;
            return (
              <text key={d.date} x={x} y={chartHeight - 5} fontSize={9} fill="#94a3b8" textAnchor="middle">
                {formatDate(d.date)}
              </text>
            );
          })}

          {/* Previous period area */}
          <path d={buildAreaPath(previousValues)} fill="#e2e8f0" opacity={0.3} />
          <path d={buildPath(previousValues)} fill="none" stroke="#cbd5e1" strokeWidth={1.5} strokeDasharray="4 3" />

          {/* Current period area */}
          <path d={buildAreaPath(currentValues)} fill={metric.color} opacity={0.1} />
          <path d={buildPath(currentValues)} fill="none" stroke={metric.color} strokeWidth={2} />

          {/* Moving average */}
          <path d={buildPath(currentMA)} fill="none" stroke={metric.color} strokeWidth={1.5} strokeDasharray="6 3" opacity={0.5} />

          {/* Data points */}
          {currentValues.map((v, i) => {
            const x = padding.left + (i / (currentValues.length - 1)) * innerWidth;
            const y = padding.top + innerHeight - ((v - minValue) / range) * innerHeight;
            return <circle key={i} cx={x} cy={y} r={2.5} fill={metric.color} stroke="white" strokeWidth={1.5} />;
          })}
        </svg>

        <div className="mt-4 flex items-center justify-center gap-6 text-xs text-slate-500">
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-6 rounded" style={{ backgroundColor: metric.color }} />
            <span>Período atual</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-6 rounded border-b border-dashed border-slate-400 bg-transparent" style={{ borderStyle: "dashed" }} />
            <span>Período anterior</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-0.5 w-6 rounded opacity-50" style={{ backgroundColor: metric.color, borderStyle: "dashed" }} />
            <span>Média móvel 7d</span>
          </div>
        </div>
      </div>

      {/* Daily data table */}
      <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
        <h3 className="mb-4 text-lg font-semibold text-slate-800">Dados Diários</h3>
        <div className="max-h-[400px] overflow-y-auto">
          <table className="w-full text-sm">
            <thead className="sticky top-0 bg-white">
              <tr className="border-b border-slate-100">
                <th className="pb-3 text-left font-medium text-slate-500">Data</th>
                <th className="pb-3 text-right font-medium text-slate-500">Sessões</th>
                <th className="pb-3 text-right font-medium text-slate-500">Usuários</th>
                <th className="pb-3 text-right font-medium text-slate-500">Receita</th>
                <th className="pb-3 text-right font-medium text-slate-500">Compras</th>
                <th className="pb-3 text-right font-medium text-slate-500">Bounce Rate</th>
              </tr>
            </thead>
            <tbody>
              {[...ga4DailyData].reverse().map((d) => (
                <tr key={d.date} className="border-b border-slate-50 hover:bg-slate-50">
                  <td className="py-2.5 font-medium text-slate-700">{formatDate(d.date)}</td>
                  <td className="py-2.5 text-right text-slate-600">{d.sessions.toLocaleString("pt-BR")}</td>
                  <td className="py-2.5 text-right text-slate-600">{d.active_users.toLocaleString("pt-BR")}</td>
                  <td className="py-2.5 text-right text-slate-600">R$ {d.purchase_revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}</td>
                  <td className="py-2.5 text-right text-slate-600">{d.ecommerce_purchases}</td>
                  <td className="py-2.5 text-right text-slate-600">{(d.bounce_rate * 100).toFixed(1)}%</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
