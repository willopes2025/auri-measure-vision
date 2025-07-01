
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { RoboflowService, RoboflowResponse, ExtractedMeasurements } from '@/services/roboflowService';

export const useRoboflow = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [detections, setDetections] = useState<RoboflowResponse | null>(null);
  const [extractedMeasurements, setExtractedMeasurements] = useState<ExtractedMeasurements | null>(null);
  const { toast } = useToast();

  const analyzeWithRoboflow = async (
    imageFile: File | string,
    apiKey: string,
    modelEndpoint: string,
    cmPerPixel?: number
  ) => {
    try {
      setIsAnalyzing(true);
      console.log('Iniciando análise com Roboflow:', { imageFile, modelEndpoint });

      const roboflowService = new RoboflowService(apiKey, modelEndpoint);
      const response = await roboflowService.analyzeImage(imageFile);
      
      console.log('Resposta do Roboflow:', response);
      setDetections(response);

      // Calcular escala se não fornecida
      let finalCmPerPixel = cmPerPixel;
      if (!finalCmPerPixel) {
        const calculatedScale = roboflowService.calculateScaleFromRuler(response.predictions);
        if (calculatedScale) {
          finalCmPerPixel = calculatedScale;
          console.log('Escala calculada automaticamente:', finalCmPerPixel);
        } else {
          finalCmPerPixel = 0.1; // Valor padrão de fallback
          console.warn('Não foi possível calcular escala, usando valor padrão');
        }
      }

      // Extrair medições dos landmarks detectados
      const measurements = roboflowService.convertDetectionsToMeasurements(
        response.predictions,
        finalCmPerPixel,
        response.image.width,
        response.image.height
      );

      console.log('Medições extraídas:', measurements);
      setExtractedMeasurements(measurements);

      toast({
        title: "Análise Concluída",
        description: `${response.predictions.length} landmarks detectados com sucesso`,
      });

      return { detections: response, measurements, cmPerPixel: finalCmPerPixel };
    } catch (error) {
      console.error('Erro na análise com Roboflow:', error);
      toast({
        title: "Erro na Análise",
        description: "Não foi possível analisar a imagem com Roboflow",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsAnalyzing(false);
    }
  };

  const clearAnalysis = () => {
    setDetections(null);
    setExtractedMeasurements(null);
  };

  return {
    isAnalyzing,
    detections,
    extractedMeasurements,
    analyzeWithRoboflow,
    clearAnalysis
  };
};
