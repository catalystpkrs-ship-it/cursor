"use client";

import { cn } from "@/lib/utils";
import {
  ga4ChannelData,
  getAggregatedFunnel,
  getKPIs,
} from "@/lib/windsor";
import { Bot, Loader2, RefreshCw, Sparkles, X } from "lucide-react";
import { useCallback, useState } from "react";

export function AIInsights() {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [content, setContent] = useState("");
  const [error, setError] = useState("");

  const generateInsights = useCallback(async () => {
    setLoading(true);
    setContent("");
    setError("");

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
        throw new Error(
          response.status === 401
            ? "API key da Anthropic não configurada. Adicione ANTHROPIC_API_KEY no .env.local"
            : `Erro ${response.status}: ${response.statusText}`
        );
      }

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
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erro ao gerar insights");
    } finally {
      setLoading(false);
    }
  }, []);

  const handleOpen = useCallback(() => {
    setOpen(true);
    if (!content && !loading) {
      generateInsights();
    }
  }, [content, loading, generateInsights]);

  return (
    <>
      {/* Floating trigger button */}
      <button
        onClick={handleOpen}
        className={cn(
          "fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full px-5 py-3 font-medium text-white shadow-lg transition-all hover:scale-105 hover:shadow-xl",
          "bg-gradient-to-r from-indigo-500 to-violet-500"
        )}
      >
        <Sparkles className="h-5 w-5" />
        Virvel AI Insights
      </button>

      {/* Side panel */}
      <div
        className={cn(
          "fixed right-0 top-0 z-50 h-full w-[480px] transform border-l border-slate-200 bg-white shadow-2xl transition-transform duration-300 ease-out",
          open ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-slate-200 bg-gradient-to-r from-indigo-500 to-violet-500 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/20">
              <Bot className="h-5 w-5 text-white" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Virvel AI Insights</h2>
              <p className="text-xs text-white/70">CRO Expert · E-commerce de Calçados</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={generateInsights}
              disabled={loading}
              className="rounded-lg bg-white/20 p-2 text-white transition-colors hover:bg-white/30 disabled:opacity-50"
              title="Regenerar insights"
            >
              <RefreshCw className={cn("h-4 w-4", loading && "animate-spin")} />
            </button>
            <button
              onClick={() => setOpen(false)}
              className="rounded-lg bg-white/20 p-2 text-white transition-colors hover:bg-white/30"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="h-[calc(100vh-73px)] overflow-y-auto p-6">
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

          {!loading && !content && !error && (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <Sparkles className="h-10 w-10 text-indigo-300" />
              <p className="mt-4 text-sm font-medium text-slate-600">
                Pronto para analisar
              </p>
              <p className="mt-1 text-xs text-slate-400">
                Clique em regenerar para iniciar a análise
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/20 backdrop-blur-sm"
          onClick={() => setOpen(false)}
        />
      )}
    </>
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
