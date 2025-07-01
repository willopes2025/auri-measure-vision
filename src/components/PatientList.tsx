
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Mail, 
  Phone, 
  Calendar, 
  Search, 
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useMeasurements } from '@/hooks/useMeasurements';
import { PatientForm } from './PatientForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const PatientList: React.FC = () => {
  const { patients, loading } = usePatients();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState<string | null>(null);

  const filteredPatients = patients.filter(patient =>
    patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const PatientMeasurements = ({ patientId }: { patientId: string }) => {
    const { measurements, loading: loadingMeasurements } = useMeasurements(patientId);

    if (loadingMeasurements) {
      return <div className="p-4">Carregando medições...</div>;
    }

    return (
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Histórico de Medições</h3>
        {measurements.length === 0 ? (
          <p className="text-muted-foreground">Nenhuma medição encontrada.</p>
        ) : (
          <div className="space-y-2">
            {measurements.map((measurement) => (
              <div key={measurement.id} className="p-3 border rounded-lg">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="font-medium">
                      Método: {measurement.scale_method === 'lidar' ? 'LiDAR' : 'Régua'}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {formatDate(measurement.created_at)}
                    </p>
                  </div>
                  <Badge variant="outline">
                    {Object.keys(measurement.measurements_data as object).length} medidas
                  </Badge>
                </div>
                {measurement.ai_observations && (
                  <p className="text-sm mt-2 text-muted-foreground">
                    <strong>Observações IA:</strong> {measurement.ai_observations}
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando pacientes...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card className="futuristic-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2 text-primary">
              <User className="h-5 w-5" />
              Lista de Pacientes ({patients.length})
            </CardTitle>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button className="medical-gradient text-white">
                  <Plus className="h-4 w-4 mr-2" />
                  Novo Paciente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle>Cadastrar Novo Paciente</DialogTitle>
                </DialogHeader>
                <PatientForm onSuccess={() => setShowForm(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            {filteredPatients.length === 0 ? (
              <div className="text-center py-8">
                <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  {searchTerm ? 'Nenhum paciente encontrado.' : 'Nenhum paciente cadastrado ainda.'}
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {filteredPatients.map((patient) => (
                  <Card key={patient.id} className="border hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-2">
                            <User className="h-4 w-4 text-primary" />
                            <span className="font-medium">{patient.nome}</span>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1">
                              <Mail className="h-3 w-3" />
                              {patient.email}
                            </div>
                            {patient.telefone && (
                              <div className="flex items-center gap-1">
                                <Phone className="h-3 w-3" />
                                {patient.telefone}
                              </div>
                            )}
                            <div className="flex items-center gap-1">
                              <Calendar className="h-3 w-3" />
                              {formatDate(patient.data_nascimento)}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline" 
                                size="sm"
                                onClick={() => setSelectedPatient(patient.id)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-2xl">
                              <DialogHeader>
                                <DialogTitle>Detalhes - {patient.nome}</DialogTitle>
                              </DialogHeader>
                              <PatientMeasurements patientId={patient.id} />
                            </DialogContent>
                          </Dialog>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
