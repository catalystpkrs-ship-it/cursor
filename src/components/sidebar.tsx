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
    <aside className="fixed left-0 top-0 z-40 flex h-screen w-56 flex-col border-r border-slate-200 bg-white">
      {/* Logo */}
      <div className="flex h-14 items-center gap-2.5 px-5">
        <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-900 text-xs font-bold text-white">
          V
        </div>
        <span className="text-sm font-bold tracking-tight text-slate-900">
          Virvel
        </span>
      </div>

      {/* Nav */}
      <nav className="mt-2 flex-1 space-y-0.5 px-3">
        {navItems.map((item) => (
          <button
            key={item.label}
            onClick={() => onNavigate(item.label)}
            className={cn(
              "flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-[13px] font-medium transition-all",
              active === item.label
                ? "bg-slate-100 text-slate-900"
                : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"
            )}
          >
            <item.icon className="h-4 w-4" />
            {item.label}
          </button>
        ))}
      </nav>

      {/* Status */}
      <div className="border-t border-slate-100 p-3">
        <div className="rounded-lg bg-slate-50 px-3 py-2.5">
          <div className="flex items-center gap-1.5">
            <div className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            <span className="text-[11px] font-medium text-slate-500">GA4 Vortex</span>
          </div>
          <p className="mt-0.5 text-[10px] text-slate-400">Conta 372674508</p>
        </div>
      </div>
    </aside>
  );
}
