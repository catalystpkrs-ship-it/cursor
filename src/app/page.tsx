import dynamic from "next/dynamic";
import { AIInsights } from "@/components/ai-insights";
import { ChannelTable } from "@/components/channel-table";
import { FunnelChart } from "@/components/funnel-chart";
import { GlobalFilter } from "@/components/global-filter";
import { KPICards } from "@/components/kpi-cards";
import { Sidebar } from "@/components/sidebar";

const Funnel3D = dynamic(() => import("@/components/funnel-3d").then(m => ({ default: m.Funnel3D })), { ssr: false });

export default function Home() {
  return (
    <div className="flex min-h-screen">
      <Sidebar />
      <main className="ml-64 flex-1 p-8">
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
      </main>

      <AIInsights />
    </div>
  );
}
