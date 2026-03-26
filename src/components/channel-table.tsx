"use client";

import { ga4ChannelData } from "@/lib/windsor";

export function ChannelTable() {
  const sorted = [...ga4ChannelData].sort((a, b) => b.sessions - a.sessions);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5">
      <h3 className="mb-4 text-sm font-semibold text-slate-800">Performance por Canal</h3>
      <div className="overflow-x-auto">
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-2.5 text-left font-medium text-slate-400">Canal</th>
              <th className="pb-2.5 text-right font-medium text-slate-400">Sessões</th>
              <th className="pb-2.5 text-right font-medium text-slate-400">Compras</th>
              <th className="pb-2.5 text-right font-medium text-slate-400">Receita</th>
              <th className="pb-2.5 text-right font-medium text-slate-400">Conv.</th>
            </tr>
          </thead>
          <tbody>
            {sorted.slice(0, 8).map((ch) => {
              const convRate = ch.sessions > 0
                ? ((ch.ecommerce_purchases / ch.sessions) * 100).toFixed(2)
                : "0.00";
              return (
                <tr
                  key={ch.session_default_channel_group}
                  className="border-b border-slate-50 last:border-0"
                >
                  <td className="py-2.5 font-medium text-slate-700">
                    {ch.session_default_channel_group}
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-slate-500">
                    {ch.sessions.toLocaleString("pt-BR")}
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-slate-500">
                    {ch.ecommerce_purchases}
                  </td>
                  <td className="py-2.5 text-right tabular-nums text-slate-500">
                    R$ {(ch.purchase_revenue / 1000).toFixed(1)}k
                  </td>
                  <td className="py-2.5 text-right font-semibold text-indigo-600">
                    {convRate}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
