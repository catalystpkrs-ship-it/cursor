"use client";

import { funnelData } from "@/data/mock-funnel";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Eye,
  ShoppingCart,
  Users,
} from "lucide-react";

const kpis = [
  {
    label: "Sessões",
    value: funnelData[0].value,
    previous: funnelData[0].previousValue,
    icon: Users,
    format: "number",
  },
  {
    label: "Visualizações",
    value: funnelData[1].value,
    previous: funnelData[1].previousValue,
    icon: Eye,
    format: "number",
  },
  {
    label: "Add to Cart",
    value: funnelData[2].value,
    previous: funnelData[2].previousValue,
    icon: ShoppingCart,
    format: "number",
  },
  {
    label: "Receita Estimada",
    value: funnelData[4].value * 127.5,
    previous: funnelData[4].previousValue * 127.5,
    icon: DollarSign,
    format: "currency",
  },
];

export function KPICards() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi) => {
        const change = ((kpi.value - kpi.previous) / kpi.previous) * 100;
        const isPositive = change >= 0;
        return (
          <div
            key={kpi.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                {kpi.label}
              </span>
              <kpi.icon className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              {kpi.format === "currency"
                ? `R$ ${(kpi.value / 1000).toFixed(1)}k`
                : kpi.value.toLocaleString("pt-BR")}
            </p>
            <div className="mt-1 flex items-center gap-1">
              {isPositive ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-red-500" />
              )}
              <span
                className={`text-xs font-medium ${
                  isPositive ? "text-emerald-500" : "text-red-500"
                }`}
              >
                {isPositive ? "+" : ""}
                {change.toFixed(1)}% vs anterior
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
