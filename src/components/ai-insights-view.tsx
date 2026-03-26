"use client";

import { cn } from "@/lib/utils";
import {
  ga4ChannelData,
  getAggregatedFunnel,
  getKPIs,
} from "@/lib/windsor";
import { Bot, Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

function generateFallbackInsights(): string {
  const funnel = getAggregatedFunnel();
  const channels = ga4ChannelData.slice(0, 5);

  const dropOffs = funnel.slice(0, -1).map((step, i) => {
    const next = funnel[i + 1];
    return {
      from: step.label,
      to: next.label,
      rate: ((step.value - next.value) / step.value * 100).toFixed(1),
      lost: step.value - next.value,
    };
  });

  const worstDrop = dropOffs.reduce((max, d) => parseFloat(d.rate) > parseFloat(max.rate) ? d : max, dropOffs[0]);
  const overallRate = ((funnel[4].value / funnel[0].value) * 100).toFixed(2);

  const topConvChannel = [...channels].sort((a, b) => {
    const convA = a.sessions > 0 ? a.ecommerce_purchases / a.sessions : 0;
    const convB = b.sessions > 0 ? b.ecommerce_purchases / b.sessions : 0;
    return convB - convA;
  })[0];

  return `## 🔍 Maior Gargalo Atual

O maior gargalo está na etapa **${worstDrop.from} → ${worstDrop.to}**, com drop-off de **${worstDrop.rate}%** — **${worstDrop.lost.toLocaleString("pt-BR")} usuários perdidos**.

A taxa de conversão geral do funil é de **${overallRate}%**.

## 💡 Motivo Provável

1. **Fricção na navegação**: Muitos usuários chegam mas não interagem com produtos. Landing pages podem ter problemas de relevância ou velocidade.
2. **Barreiras no checkout**: Falta de opções de pagamento, frete caro ou processo complexo.
3. **Concentração de canal**: O canal com melhor conversão é **${topConvChannel.session_default_channel_group}** (${(topConvChannel.ecommerce_purchases / topConvChannel.sessions * 100).toFixed(2)}%).

## ✅ Plano de Ação

1. **Otimizar landing pages**: Testes A/B nas páginas de entrada. Banners com categorias mais vendidas acima da dobra. Impacto: +15-20% em View Item.

2. **Mini-cart lateral**: Adicionar ao carrinho sem sair da página do produto. Impacto: +25% na conversão Add to Cart → Checkout.

3. **Checkout 1 página**: Eliminar etapas, Pix com 5% desconto, selos de segurança. Impacto: +10-15% na conversão final.

4. **Investir em ${topConvChannel.session_default_channel_group}**: Realocar 15-20% do orçamento de canais com menor conversão.

5. **Remarketing de carrinho**: E-mails automáticos (1h, 24h, 72h). Recuperação média: 8-12% dos abandonos.`;
}

export function AIInsightsView() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [source, setSource] = useState<"api" | "local" | "">("");

  const generateInsights = useCallback(async () => {
    setLoading(true);
    setContent("");
    setSource("");

    try {
      const response = await fetch("/api/insights", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          funnelData: getAggregatedFunnel(),
          channelData: ga4ChannelData.slice(0, 7),
          kpiData: getKPIs(),
        }),
      });

      if (!response.ok) {
        setContent(generateFallbackInsights());
        setSource("local");
        return;
      }

      setSource("api");
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let accumulated = "";

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          const chunk = decoder.decode(value, { stream: true });
          for (const line of chunk.split("\n")) {
            if (line.startsWith("0:")) {
              try {
                accumulated += JSON.parse(line.slice(2));
                setContent(accumulated);
              } catch { /* skip */ }
            }
          }
        }
      }
    } catch {
      setContent(generateFallbackInsights());
      setSource("local");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!content && !loading) generateInsights();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-5">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-lg font-bold text-slate-900">AI Insights</h1>
          <p className="text-xs text-slate-400">Análise inteligente de CRO</p>
        </div>
        <button
          onClick={generateInsights}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2 text-xs font-semibold text-white hover:bg-slate-800 disabled:opacity-50"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", loading && "animate-spin")} />
          Regenerar
        </button>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
        <div className="flex items-center gap-3 border-b border-slate-100 bg-slate-900 px-6 py-3">
          <Bot className="h-5 w-5 text-white" />
          <div>
            <p className="text-xs font-semibold text-white">Virvel AI — CRO Expert</p>
            <p className="text-[10px] text-slate-400">
              {source === "api" ? "Claude AI" : source === "local" ? "Análise Local" : "Analisando..."}
            </p>
          </div>
          {source === "local" && (
            <span className="ml-auto rounded-full bg-slate-700 px-2.5 py-0.5 text-[10px] text-slate-300">
              Sem API key
            </span>
          )}
        </div>

        <div className="p-6">
          {loading && !content && (
            <div className="flex flex-col items-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-slate-300" />
              <p className="mt-3 text-xs text-slate-400">Analisando dados do GA4...</p>
            </div>
          )}

          {content && (
            <div className="prose prose-sm prose-slate max-w-none">
              <div
                className="space-y-3 text-sm leading-relaxed text-slate-600"
                dangerouslySetInnerHTML={{ __html: formatMarkdown(content) }}
              />
              {loading && <span className="inline-block h-4 w-1.5 animate-pulse rounded-sm bg-slate-900" />}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatMarkdown(text: string): string {
  return text
    .replace(/## (.*)/g, '<h3 class="text-base font-bold text-slate-900 mt-6 mb-2">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-900">$1</strong>')
    .replace(/^\d+\.\s(.*)/gm, '<li class="ml-4 list-decimal py-1">$1</li>')
    .replace(/^- (.*)/gm, '<li class="ml-4 list-disc py-0.5">$1</li>')
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}
