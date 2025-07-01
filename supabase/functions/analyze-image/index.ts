
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { imageUrl, measurements, patientInfo } = await req.json();

    if (!imageUrl && !measurements) {
      throw new Error('Imagem ou dados de medição são obrigatórios');
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('Chave da API OpenAI não configurada');
    }

    let prompt = `Você é um especialista em análise mamária. `;

    if (imageUrl) {
      prompt += `Analise esta imagem mamária e forneça observações técnicas detalhadas sobre:
1. Simetria e proporções
2. Contornos e formato
3. Aspectos técnicos relevantes para medição
4. Recomendações profissionais

Seja preciso, técnico e objetivo. Responda em português.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o',
          messages: [
            {
              role: 'user',
              content: [
                { type: 'text', text: prompt },
                {
                  type: 'image_url',
                  image_url: { url: imageUrl }
                }
              ]
            }
          ],
          max_tokens: 1000,
          temperature: 0.3,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erro na análise da imagem');
      }

      const data = await response.json();
      const analysis = data.choices[0].message.content;

      return new Response(JSON.stringify({ 
        analysis,
        type: 'image_analysis'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    if (measurements) {
      prompt += `Baseado nestas medições mamárias, forneça observações técnicas:
${JSON.stringify(measurements, null, 2)}

${patientInfo ? `Informações do paciente: ${JSON.stringify(patientInfo, null, 2)}` : ''}

Analise:
1. Valores das medições e sua normalidade
2. Proporções e simetria
3. Sugestões técnicas
4. Observações clínicas relevantes

Seja técnico e preciso. Responda em português.`;

      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${openAIApiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'system',
              content: 'Você é um especialista em análise de medidas mamárias. Forneça análises técnicas precisas e profissionais.'
            },
            {
              role: 'user',
              content: prompt
            }
          ],
          max_tokens: 800,
          temperature: 0.2,
        }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error?.message || 'Erro na análise das medições');
      }

      const data = await response.json();
      const analysis = data.choices[0].message.content;

      return new Response(JSON.stringify({ 
        analysis,
        type: 'measurement_analysis'
      }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

  } catch (error) {
    console.error('Erro na análise:', error);
    return new Response(JSON.stringify({ 
      error: error.message || 'Erro interno do servidor' 
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
