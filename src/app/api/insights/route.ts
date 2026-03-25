import { createAnthropic } from "@ai-sdk/anthropic";
import { streamText } from "ai";

export async function POST(req: Request) {
  const apiKey = process.env.ANTHROPIC_API_KEY;

  if (!apiKey) {
    return new Response("API key not configured", { status: 401 });
  }

  const anthropic = createAnthropic({ apiKey });

  const { funnelData, channelData, kpiData } = await req.json();

  const result = streamText({
    model: anthropic("claude-sonnet-4-20250514"),
    system: `Você é uma especialista sênior em CRO (Conversion Rate Optimization) para e-commerce de calçados no Brasil.
Você analisa dados de funil do Google Analytics 4 e fornece insights acionáveis.

Sempre responda em português brasileiro. Seja direta, prática e use dados específicos nos seus insights.
Formate sua resposta EXATAMENTE nesta estrutura usando markdown:

## 🔍 Maior Gargalo Atual
[Identifique a etapa do funil com maior drop-off e quantifique o impacto]

## 💡 Motivo Provável
[Analise as causas mais prováveis baseada nos dados e padrões do mercado de calçados]

## ✅ Plano de Ação
[Liste 3-5 sugestões práticas e específicas, numeradas, com estimativa de impacto quando possível]`,
    prompt: `Analise estes dados reais do GA4 do nosso e-commerce de calçados e me dê seus insights de CRO:

**Dados do Funil (últimos 30 dias vs período anterior):**
${JSON.stringify(funnelData, null, 2)}

**Performance por Canal:**
${JSON.stringify(channelData, null, 2)}

**KPIs Principais:**
${JSON.stringify(kpiData, null, 2)}

Foque especialmente em:
1. Qual etapa do funil tem o maior drop-off percentual
2. Quais canais estão performando abaixo do esperado
3. O que mudou em relação ao período anterior e por quê
4. Ações concretas que podemos executar esta semana`,
  });

  return result.toTextStreamResponse();
}
