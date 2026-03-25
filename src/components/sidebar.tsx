"use client";

import { cn } from "@/lib/utils";
import {
  BarChart3,
  Funnel,
  LayoutDashboard,
  Settings,
  TrendingUp,
  Zap,
} from "lucide-react";

export type ViewName = "Dashboard" | "Funil" | "Canais" | "Tendências" | "AI Insights" | "Config";

const navItems: { icon: typeof LayoutDashboard; label: ViewName }[] = [
  { icon: LayoutDashboard, label: "Dashboard" },
  { icon: Funnel, label: "Funil" },
  { icon: BarChart3, label: "Canais" },
  { icon: TrendingUp, label: "Tendências" },
  { icon: Zap, label: "AI Insights" },
  { icon: Settings, label: "Config" },
];

interface SidebarProps {
  active: ViewName;
  onNavigate: (view: ViewName) => void;
}

export function Sidebar({ active, onNavigate }: SidebarProps) {
  return (
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-64 flex-col bg-slate-900 text-white">
      <div className="flex h-16 items-center gap-3 border-b border-slate-700/50 px-6">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-500 font-bold text-sm">
          V
        </div>
        <span className="text-lg font-semibold tracking-tight">
          Virvel Analytics
        </span>
      </div>

      <nav className="mt-6 flex-1 space-y-1 px-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.label)}
            className={cn(
              "flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
              active === item.label
                ? "bg-indigo-500/20 text-indigo-300"
                : "text-slate-400 hover:bg-slate-800 hover:text-slate-200"
            )}
          >
            <item.icon className="h-5 w-5" />
            {item.label}
          </button>
        ))}
      </nav>

      <div className="border-t border-slate-700/50 p-4">
        <div className="rounded-lg bg-slate-800 p-3">
          <p className="text-xs font-medium text-slate-300">GA4 Vortex</p>
          <p className="text-xs text-slate-500">via Windsor.ai</p>
          <p className="mt-1 text-xs font-medium text-emerald-400">
            ● Conectado · Conta 372674508
          </p>
        </div>
      </div>
    </aside>
  );
}
