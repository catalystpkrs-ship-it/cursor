"use client";

import { channelBreakdown } from "@/data/mock-funnel";

const channelLabels: Record<string, string> = {
  "meta-ads": "Meta Ads",
  "google-ads": "Google Ads",
  organic: "Orgânico",
  direct: "Direto",
};

export function ChannelTable() {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm">
      <h2 className="mb-4 text-lg font-semibold text-slate-800">
        Performance por Canal
      </h2>
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
                Conv. Rate
              </th>
            </tr>
          </thead>
          <tbody>
            {Object.entries(channelBreakdown).map(([key, steps]) => {
              const convRate = (
                (steps[4].value / steps[0].value) *
                100
              ).toFixed(2);
              return (
                <tr
                  key={key}
                  className="border-b border-slate-50 transition-colors hover:bg-slate-50"
                >
                  <td className="py-3 font-medium text-slate-700">
                    {channelLabels[key]}
                  </td>
                  {steps.map((step) => (
                    <td
                      key={step.label}
                      className="py-3 text-right text-slate-600"
                    >
                      {step.value.toLocaleString("pt-BR")}
                    </td>
                  ))}
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
