import { ChannelTable } from "@/components/channel-table";
import { FunnelChart } from "@/components/funnel-chart";
import { GlobalFilter } from "@/components/global-filter";
import { KPICards } from "@/components/kpi-cards";
import { Sidebar } from "@/components/sidebar";

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

        <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-2">
          <FunnelChart />
          <ChannelTable />
        </div>

        <div className="mt-6 rounded-xl border-2 border-dashed border-slate-200 bg-white/50 p-8 text-center">
          <p className="text-sm font-medium text-slate-400">
            Conexão GA4 — Pronto para integração
          </p>
          <p className="mt-1 text-xs text-slate-400">
            A estrutura está preparada para receber dados reais da Google
            Analytics Data API
          </p>
        </div>
      </main>
    </div>
  );
}
