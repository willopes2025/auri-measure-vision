
import React, { useState, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Camera, Save, Brain, Image, User, Upload, Zap, Loader2 } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useMeasurements } from '@/hooks/useMeasurements';
import { useRoboflow } from '@/hooks/useRoboflow';
import { useAIAnalysis } from '@/hooks/useAIAnalysis';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface MeasurementData {
  [key: string]: number;
}

export const NewMeasurementForm: React.FC = () => {
  const { patients } = usePatients();
  const { addMeasurement } = useMeasurements();
  const { isAnalyzing, detections, extractedMeasurements, analyzeWithRoboflow } = useRoboflow();
  const { loading: aiLoading, analysis, analyzeWithAI } = useAIAnalysis();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [selectedPatient, setSelectedPatient] = useState('');
  const [measurements, setMeasurements] = useState<MeasurementData>({
    distancia_intermamilar: 0,
    altura_mamilo_sulco: 0,
    projecao_mamaria: 0,
    largura_base_mama: 0,
    altura_mama: 0,
  });
  const [aiObservations, setAiObservations] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [roboflowConfig] = useState({
    apiKey: 'your-roboflow-api-key', // Configure com sua API key
    modelEndpoint: 'https://detect.roboflow.com/your-model/1', // Configure com seu endpoint
  });

  const measurementLabels = {
    distancia_intermamilar: 'Distância Intermamilar (cm)',
    altura_mamilo_sulco: 'Altura Mamilo-Sulco (cm)',
    projecao_mamaria: 'Projeção Mamária (cm)',
    largura_base_mama: 'Largura Base da Mama (cm)',
    altura_mama: 'Altura da Mama (cm)',
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      const imageUrl = URL.createObjectURL(file);
      setImageUrl(imageUrl);
      
      toast({
        title: "Imagem carregada",
        description: `${file.name} foi carregada com sucesso.`,
      });
    }
  };

  const handleRunAnalysis = async () => {
    if (!selectedImage) {
      toast({
        title: "Erro",
        description: "Por favor, selecione uma imagem primeiro.",
        variant: "destructive",
      });
      return;
    }

    setIsProcessing(true);
    
    try {
      // Etapa 1: Análise com Roboflow
      toast({
        title: "Iniciando análise",
        description: "Detectando pontos anatômicos com Roboflow...",
      });

      const roboflowResult = await analyzeWithRoboflow(
        selectedImage,
        roboflowConfig.apiKey,
        roboflowConfig.modelEndpoint
      );

      if (roboflowResult && roboflowResult.measurements) {
        // Converter as medições para o formato correto
        const convertedMeasurements: MeasurementData = {};
        Object.keys(roboflowResult.measurements).forEach(key => {
          convertedMeasurements[key] = roboflowResult.measurements[key] || 0;
        });
        
        // Preencher as medições automaticamente
        setMeasurements(convertedMeasurements);
        
        toast({
          title: "Medições calculadas",
          description: "Pontos anatômicos detectados e medidas calculadas com sucesso!",
        });

        // Etapa 2: Análise médica com IA
        toast({
          title: "Gerando avaliação médica",
          description: "Analisando medições com inteligência artificial...",
        });

        const selectedPatientData = patients.find(p => p.id === selectedPatient);
        
        const aiResult = await analyzeWithAI({
          imageUrl,
          measurements: convertedMeasurements,
          patientInfo: selectedPatientData
        });

        if (aiResult.analysis) {
          setAiObservations(aiResult.analysis);
          
          toast({
            title: "Análise completa",
            description: "Avaliação médica gerada com sucesso!",
          });
        }
      }
    } catch (error) {
      console.error('Erro na análise:', error);
      toast({
        title: "Erro na análise",
        description: "Não foi possível processar a imagem. Verifique as configurações.",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const handleMeasurementChange = (key: string, value: string) => {
    const numValue = parseFloat(value) || 0;
    setMeasurements(prev => ({ ...prev, [key]: numValue }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatient) return;

    setIsSubmitting(true);
    
    try {
      const measurementValues = Object.entries(measurements).map(([type, value]) => ({
        measurement_type: type,
        value_cm: value,
      }));

      await addMeasurement(
        {
          patient_id: selectedPatient,
          scale_method: 'photo_analysis', // Método fixo para análise de foto
          measurements_data: measurements,
          ai_observations: aiObservations || null,
          image_url: imageUrl || null,
        },
        measurementValues
      );

      // Reset form
      setSelectedPatient('');
      setMeasurements({
        distancia_intermamilar: 0,
        altura_mamilo_sulco: 0,
        projecao_mamaria: 0,
        largura_base_mama: 0,
        altura_mama: 0,
      });
      setAiObservations('');
      setImageUrl('');
      setSelectedImage(null);
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPatientData = patients.find(p => p.id === selectedPatient);

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Header Card */}
      <Card className="futuristic-card">
        <CardHeader className="bg-gradient-to-r from-blue-600/80 to-blue-500/80 border-b border-blue-400/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="w-10 sm:w-12 h-10 sm:h-12 bg-blue-500 rounded-xl flex items-center justify-center">
              <Camera className="h-5 sm:h-6 w-5 sm:w-6 text-white" />
            </div>
            <div className="flex-1">
              <CardTitle className="text-white text-xl sm:text-2xl">
                Nova Avaliação Mamária
              </CardTitle>
              <p className="text-blue-200 mt-1 text-sm sm:text-base">
                Análise automática de medições utilizando IA e processamento de imagem
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Main Form */}
      <Card className="futuristic-card">
        <CardContent className="p-4 sm:p-6 lg:p-8">
          <form onSubmit={handleSubmit} className="space-y-6 sm:space-y-8">
            {/* Patient Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <User className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                </div>
                <Label className="text-base sm:text-lg font-semibold text-white">Seleção do Paciente</Label>
              </div>
              
              <Select value={selectedPatient} onValueChange={setSelectedPatient} required>
                <SelectTrigger className="h-10 sm:h-12 medical-input text-white">
                  <SelectValue placeholder="Selecione um paciente cadastrado" className="text-white" />
                </SelectTrigger>
                <SelectContent className="bg-blue-800/95 border border-blue-400/30 backdrop-blur-sm">
                  {patients.map((patient) => (
                    <SelectItem 
                      key={patient.id} 
                      value={patient.id}
                      className="text-white hover:bg-blue-700/50 focus:bg-blue-700/50"
                    >
                      <div className="flex items-center gap-3 py-1">
                        <div className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center text-white text-xs font-bold">
                          {patient.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                        </div>
                        <div>
                          <div className="font-medium text-white">{patient.nome}</div>
                          <div className="text-sm text-blue-200">{patient.email}</div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedPatientData && (
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                  <h4 className="font-semibold text-blue-100 mb-2">Paciente Selecionado:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 text-sm">
                    <div>
                      <span className="text-blue-200 font-medium">Nome:</span>
                      <div className="text-white">{selectedPatientData.nome}</div>
                    </div>
                    <div>
                      <span className="text-blue-200 font-medium">Email:</span>
                      <div className="text-white">{selectedPatientData.email}</div>
                    </div>
                    <div>
                      <span className="text-blue-200 font-medium">Data de Nascimento:</span>
                      <div className="text-white">{new Date(selectedPatientData.data_nascimento).toLocaleDateString('pt-BR')}</div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Image Import Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Image className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                </div>
                <Label className="text-base sm:text-lg font-semibold text-white">Imagem para Análise</Label>
                <Badge className="bg-green-500/30 text-green-100 border-green-400/30">
                  <Brain className="h-3 w-3 mr-1" />
                  Análise Automática
                </Badge>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex-1 h-12 border-blue-400/30 bg-blue-500/20 text-white hover:bg-blue-500/30 hover:text-white"
                >
                  <Upload className="w-4 h-4 mr-2" />
                  Importar Imagem
                </Button>
                
                {selectedImage && (
                  <Button
                    type="button"
                    onClick={handleRunAnalysis}
                    disabled={isProcessing || isAnalyzing || aiLoading}
                    className="flex-1 h-12 bg-gradient-to-r from-green-600 to-green-500 text-white hover:from-green-700 hover:to-green-600 disabled:opacity-50"
                  >
                    {isProcessing || isAnalyzing || aiLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                        Processando...
                      </>
                    ) : (
                      <>
                        <Zap className="w-4 h-4 mr-2" />
                        RUN - Calcular Medidas
                      </>
                    )}
                  </Button>
                )}
                
                <Input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleImageUpload}
                  className="hidden"
                />
              </div>

              {selectedImage && (
                <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center overflow-hidden">
                      <img
                        src={imageUrl}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <h4 className="font-semibold text-blue-100">Imagem Carregada:</h4>
                      <p className="text-sm text-blue-200">{selectedImage.name}</p>
                      <p className="text-xs text-blue-300">
                        Tamanho: {(selectedImage.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {(isProcessing || isAnalyzing || aiLoading) && (
                <Alert>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <AlertDescription className="text-blue-100">
                    {isAnalyzing && "Detectando pontos anatômicos com Roboflow..."}
                    {aiLoading && "Gerando avaliação médica com IA..."}
                    {isProcessing && !isAnalyzing && !aiLoading && "Processando imagem..."}
                  </AlertDescription>
                </Alert>
              )}
            </div>

            {/* Measurements */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                </div>
                <Label className="text-base sm:text-lg font-semibold text-white">Medidas Calculadas</Label>
                {extractedMeasurements && (
                  <Badge className="bg-green-500/30 text-green-100 border-green-400/30">
                    <Brain className="h-3 w-3 mr-1" />
                    Calculado pela IA
                  </Badge>
                )}
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                {Object.entries(measurementLabels).map(([key, label]) => (
                  <div key={key} className="space-y-3">
                    <Label htmlFor={key} className="text-sm font-medium text-white">
                      {label}
                    </Label>
                    <div className="relative">
                      <Input
                        id={key}
                        type="number"
                        step="0.1"
                        min="0"
                        max="50"
                        value={measurements[key] || ''}
                        onChange={(e) => handleMeasurementChange(key, e.target.value)}
                        placeholder="0.0"
                        className="medical-input h-10 sm:h-12 pr-12 text-white placeholder-blue-200"
                        required
                      />
                      <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-sm text-blue-200 font-medium">
                        cm
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* AI Observations */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                </div>
                <Label className="text-base sm:text-lg font-semibold text-white">Avaliação Médica da IA</Label>
                {analysis && (
                  <Badge className="bg-purple-500/30 text-purple-100 border-purple-400/30">
                    Gerado pela IA
                  </Badge>
                )}
              </div>
              
              <Textarea
                value={aiObservations}
                onChange={(e) => setAiObservations(e.target.value)}
                placeholder="A avaliação médica aparecerá aqui após o processamento da imagem..."
                rows={6}
                className="medical-input resize-none text-white placeholder-blue-200"
              />
              <p className="text-sm text-blue-200">
                Avaliação médica automática baseada nas medições calculadas pela IA
              </p>
            </div>

            {/* Submit Button */}
            <div className="pt-6 border-t border-blue-400/30">
              <Button
                type="submit"
                className="w-full medical-button text-white font-semibold h-12 sm:h-14 text-base sm:text-lg disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isSubmitting || !selectedPatient}
              >
                <Save className="h-4 sm:h-5 w-4 sm:w-5 mr-3" />
                {isSubmitting ? 'Salvando Avaliação...' : 'Salvar Avaliação Completa'}
              </Button>
              
              {!selectedPatient && (
                <p className="text-sm text-blue-200 text-center mt-3">
                  Selecione um paciente para continuar
                </p>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
