
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Camera, Upload, Brain, Zap, Settings, Loader2 } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useMeasurements } from '@/hooks/useMeasurements';
import { useRoboflow } from '@/hooks/useRoboflow';
import { RoboflowVisualFeedback } from './RoboflowVisualFeedback';

export const RoboflowIntegratedForm: React.FC = () => {
  const { patients } = usePatients();
  const { addMeasurement } = useMeasurements();
  const { isAnalyzing, detections, extractedMeasurements, analyzeWithRoboflow } = useRoboflow();
  
  const [selectedPatient, setSelectedPatient] = useState('');
  const [scaleMethod, setScaleMethod] = useState<'lidar' | 'ruler' | 'auto'>('auto');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [roboflowConfig, setRoboflowConfig] = useState({
    apiKey: '',
    modelEndpoint: '',
    enabled: false
  });
  const [manualMeasurements, setManualMeasurements] = useState({
    distancia_intermamilar: 0,
    altura_mamilo_sulco: 0,
    projecao_mamaria: 0,
    largura_base_mama: 0,
    altura_mama: 0,
  });
  const [cmPerPixel, setCmPerPixel] = useState<number>(0.1);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleRoboflowAnalysis = async () => {
    if (!imageFile || !roboflowConfig.apiKey || !roboflowConfig.modelEndpoint) {
      alert('Configure o Roboflow e selecione uma imagem primeiro');
      return;
    }

    const result = await analyzeWithRoboflow(
      imageFile,
      roboflowConfig.apiKey,
      roboflowConfig.modelEndpoint,
      scaleMethod === 'auto' ? undefined : cmPerPixel
    );

    if (result && result.measurements) {
      // Preencher medições automaticamente
      setManualMeasurements(result.measurements);
      if (result.cmPerPixel) {
        setCmPerPixel(result.cmPerPixel);
      }
    }
  };

  const handleMeasurementChange = (key: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setManualMeasurements(prev => ({ ...prev, [key]: numValue }));
  };

  const handleLandmarkAdjust = (landmarkId: string, newPosition: { x: number; y: number }) => {
    console.log('Ajustando landmark:', landmarkId, 'para posição:', newPosition);
    // Aqui você pode implementar a lógica para recalcular medições baseado na nova posição
  };

  const handleSubmit = async () => {
    if (!selectedPatient) {
      alert('Selecione um paciente');
      return;
    }

    setIsSubmitting(true);
    try {
      const measurementData = {
        patient_id: selectedPatient,
        scale_method: scaleMethod,
        measurements_data: manualMeasurements,
        ai_observations: detections ? `Análise automática com Roboflow: ${detections.predictions.length} landmarks detectados` : null,
        image_url: imageUrl || null
      };

      const measurementValues = Object.entries(manualMeasurements).map(([type, value]) => ({
        measurement_type: type,
        value_cm: value,
      }));

      await addMeasurement(measurementData, measurementValues);

      // Reset form
      setSelectedPatient('');
      setImageFile(null);
      setImageUrl('');
      setManualMeasurements({
        distancia_intermamilar: 0,
        altura_mamilo_sulco: 0,
        projecao_mamaria: 0,
        largura_base_mama: 0,
        altura_mama: 0,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPatientData = patients.find(p => p.id === selectedPatient);

  return (
    <div className="space-y-6">
      {/* Configuração Roboflow */}
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Settings className="h-5 w-5" />
            Configuração Roboflow
            <Badge variant={roboflowConfig.enabled ? "default" : "secondary"} 
                   className={roboflowConfig.enabled ? "bg-green-500/30 text-green-100 border-green-400/30" : "bg-gray-500/30 text-gray-100 border-gray-400/30"}>
              {roboflowConfig.enabled ? 'Ativo' : 'Inativo'}
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label className="text-white">API Key do Roboflow</Label>
            <Input
              type="password"
              value={roboflowConfig.apiKey}
              onChange={(e) => setRoboflowConfig(prev => ({ ...prev, apiKey: e.target.value }))}
              placeholder="Sua API key do Roboflow"
              className="medical-input"
            />
          </div>
          <div className="space-y-2">
            <Label className="text-white">Endpoint do Modelo</Label>
            <Input
              value={roboflowConfig.modelEndpoint}
              onChange={(e) => setRoboflowConfig(prev => ({ ...prev, modelEndpoint: e.target.value }))}
              placeholder="https://detect.roboflow.com/your-model/version"
              className="medical-input"
            />
          </div>
          <div className="md:col-span-2">
            <Button
              onClick={() => setRoboflowConfig(prev => ({ ...prev, enabled: !prev.enabled }))}
              variant={roboflowConfig.enabled ? "destructive" : "default"}
              className="w-full"
            >
              {roboflowConfig.enabled ? 'Desativar' : 'Ativar'} Roboflow
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Formulário Principal */}
      <Card className="futuristic-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Camera className="h-5 w-5" />
            Nova Avaliação com IA + Roboflow
            <Badge variant="secondary" className="bg-blue-500/30 text-blue-100 border-blue-400/30">
              Automático
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Seleção de Paciente */}
          <div className="space-y-2">
            <Label className="text-white">Paciente</Label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient}>
              <SelectTrigger className="medical-input">
                <SelectValue placeholder="Selecione um paciente" />
              </SelectTrigger>
              <SelectContent>
                {patients.map((patient) => (
                  <SelectItem key={patient.id} value={patient.id}>
                    {patient.nome} - {patient.email}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Upload de Imagem */}
          <div className="space-y-2">
            <Label className="text-white">Imagem para Análise</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="medical-input"
              />
              <Button
                onClick={handleRoboflowAnalysis}
                disabled={isAnalyzing || !imageFile || !roboflowConfig.enabled}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Analisando...
                  </>
                ) : (
                  <>
                    <Zap className="h-4 w-4 mr-2" />
                    Analisar IA
                  </>
                )}
              </Button>
            </div>
          </div>

          {/* Método de Escala */}
          <div className="space-y-2">
            <Label className="text-white">Método de Escala</Label>
            <Select value={scaleMethod} onValueChange={(value: 'lidar' | 'ruler' | 'auto') => setScaleMethod(value)}>
              <SelectTrigger className="medical-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="auto">Automático (IA detecta régua)</SelectItem>
                <SelectItem value="lidar">LiDAR (iPhone 12 Pro+)</SelectItem>
                <SelectItem value="ruler">Régua Manual</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Medições */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Label className="text-white text-lg font-semibold">Medições</Label>
              {extractedMeasurements && (
                <Badge className="bg-green-500/30 text-green-100 border-green-400/30">
                  <Brain className="h-3 w-3 mr-1" />
                  Preenchido pela IA
                </Badge>
              )}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(manualMeasurements).map(([key, value]) => (
                <div key={key} className="space-y-2">
                  <Label className="text-white text-sm">
                    {key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase())} (cm)
                  </Label>
                  <Input
                    type="number"
                    step="0.1"
                    value={value || ''}
                    onChange={(e) => handleMeasurementChange(key, e.target.value)}
                    className="medical-input"
                  />
                </div>
              ))}
            </div>
          </div>

          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !selectedPatient}
            className="w-full medical-button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar Avaliação'
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Feedback Visual */}
      {detections && imageUrl && (
        <RoboflowVisualFeedback
          imageUrl={imageUrl}
          detections={detections}
          onLandmarkAdjust={handleLandmarkAdjust}
        />
      )}

      {/* Alertas e Informações */}
      {!roboflowConfig.enabled && (
        <Alert>
          <Brain className="h-4 w-4" />
          <AlertDescription>
            Configure e ative o Roboflow para análise automática de landmarks anatômicos.
            Isso permitirá detecção automática de pontos como mamilos, base da mama e sulcos.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};
