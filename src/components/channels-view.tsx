"use client";

import { ChannelTable } from "@/components/channel-table";
import { GlobalFilter } from "@/components/global-filter";
import { ga4ChannelData } from "@/lib/windsor";

function ChannelCards() {
  const sorted = [...ga4ChannelData].sort((a, b) => b.purchase_revenue - a.purchase_revenue).slice(0, 6);
  const totalRevenue = ga4ChannelData.reduce((a, b) => a + b.purchase_revenue, 0);

  return (
    <div className="grid grid-cols-2 gap-3 lg:grid-cols-3">
      {sorted.map((ch) => {
        const convRate = ch.sessions > 0 ? (ch.ecommerce_purchases / ch.sessions) * 100 : 0;
        const revenueShare = (ch.purchase_revenue / totalRevenue) * 100;
        const aov = ch.ecommerce_purchases > 0 ? ch.purchase_revenue / ch.ecommerce_purchases : 0;

        return (
          <div key={ch.session_default_channel_group} className="rounded-2xl border border-slate-200 bg-white p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-bold text-slate-800">{ch.session_default_channel_group}</h3>
              <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                {revenueShare.toFixed(0)}%
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-2">
              <div>
                <p className="text-[10px] text-slate-400">Sessões</p>
                <p className="text-sm font-bold text-slate-800">{(ch.sessions / 1000).toFixed(1)}k</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Receita</p>
                <p className="text-sm font-bold text-emerald-600">R$ {(ch.purchase_revenue / 1000).toFixed(1)}k</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Conv. Rate</p>
                <p className="text-xs font-bold text-indigo-600">{convRate.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-[10px] text-slate-400">Ticket Médio</p>
                <p className="text-xs font-bold text-slate-600">R$ {aov.toFixed(0)}</p>
              </div>
            </div>
            <div className="mt-3 h-1 w-full overflow-hidden rounded-full bg-slate-100">
              <div className="h-full rounded-full bg-indigo-400" style={{ width: `${revenueShare}%` }} />
            </div>
          </div>
        );
      })}
    </div>
  );
}

export function ChannelsView() {
  const totalRevenue = ga4ChannelData.reduce((a, b) => a + b.purchase_revenue, 0);
  const totalPurchases = ga4ChannelData.reduce((a, b) => a + b.ecommerce_purchases, 0);
  const totalSessions = ga4ChannelData.reduce((a, b) => a + b.sessions, 0);

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">Canais</h1>
          <p className="text-xs text-slate-400">Performance por canal de aquisição</p>
        </div>
        <GlobalFilter />
      </div>

      {/* Summary */}
      <div className="flex items-center gap-3">
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
          <span className="text-[10px] text-slate-400">Receita Total</span>
          <p className="text-sm font-bold text-emerald-600">R$ {(totalRevenue / 1000).toFixed(1)}k</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
          <span className="text-[10px] text-slate-400">Compras</span>
          <p className="text-sm font-bold text-slate-800">{totalPurchases}</p>
        </div>
        <div className="rounded-xl border border-slate-200 bg-white px-4 py-2">
          <span className="text-[10px] text-slate-400">Conv. Geral</span>
          <p className="text-sm font-bold text-indigo-600">{((totalPurchases / totalSessions) * 100).toFixed(2)}%</p>
        </div>
      </div>

      <ChannelCards />
      <ChannelTable />
    </div>
  );
}
