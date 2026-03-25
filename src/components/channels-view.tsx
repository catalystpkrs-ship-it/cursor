"use client";

import { ChannelTable } from "@/components/channel-table";
import { ga4ChannelData } from "@/lib/windsor";


function ChannelCards() {
  const sorted = [...ga4ChannelData].sort((a, b) => b.sessions - a.sessions).slice(0, 6);
  const totalSessions = ga4ChannelData.reduce((a, b) => a + b.sessions, 0);
  const totalRevenue = ga4ChannelData.reduce((a, b) => a + b.purchase_revenue, 0);

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {sorted.map((ch) => {
        const convRate = ch.sessions > 0 ? (ch.ecommerce_purchases / ch.sessions) * 100 : 0;
        const sessionShare = (ch.sessions / totalSessions) * 100;
        const revenueShare = (ch.purchase_revenue / totalRevenue) * 100;
        const aov = ch.ecommerce_purchases > 0 ? ch.purchase_revenue / ch.ecommerce_purchases : 0;

        return (
          <div key={ch.session_default_channel_group} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold text-slate-800">{ch.session_default_channel_group}</h3>
              <span className="rounded-full bg-indigo-50 px-2 py-0.5 text-xs font-medium text-indigo-600">
                {sessionShare.toFixed(1)}% tráfego
              </span>
            </div>
            <div className="mt-3 grid grid-cols-2 gap-3">
              <div>
                <p className="text-xs text-slate-500">Sessões</p>
                <p className="text-lg font-bold text-slate-800">{ch.sessions.toLocaleString("pt-BR")}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Receita</p>
                <p className="text-lg font-bold text-emerald-600">
                  R$ {(ch.purchase_revenue / 1000).toFixed(1)}k
                </p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Conv. Rate</p>
                <p className="text-sm font-semibold text-indigo-600">{convRate.toFixed(2)}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500">Ticket Médio</p>
                <p className="text-sm font-semibold text-slate-700">
                  R$ {aov.toFixed(0)}
                </p>
              </div>
            </div>
            <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
              <div
                className="h-full rounded-full bg-indigo-500"
                style={{ width: `${revenueShare}%` }}
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">{revenueShare.toFixed(1)}% da receita total</p>
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
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Performance por Canal</h1>
          <p className="text-sm text-slate-500">Análise detalhada de cada canal de aquisição</p>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-2">
            <span className="text-slate-500">Receita Total: </span>
            <span className="font-bold text-emerald-600">
              R$ {totalRevenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
            </span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-2">
            <span className="text-slate-500">Compras: </span>
            <span className="font-bold text-slate-800">{totalPurchases.toLocaleString("pt-BR")}</span>
          </div>
          <div className="rounded-lg border border-slate-200 bg-white px-4 py-2">
            <span className="text-slate-500">Conv. Geral: </span>
            <span className="font-bold text-indigo-600">
              {((totalPurchases / totalSessions) * 100).toFixed(2)}%
            </span>
          </div>
        </div>
      </div>

      <ChannelCards />
      <ChannelTable />
    </div>
  );
}
