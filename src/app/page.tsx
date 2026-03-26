"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { AIInsightsView } from "@/components/ai-insights-view";
import { ChannelsView } from "@/components/channels-view";
import { ChannelTable } from "@/components/channel-table";
import { FunnelChart } from "@/components/funnel-chart";
import { FunnelView } from "@/components/funnel-view";
import { GlobalFilter } from "@/components/global-filter";
import { KPICards } from "@/components/kpi-cards";
import { Sidebar, type ViewName } from "@/components/sidebar";
import { TrendsChart } from "@/components/trends-chart";

const Funnel3D = dynamic(
  () => import("@/components/funnel-3d").then((m) => ({ default: m.Funnel3D })),
  {
    ssr: false,
    loading: () => (
      <div className="flex h-[380px] items-center justify-center rounded-2xl border border-slate-200 bg-white">
        <div className="h-6 w-6 animate-spin rounded-full border-2 border-indigo-200 border-t-indigo-500" />
      </div>
    ),
  }
);

function DashboardView() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Dashboard</h1>
          <p className="text-xs text-slate-400">Visão geral do funil e-commerce</p>
        </div>
        <GlobalFilter />
      </div>

      <KPICards />

      <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
        <div className="rounded-2xl border border-slate-200 bg-white h-[380px]">
          <Funnel3D />
        </div>
        <FunnelChart />
      </div>

      <ChannelTable />
    </div>
  );
}

function TrendsView() {
  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Tendências</h1>
          <p className="text-xs text-slate-400">Evolução das métricas nos últimos 30 dias</p>
        </div>
        <GlobalFilter />
      </div>
      <TrendsChart />
    </div>
  );
}

function ConfigView() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="rounded-2xl border border-slate-200 bg-white p-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-slate-100">
          <span className="text-xl">⚙️</span>
        </div>
        <h2 className="text-sm font-bold text-slate-800">Configurações</h2>
        <p className="mt-2 text-xs text-slate-400">
          Em breve: conta, integrações e preferências.
        </p>
      </div>
    </div>
  );
}

export default function Home() {
  const [activeView, setActiveView] = useState<ViewName>("Dashboard");

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar active={activeView} onNavigate={setActiveView} />
      <main className="ml-56 flex-1 p-6">
        {activeView === "Dashboard" && <DashboardView />}
        {activeView === "Funil" && <FunnelView />}
        {activeView === "Canais" && <ChannelsView />}
        {activeView === "Tendências" && <TrendsView />}
        {activeView === "AI Insights" && <AIInsightsView />}
        {activeView === "Config" && <ConfigView />}
      </main>
    </div>
  );
}
