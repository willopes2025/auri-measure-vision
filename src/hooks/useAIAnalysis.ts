
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface AIAnalysisParams {
  imageUrl?: string;
  measurements?: any;
  patientInfo?: any;
}

export const useAIAnalysis = () => {
  const [loading, setLoading] = useState(false);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const { toast } = useToast();

  const analyzeWithAI = async (params: AIAnalysisParams) => {
    try {
      setLoading(true);
      console.log('Iniciando análise com IA:', params);

      const { data, error } = await supabase.functions.invoke('analyze-image', {
        body: params
      });

      if (error) {
        console.error('Erro na função:', error);
        throw error;
      }

      if (data?.error) {
        throw new Error(data.error);
      }

      console.log('Análise recebida:', data);
      setAnalysis(data.analysis);
      
      toast({
        title: "Análise Concluída",
        description: "A IA analisou os dados com sucesso",
      });

      return { analysis: data.analysis, error: null };
    } catch (error) {
      console.error('Erro na análise com IA:', error);
      toast({
        title: "Erro na Análise",
        description: "Não foi possível analisar com a IA",
        variant: "destructive",
      });
      return { analysis: null, error };
    } finally {
      setLoading(false);
    }
  };

  const clearAnalysis = () => {
    setAnalysis(null);
  };

  return {
    loading,
    analysis,
    analyzeWithAI,
    clearAnalysis
  };
};
