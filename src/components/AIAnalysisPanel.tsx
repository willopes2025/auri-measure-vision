
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Brain, Loader2, FileText, Image, Sparkles } from 'lucide-react';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';

interface AIAnalysisPanelProps {
  imageUrl?: string;
  measurements?: any;
  patientInfo?: any;
  onAnalysisComplete?: (analysis: string) => void;
}

export const AIAnalysisPanel: React.FC<AIAnalysisPanelProps> = ({
  imageUrl,
  measurements,
  patientInfo,
  onAnalysisComplete
}) => {
  const { loading, analysis, analyzeWithAI, clearAnalysis } = useAIAnalysis();

  const handleAnalyze = async () => {
    const result = await analyzeWithAI({
      imageUrl,
      measurements,
      patientInfo
    });

    if (result.analysis && onAnalysisComplete) {
      onAnalysisComplete(result.analysis);
    }
  };

  const canAnalyze = imageUrl || measurements;

  return (
    <Card className="card-blue-gradient">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Brain className="h-5 w-5" />
          Análise com IA
          <Badge variant="secondary" className="bg-purple-500/30 text-purple-100 border-purple-400/30">
            <Sparkles className="h-3 w-3 mr-1" />
            OpenAI GPT-4
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {!canAnalyze && (
          <div className="text-center py-8">
            <Brain className="h-12 w-12 text-blue-300 mx-auto mb-4 opacity-50" />
            <p className="text-blue-200 mb-2">Nenhum dado disponível para análise</p>
            <p className="text-sm text-blue-300">
              Carregue uma imagem ou insira medições para usar a IA
            </p>
          </div>
        )}

        {canAnalyze && !analysis && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm text-blue-200">
              {imageUrl && (
                <div className="flex items-center gap-1">
                  <Image className="h-4 w-4" />
                  <span>Imagem</span>
                </div>
              )}
              {measurements && (
                <div className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  <span>Medições</span>
                </div>
              )}
            </div>
            
            <Button
              onClick={handleAnalyze}
              disabled={loading}
              className="w-full medical-button"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Analisando com IA...
                </>
              ) : (
                <>
                  <Brain className="h-4 w-4 mr-2" />
                  Analisar com IA
                </>
              )}
            </Button>
          </div>
        )}

        {analysis && (
          <div className="space-y-4">
            <div className="bg-blue-600/40 p-4 rounded-lg border border-blue-500/30">
              <h4 className="font-semibold text-white mb-2 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Análise da IA
              </h4>
              <div className="text-sm text-blue-100 whitespace-pre-wrap leading-relaxed">
                {analysis}
              </div>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleAnalyze}
                disabled={loading}
                variant="outline"
                size="sm"
                className="bg-blue-600/50 border-blue-400/50 text-white hover:bg-blue-500/70"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  'Nova Análise'
                )}
              </Button>
              <Button
                onClick={clearAnalysis}
                variant="outline"
                size="sm"
                className="bg-blue-600/50 border-blue-400/50 text-white hover:bg-blue-500/70"
              >
                Limpar
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
