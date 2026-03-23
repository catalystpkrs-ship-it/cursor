"use client";

import { ga4ChannelData } from "@/lib/windsor";

export function ChannelTable() {
  const sorted = [...ga4ChannelData].sort((a, b) => b.sessions - a.sessions);

  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-4">
        <h2 className="text-lg font-semibold text-slate-800">
          Performance por Canal
        </h2>
        <p className="text-sm text-slate-500">
          GA4 Vortex · Últimos 30 dias
        </p>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100">
              <th className="pb-3 text-left font-medium text-slate-500">
                Canal
              </th>
              <th className="pb-3 text-right font-medium text-slate-500">
                Sessões
              </th>
              <th className="pb-3 text-right font-medium text-slate-500">
                View Item
              </th>
              <th className="pb-3 text-right font-medium text-slate-500">
                Add to Cart
              </th>
              <th className="pb-3 text-right font-medium text-slate-500">
                Checkout
              </th>
              <th className="pb-3 text-right font-medium text-slate-500">
                Purchase
              </th>
              <th className="pb-3 text-right font-medium text-slate-500">
                Receita
              </th>
              <th className="pb-3 text-right font-medium text-slate-500">
                Conv. Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {sorted.map((ch) => {
              const convRate = ch.sessions > 0
                ? ((ch.ecommerce_purchases / ch.sessions) * 100).toFixed(2)
                : "0.00";
              return (
                <tr
                  key={ch.session_default_channel_group}
                  className="border-b border-slate-50 transition-colors hover:bg-slate-50"
                >
                  <td className="py-3 font-medium text-slate-700">
                    {ch.session_default_channel_group}
                  </td>
                  <td className="py-3 text-right text-slate-600">
                    {ch.sessions.toLocaleString("pt-BR")}
                  </td>
                  <td className="py-3 text-right text-slate-600">
                    {ch.item_view_events.toLocaleString("pt-BR")}
                  </td>
                  <td className="py-3 text-right text-slate-600">
                    {ch.add_to_carts.toLocaleString("pt-BR")}
                  </td>
                  <td className="py-3 text-right text-slate-600">
                    {ch.checkouts.toLocaleString("pt-BR")}
                  </td>
                  <td className="py-3 text-right text-slate-600">
                    {ch.ecommerce_purchases.toLocaleString("pt-BR")}
                  </td>
                  <td className="py-3 text-right text-slate-600">
                    R$ {ch.purchase_revenue.toLocaleString("pt-BR", { minimumFractionDigits: 2 })}
                  </td>
                  <td className="py-3 text-right font-semibold text-indigo-600">
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
