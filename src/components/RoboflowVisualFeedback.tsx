
import React, { useRef, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { RoboflowResponse } from '@/services/roboflowService';
import { Eye, Target } from 'lucide-react';

interface RoboflowVisualFeedbackProps {
  imageUrl: string;
  detections: RoboflowResponse;
  onLandmarkAdjust?: (landmarkId: string, newPosition: { x: number; y: number }) => void;
}

export const RoboflowVisualFeedback: React.FC<RoboflowVisualFeedbackProps> = ({
  imageUrl,
  detections,
  onLandmarkAdjust
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);

  useEffect(() => {
    if (detections && imageUrl) {
      drawDetections();
    }
  }, [detections, imageUrl]);

  const drawDetections = () => {
    const canvas = canvasRef.current;
    const image = imageRef.current;
    
    if (!canvas || !image) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const drawCanvas = () => {
      // Ajustar canvas para o tamanho da imagem
      canvas.width = image.naturalWidth;
      canvas.height = image.naturalHeight;

      // Desenhar a imagem
      ctx.drawImage(image, 0, 0);

      // Desenhar as detecções
      detections.predictions.forEach((detection, index) => {
        const { x, y, width, height, class: className, confidence } = detection;

        // Configurar estilo para bounding box
        ctx.strokeStyle = getColorForClass(className);
        ctx.lineWidth = 3;
        ctx.fillStyle = getColorForClass(className, 0.2);

        // Desenhar bounding box
        ctx.fillRect(x - width/2, y - height/2, width, height);
        ctx.strokeRect(x - width/2, y - height/2, width, height);

        // Desenhar ponto central
        ctx.fillStyle = getColorForClass(className);
        ctx.beginPath();
        ctx.arc(x, y, 5, 0, 2 * Math.PI);
        ctx.fill();

        // Desenhar label
        const label = `${className} (${(confidence * 100).toFixed(1)}%)`;
        ctx.fillStyle = 'white';
        ctx.font = '14px Arial';
        const textWidth = ctx.measureText(label).width;
        
        // Background do texto
        ctx.fillStyle = getColorForClass(className);
        ctx.fillRect(x - textWidth/2 - 4, y - height/2 - 25, textWidth + 8, 20);
        
        // Texto
        ctx.fillStyle = 'white';
        ctx.textAlign = 'center';
        ctx.fillText(label, x, y - height/2 - 10);
      });
    };

    // Aguardar o carregamento da imagem
    image.onload = drawCanvas;

    // Se a imagem já está carregada
    if (image.complete) {
      drawCanvas();
    }
  };

  const getColorForClass = (className: string, alpha: number = 1): string => {
    const colors: { [key: string]: string } = {
      'mamilo_direito': `rgba(255, 0, 0, ${alpha})`,
      'mamilo_esquerdo': `rgba(0, 255, 0, ${alpha})`,
      'base_mama_direita': `rgba(0, 0, 255, ${alpha})`,
      'base_mama_esquerda': `rgba(255, 255, 0, ${alpha})`,
      'sulco_inframamario_direito': `rgba(255, 0, 255, ${alpha})`,
      'sulco_inframamario_esquerdo': `rgba(0, 255, 255, ${alpha})`,
      'linha_media': `rgba(128, 128, 128, ${alpha})`,
      'ruler': `rgba(255, 165, 0, ${alpha})`,
      'regua': `rgba(255, 165, 0, ${alpha})`
    };

    return colors[className] || `rgba(128, 128, 128, ${alpha})`;
  };

  const handleCanvasClick = (event: React.MouseEvent<HTMLCanvasElement>) => {
    if (!onLandmarkAdjust) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    const x = (event.clientX - rect.left) * scaleX;
    const y = (event.clientY - rect.top) * scaleY;

    // Encontrar o landmark mais próximo do clique
    let closestLandmark = null;
    let minDistance = Infinity;

    detections.predictions.forEach((detection, index) => {
      const distance = Math.sqrt(
        Math.pow(detection.x - x, 2) + Math.pow(detection.y - y, 2)
      );
      
      if (distance < minDistance && distance < 50) { // Threshold de 50 pixels
        minDistance = distance;
        closestLandmark = { id: detection.class, index };
      }
    });

    if (closestLandmark) {
      onLandmarkAdjust(closestLandmark.id, { x, y });
    }
  };

  return (
    <Card className="futuristic-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <Eye className="h-5 w-5" />
          Feedback Visual - Landmarks Detectados
          <Badge variant="secondary" className="bg-green-500/30 text-green-100 border-green-400/30">
            {detections.predictions.length} detectados
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="relative">
          <img
            ref={imageRef}
            src={imageUrl}
            alt="Imagem analisada"
            className="hidden"
            crossOrigin="anonymous"
          />
          <canvas
            ref={canvasRef}
            onClick={handleCanvasClick}
            className="max-w-full h-auto border border-blue-400/30 rounded-lg cursor-crosshair"
            style={{ maxHeight: '600px' }}
          />
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
          {detections.predictions.map((detection, index) => (
            <div key={index} className="flex items-center gap-2 p-2 bg-blue-500/20 rounded-lg">
              <div 
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: getColorForClass(detection.class) }}
              />
              <div className="text-xs text-white">
                <div className="font-medium">{detection.class}</div>
                <div className="text-blue-200">{(detection.confidence * 100).toFixed(1)}%</div>
              </div>
            </div>
          ))}
        </div>

        {onLandmarkAdjust && (
          <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-3">
            <div className="flex items-center gap-2 text-sm text-blue-200">
              <Target className="h-4 w-4" />
              Clique próximo a um landmark para ajustar sua posição manualmente
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
