
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Camera, Upload, Ruler, Brain, Save, Loader2 } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useMeasurements } from '@/hooks/useMeasurements';
import { AIAnalysisPanel } from './AIAnalysisPanel';

export const AIIntegratedMeasurement: React.FC = () => {
  const { patients } = usePatients();
  const { addMeasurement } = useMeasurements();
  
  const [selectedPatient, setSelectedPatient] = useState('');
  const [scaleMethod, setScaleMethod] = useState('lidar');
  const [imageUrl, setImageUrl] = useState('');
  const [measurements, setMeasurements] = useState({
    largura_base: '',
    altura_mamaria: '',
    projecao_anterior: '',
    distancia_intermamilar: '',
    diametro_areolapapilar: ''
  });
  const [aiObservations, setAiObservations] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleMeasurementChange = (field: string, value: string) => {
    setMeasurements(prev => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setImageUrl(url);
    }
  };

  const handleSaveMeasurement = async () => {
    if (!selectedPatient) {
      alert('Selecione um paciente');
      return;
    }

    setIsSubmitting(true);
    try {
      const measurementData = {
        patient_id: selectedPatient,
        scale_method: scaleMethod,
        measurements_data: measurements,
        ai_observations: aiObservations,
        image_url: imageUrl || null
      };

      const { error } = await addMeasurement(measurementData);
      
      if (!error) {
        // Reset form
        setSelectedPatient('');
        setMeasurements({
          largura_base: '',
          altura_mamaria: '',
          projecao_anterior: '',
          distancia_intermamilar: '',
          diametro_areolapapilar: ''
        });
        setAiObservations('');
        setImageUrl('');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectedPatientData = patients.find(p => p.id === selectedPatient);

  return (
    <div className="space-y-6">
      <Card className="card-blue-gradient">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-white">
            <Camera className="h-5 w-5" />
            Nova Avaliação com IA
            <Badge variant="secondary" className="bg-green-500/30 text-green-100 border-green-400/30">
              IA Integrada
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

          {/* Método de Escala */}
          <div className="space-y-2">
            <Label className="text-white">Método de Medição</Label>
            <Select value={scaleMethod} onValueChange={setScaleMethod}>
              <SelectTrigger className="medical-input">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="lidar">LiDAR (iPhone 12 Pro+)</SelectItem>
                <SelectItem value="ruler">Régua Manual</SelectItem>
                <SelectItem value="camera">Câmera Tradicional</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Upload de Imagem */}
          <div className="space-y-2">
            <Label className="text-white">Imagem (Opcional)</Label>
            <div className="flex items-center gap-2">
              <Input
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="medical-input"
              />
              <Button variant="outline" size="sm" className="bg-blue-600/50 border-blue-400/50 text-white">
                <Upload className="h-4 w-4" />
              </Button>
            </div>
            {imageUrl && (
              <div className="mt-2">
                <img src={imageUrl} alt="Preview" className="max-w-32 h-32 object-cover rounded-lg border border-blue-400/30" />
              </div>
            )}
          </div>

          {/* Medições Manuais */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'largura_base', label: 'Largura da Base (cm)' },
              { key: 'altura_mamaria', label: 'Altura Mamária (cm)' },
              { key: 'projecao_anterior', label: 'Projeção Anterior (cm)' },
              { key: 'distancia_intermamilar', label: 'Distância Intermamilar (cm)' },
              { key: 'diametro_areolapapilar', label: 'Diâmetro Areolo-papilar (cm)' }
            ].map((field) => (
              <div key={field.key} className="space-y-2">
                <Label className="text-white">{field.label}</Label>
                <div className="relative">
                  <Ruler className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
                  <Input
                    type="number"
                    step="0.1"
                    placeholder="0.0"
                    value={measurements[field.key as keyof typeof measurements]}
                    onChange={(e) => handleMeasurementChange(field.key, e.target.value)}
                    className="pl-10 medical-input"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Observações da IA */}
          <div className="space-y-2">
            <Label className="text-white flex items-center gap-2">
              <Brain className="h-4 w-4" />
              Observações da IA
            </Label>
            <Textarea
              placeholder="As observações da IA aparecerão aqui..."
              value={aiObservations}
              onChange={(e) => setAiObservations(e.target.value)}
              className="medical-input min-h-[120px]"
              rows={5}
            />
          </div>

          <Button
            onClick={handleSaveMeasurement}
            disabled={isSubmitting || !selectedPatient}
            className="w-full medical-button"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Avaliação
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      {/* Painel de Análise IA */}
      <AIAnalysisPanel
        imageUrl={imageUrl || undefined}
        measurements={Object.values(measurements).some(v => v) ? measurements : undefined}
        patientInfo={selectedPatientData}
        onAnalysisComplete={setAiObservations}
      />
    </div>
  );
};
