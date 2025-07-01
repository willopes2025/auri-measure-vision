
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Camera, Ruler, Smartphone, Save, Brain, Image, User, Settings } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useMeasurements } from '@/hooks/useMeasurements';
import { Badge } from '@/components/ui/badge';

interface MeasurementData {
  [key: string]: number;
}

export const NewMeasurementForm: React.FC = () => {
  const { patients } = usePatients();
  const { addMeasurement } = useMeasurements();
  
  const [selectedPatient, setSelectedPatient] = useState('');
  const [scaleMethod, setScaleMethod] = useState<'lidar' | 'ruler'>('ruler');
  const [measurements, setMeasurements] = useState<MeasurementData>({
    distancia_intermamilar: 0,
    altura_mamilo_sulco: 0,
    projecao_mamaria: 0,
    largura_base_mama: 0,
    altura_mama: 0,
  });
  const [aiObservations, setAiObservations] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const measurementLabels = {
    distancia_intermamilar: 'Distância Intermamilar (cm)',
    altura_mamilo_sulco: 'Altura Mamilo-Sulco (cm)',
    projecao_mamaria: 'Projeção Mamária (cm)',
    largura_base_mama: 'Largura Base da Mama (cm)',
    altura_mama: 'Altura da Mama (cm)',
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
          scale_method: scaleMethod,
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
                Realize uma nova medição utilizando IA e tecnologia avançada
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
                <SelectContent className="futuristic-card border-0">
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
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

            {/* Method Selection */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Settings className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                </div>
                <Label className="text-base sm:text-lg font-semibold text-white">Método de Medição</Label>
              </div>
              
              <Select value={scaleMethod} onValueChange={(value: 'lidar' | 'ruler') => setScaleMethod(value)}>
                <SelectTrigger className="h-10 sm:h-12 medical-input text-white">
                  <SelectValue className="text-white" />
                </SelectTrigger>
                <SelectContent className="futuristic-card border-0">
                  <SelectItem value="ruler">
                    <div className="flex items-center gap-3 py-2">
                      <div className="w-6 sm:w-8 h-6 sm:h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <Ruler className="h-3 sm:h-4 w-3 sm:w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">Régua Manual</div>
                        <div className="text-sm text-blue-200">Método tradicional com régua física</div>
                      </div>
                    </div>
                  </SelectItem>
                  <SelectItem value="lidar">
                    <div className="flex items-center gap-3 py-2">
                      <div className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Smartphone className="h-3 sm:h-4 w-3 sm:w-4 text-white" />
                      </div>
                      <div>
                        <div className="font-medium text-white">LiDAR (iPhone)</div>
                        <div className="text-sm text-blue-200">Tecnologia 3D de alta precisão</div>
                      </div>
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>

              <div className="bg-blue-500/20 border border-blue-400/30 rounded-lg p-4">
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant={scaleMethod === 'lidar' ? 'default' : 'secondary'} className={scaleMethod === 'lidar' ? 'bg-blue-600 text-white' : 'bg-green-500/30 text-green-100 border-green-400/30'}>
                    {scaleMethod === 'lidar' ? 'LiDAR Ativo' : 'Régua Manual Ativa'}
                  </Badge>
                </div>
                <p className="text-sm text-blue-200">
                  {scaleMethod === 'lidar' 
                    ? 'Método de alta precisão utilizando sensor LiDAR do iPhone para medições 3D sub-milimétricas.'
                    : 'Método tradicional utilizando régua física para medições manuais precisas e confiáveis.'
                  }
                </p>
              </div>
            </div>

            {/* Measurements */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Ruler className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                </div>
                <Label className="text-base sm:text-lg font-semibold text-white">Medidas Corporais</Label>
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

            {/* Image URL */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Image className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                </div>
                <Label className="text-base sm:text-lg font-semibold text-white">Imagem de Referência (Opcional)</Label>
              </div>
              
              <Input
                type="url"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://exemplo.com/imagem.jpg"
                className="medical-input h-10 sm:h-12 text-white placeholder-blue-200"
              />
              <p className="text-sm text-blue-200">
                Adicione uma URL da imagem utilizada para as medições (opcional)
              </p>
            </div>

            {/* AI Observations */}
            <div className="space-y-4">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-6 sm:w-8 h-6 sm:h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                  <Brain className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
                </div>
                <Label className="text-base sm:text-lg font-semibold text-white">Observações da IA (Opcional)</Label>
              </div>
              
              <Textarea
                value={aiObservations}
                onChange={(e) => setAiObservations(e.target.value)}
                placeholder="Observações automáticas geradas pela inteligência artificial..."
                rows={4}
                className="medical-input resize-none text-white placeholder-blue-200"
              />
              <p className="text-sm text-blue-200">
                Adicione observações técnicas ou comentários gerados pelo sistema de IA
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
                {isSubmitting ? 'Salvando Avaliação...' : 'Executar e Salvar Avaliação Completa'}
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
