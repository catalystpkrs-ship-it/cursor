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
      <div className="flex h-[420px] items-center justify-center rounded-xl border border-slate-200 bg-white">
        <div className="text-center">
          <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-indigo-200 border-t-indigo-500" />
          <p className="mt-3 text-sm text-slate-500">Carregando funil 3D...</p>
        </div>
      </div>
    ),
  }
);

function DashboardView() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Dashboard</h1>
        <p className="text-sm text-slate-500">
          Visão geral do funil de conversão e-commerce
        </p>
      </div>

      <GlobalFilter />

      <div className="mt-6">
        <KPICards />
      </div>

      <div className="mt-6">
        <Funnel3D />
      </div>

      <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
        <FunnelChart />
        <ChannelTable />
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50/50 px-4 py-3">
        <span className="text-xs font-medium text-emerald-600">
          Dados reais do GA4 Vortex via Windsor.ai · Conta 372674508 · Últimos 30 dias
        </span>
      </div>
    </>
  );
}

function TrendsView() {
  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Tendências</h1>
        <p className="text-sm text-slate-500">
          Evolução das métricas ao longo dos últimos 30 dias
        </p>
      </div>
      <TrendsChart />
    </>
  );
}

function ConfigView() {
  return (
    <div className="flex flex-col items-center justify-center py-20">
      <div className="rounded-xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-slate-100">
          <span className="text-2xl">⚙️</span>
        </div>
        <h2 className="text-lg font-semibold text-slate-800">Configurações</h2>
        <p className="mt-2 text-sm text-slate-500">
          Em breve: configurações de conta, integrações e preferências.
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
      <main className="ml-64 flex-1 p-8">
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
