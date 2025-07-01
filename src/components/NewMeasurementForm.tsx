
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Camera, Ruler, Smartphone, Save } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useMeasurements } from '@/hooks/useMeasurements';

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

  return (
    <Card className="futuristic-card">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-primary">
          <Camera className="h-5 w-5" />
          Nova Avaliação Mamária
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label>Paciente</Label>
            <Select value={selectedPatient} onValueChange={setSelectedPatient} required>
              <SelectTrigger>
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

          <div className="space-y-2">
            <Label>Método de Escala</Label>
            <Select value={scaleMethod} onValueChange={(value: 'lidar' | 'ruler') => setScaleMethod(value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ruler">
                  <div className="flex items-center gap-2">
                    <Ruler className="h-4 w-4" />
                    Régua Manual
                  </div>
                </SelectItem>
                <SelectItem value="lidar">
                  <div className="flex items-center gap-2">
                    <Smartphone className="h-4 w-4" />
                    LiDAR (iPhone)
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4">
            <Label className="text-base font-semibold">Medidas</Label>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {Object.entries(measurementLabels).map(([key, label]) => (
                <div key={key} className="space-y-2">
                  <Label htmlFor={key} className="text-sm">
                    {label}
                  </Label>
                  <Input
                    id={key}
                    type="number"
                    step="0.1"
                    min="0"
                    value={measurements[key] || ''}
                    onChange={(e) => handleMeasurementChange(key, e.target.value)}
                    placeholder="0.0"
                    required
                  />
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="imageUrl">URL da Imagem (opcional)</Label>
            <Input
              id="imageUrl"
              type="url"
              value={imageUrl}
              onChange={(e) => setImageUrl(e.target.value)}
              placeholder="https://exemplo.com/imagem.jpg"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="observations">Observações da IA (opcional)</Label>
            <Textarea
              id="observations"
              value={aiObservations}
              onChange={(e) => setAiObservations(e.target.value)}
              placeholder="Observações automáticas geradas pela IA..."
              rows={3}
            />
          </div>

          <Button
            type="submit"
            className="w-full medical-gradient text-white font-medium hover:opacity-90 transition-opacity"
            disabled={isSubmitting || !selectedPatient}
          >
            <Save className="h-4 w-4 mr-2" />
            {isSubmitting ? 'Salvando...' : 'Salvar Avaliação'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
