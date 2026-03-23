"use client";

import { getKPIs } from "@/lib/windsor";
import {
  ArrowDownRight,
  ArrowUpRight,
  DollarSign,
  Percent,
  TrendingUp,
  Users,
} from "lucide-react";

const icons = [Users, TrendingUp, DollarSign, Percent];

export function KPICards() {
  const kpis = getKPIs();

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {kpis.map((kpi, i) => {
        const change = ((kpi.value - kpi.previousValue) / kpi.previousValue) * 100;
        const isPositive = kpi.format === "percent" ? change < 0 : change >= 0;
        const Icon = icons[i];

        let displayValue: string;
        if (kpi.format === "currency") {
          displayValue = `R$ ${(kpi.value).toLocaleString("pt-BR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
        } else if (kpi.format === "percent") {
          displayValue = `${(kpi.value * 100).toFixed(1)}%`;
        } else {
          displayValue = kpi.value.toLocaleString("pt-BR");
        }

        return (
          <div
            key={kpi.label}
            className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
          >
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-slate-500">
                {kpi.label}
              </span>
              <Icon className="h-4 w-4 text-slate-400" />
            </div>
            <p className="mt-2 text-2xl font-bold text-slate-800">
              {displayValue}
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
                {change >= 0 ? "+" : ""}
                {change.toFixed(1)}% vs período anterior
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
