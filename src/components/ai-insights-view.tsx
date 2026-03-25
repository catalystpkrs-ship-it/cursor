"use client";

import { cn } from "@/lib/utils";
import {
  ga4ChannelData,
  getAggregatedFunnel,
  getKPIs,
} from "@/lib/windsor";
import { Bot, Loader2, RefreshCw } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

// Fallback insights when no API key is configured
function generateFallbackInsights(): string {
  const funnel = getAggregatedFunnel();
  const channels = ga4ChannelData.slice(0, 5);

  const sessionsChange = ((funnel[0].value - funnel[0].previousValue) / funnel[0].previousValue * 100).toFixed(1);
  const purchaseChange = ((funnel[4].value - funnel[4].previousValue) / funnel[4].previousValue * 100).toFixed(1);

  // Calculate drop-offs
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

  const topChannel = channels[0];
  const topConvChannel = [...channels].sort((a, b) => {
    const convA = a.sessions > 0 ? a.ecommerce_purchases / a.sessions : 0;
    const convB = b.sessions > 0 ? b.ecommerce_purchases / b.sessions : 0;
    return convB - convA;
  })[0];

  return `## 🔍 Maior Gargalo Atual

O maior gargalo do funil está na etapa **${worstDrop.from} → ${worstDrop.to}**, com um drop-off de **${worstDrop.rate}%** — isso representa **${worstDrop.lost.toLocaleString("pt-BR")} usuários perdidos** nessa transição.

A taxa de conversão geral do funil é de **${overallRate}%**. As sessões tiveram variação de **${sessionsChange}%** e as compras de **${purchaseChange}%** em relação ao período anterior.

## 💡 Motivo Provável

1. **Fricção na navegação**: Muitos usuários chegam ao site mas não interagem com os produtos. Pode indicar problemas de relevância nas landing pages ou velocidade de carregamento.
2. **Falta de confiança no checkout**: A taxa de ${worstDrop.from} para ${worstDrop.to} sugere que os usuários encontram barreiras como falta de opções de pagamento, frete caro ou processo complexo.
3. **Dependência de canal**: O canal **${topChannel.session_default_channel_group}** concentra ${((topChannel.sessions / funnel[0].value) * 100).toFixed(0)}% do tráfego. Já o canal com melhor taxa de conversão é **${topConvChannel.session_default_channel_group}** (${(topConvChannel.ecommerce_purchases / topConvChannel.sessions * 100).toFixed(2)}%).

## ✅ Plano de Ação

1. **Otimizar landing pages**: Implementar testes A/B nas páginas de entrada dos principais canais. Adicionar banners com categorias mais vendidas acima da dobra. Impacto estimado: +15-20% em View Item.

2. **Implementar carrinho lateral (mini-cart)**: Permitir que o usuário adicione ao carrinho sem sair da página do produto. Reduz fricção e pode aumentar a conversão Add to Cart → Checkout em até 25%.

3. **Simplificar o checkout para 1 página**: Eliminar etapas desnecessárias, oferecer Pix com desconto de 5%, e adicionar selos de segurança visíveis. Impacto estimado: +10-15% na conversão final.

4. **Investir mais no canal ${topConvChannel.session_default_channel_group}**: Este canal tem a melhor taxa de conversão. Realocar 15-20% do orçamento de canais com menor conversão para ampliar esse canal.

5. **Implementar remarketing de carrinho abandonado**: Configurar e-mails automáticos (1h, 24h, 72h) para usuários que adicionaram ao carrinho mas não finalizaram. Média de recuperação: 8-12% dos abandonos.`;
}

export function AIInsightsView() {
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");
  const [source, setSource] = useState<"api" | "local" | "">("");

  const generateInsights = useCallback(async () => {
    setLoading(true);
    setContent("");
    setError("");
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
        // Fallback to local insights
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

          const lines = chunk.split("\n");
          for (const line of lines) {
            if (line.startsWith("0:")) {
              try {
                const text = JSON.parse(line.slice(2));
                accumulated += text;
                setContent(accumulated);
              } catch {
                // skip non-JSON lines
              }
            }
          }
        }
      }
    } catch {
      // Network error or no API - use fallback
      setContent(generateFallbackInsights());
      setSource("local");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (!content && !loading) {
      generateInsights();
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">AI Insights</h1>
          <p className="text-sm text-slate-500">
            Análise inteligente de CRO com sugestões acionáveis
          </p>
        </div>
        <button
          onClick={generateInsights}
          disabled={loading}
          className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-indigo-500 to-violet-500 px-4 py-2 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md disabled:opacity-50"
        >
          <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
          Regenerar Análise
        </button>
      </div>

      <div className="rounded-xl border border-slate-200 bg-white shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-4 rounded-t-xl">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-white/20">
            <Bot className="h-6 w-6 text-white" />
          </div>
          <div>
            <h2 className="font-semibold text-white">Virvel AI — CRO Expert</h2>
            <p className="text-xs text-white/70">
              E-commerce de Calçados · {source === "api" ? "Claude AI" : source === "local" ? "Análise Local" : "Analisando..."}
            </p>
          </div>
          {source === "local" && (
            <span className="ml-auto rounded-full bg-white/20 px-3 py-1 text-xs text-white">
              Sem API key — usando análise local
            </span>
          )}
        </div>

        {/* Content */}
        <div className="p-6">
          {loading && !content && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
              <p className="mt-4 text-sm font-medium text-slate-600">
                Analisando dados do GA4 Vortex...
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Identificando gargalos e oportunidades de CRO
              </p>
            </div>
          )}

          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 p-4">
              <p className="text-sm font-medium text-red-800">Erro</p>
              <p className="mt-1 text-sm text-red-600">{error}</p>
            </div>
          )}

          {content && (
            <div className="prose prose-sm prose-slate max-w-none">
              <div
                className="space-y-4 text-sm leading-relaxed text-slate-700"
                dangerouslySetInnerHTML={{
                  __html: formatMarkdown(content),
                }}
              />
              {loading && (
                <span className="inline-block h-4 w-1.5 animate-pulse rounded-sm bg-indigo-500" />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function formatMarkdown(text: string): string {
  return text
    .replace(/## (.*)/g, '<h3 class="text-base font-semibold text-slate-800 mt-6 mb-2">$1</h3>')
    .replace(/\*\*(.*?)\*\*/g, '<strong class="font-semibold text-slate-800">$1</strong>')
    .replace(/^\d+\.\s(.*)/gm, '<li class="ml-4 list-decimal py-1">$1</li>')
    .replace(/^- (.*)/gm, '<li class="ml-4 list-disc py-0.5">$1</li>')
    .replace(/\n\n/g, "<br/><br/>")
    .replace(/\n/g, "<br/>");
}
