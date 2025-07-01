
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
  Plus,
  Activity,
  FileText,
  Clock
} from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';
import { useMeasurements } from '@/hooks/useMeasurements';
import { PatientForm } from './PatientForm';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

export const PatientList: React.FC = () => {
  const { patients, loading } = usePatients();
  const [searchTerm, setSearchTerm] = useState('');
  const [showForm, setShowForm] = useState(false);

  const filteredPatients = patients.filter(patient =>
    patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const calculateAge = (birthDate: string) => {
    const today = new Date();
    const birth = new Date(birthDate);
    let age = today.getFullYear() - birth.getFullYear();
    const monthDiff = today.getMonth() - birth.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
      age--;
    }
    return age;
  };

  const PatientMeasurements = ({ patientId }: { patientId: string }) => {
    const { measurements, loading: loadingMeasurements } = useMeasurements(patientId);

    if (loadingMeasurements) {
      return (
        <div className="p-8 text-center">
          <div className="loading-shimmer w-full h-4 rounded mb-4"></div>
          <div className="loading-shimmer w-3/4 h-4 rounded mx-auto"></div>
        </div>
      );
    }

    return (
      <div className="space-y-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-primary">Histórico de Medições</h3>
        </div>
        
        {measurements.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-muted-foreground text-lg">Nenhuma medição encontrada.</p>
            <p className="text-sm text-muted-foreground mt-1">As medições aparecerão aqui após serem realizadas.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {measurements.map((measurement) => (
              <Card key={measurement.id} className="border-l-4 border-l-primary hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${measurement.scale_method === 'lidar' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                        {measurement.scale_method === 'lidar' ? <Smartphone className="w-4 h-4" /> : <Ruler className="w-4 h-4" />}
                      </div>
                      <div>
                        <p className="font-semibold text-primary">
                          Método: {measurement.scale_method === 'lidar' ? 'LiDAR' : 'Régua'}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(measurement.created_at)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-primary/5 text-primary border-primary/20">
                      {Object.keys(measurement.measurements_data as object).length} medidas
                    </Badge>
                  </div>
                  
                  {/* Measurement Preview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {Object.entries(measurement.measurements_data as Record<string, number>).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="bg-gray-50 p-3 rounded-lg text-center">
                        <div className="font-bold text-primary">{value.toFixed(1)} cm</div>
                        <div className="text-xs text-muted-foreground capitalize">
                          {key.replace(/_/g, ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {measurement.ai_observations && (
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-blue-900 mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Observações da IA:
                      </h4>
                      <p className="text-sm text-blue-800 leading-relaxed">{measurement.ai_observations}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-lg font-semibold text-primary mb-2">Carregando pacientes...</h3>
          <p className="text-muted-foreground">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="futuristic-card">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-primary text-2xl">
                  Pacientes Cadastrados
                </CardTitle>
                <p className="text-muted-foreground mt-1">
                  {patients.length} {patients.length === 1 ? 'paciente cadastrado' : 'pacientes cadastrados'}
                </p>
              </div>
            </div>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button className="medical-button text-white px-6 py-3 font-medium">
                  <Plus className="h-5 w-5 mr-2" />
                  Novo Paciente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md">
                <DialogHeader>
                  <DialogTitle className="text-xl">Cadastrar Novo Paciente</DialogTitle>
                </DialogHeader>
                <PatientForm onSuccess={() => setShowForm(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-6">
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-muted-foreground" />
              <Input
                placeholder="Pesquisar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-12 medical-input text-base"
              />
            </div>

            {/* Patients Grid */}
            {filteredPatients.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 bg-gray-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <User className="h-10 w-10 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  {searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
                </h3>
                <p className="text-muted-foreground max-w-md mx-auto">
                  {searchTerm 
                    ? 'Tente ajustar os termos de busca para encontrar o paciente desejado.' 
                    : 'Comece cadastrando seu primeiro paciente clicando no botão "Novo Paciente" acima.'
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-6">
                {filteredPatients.map((patient) => (
                  <Card key={patient.id} className="border hover:shadow-lg transition-all duration-200 group">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4 flex-1">
                          <div className="w-14 h-14 bg-gradient-to-br from-primary to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-lg">
                            {patient.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div className="space-y-2 flex-1">
                            <div className="flex items-center gap-2">
                              <h3 className="font-bold text-lg text-primary">{patient.nome}</h3>
                              <Badge variant="secondary" className="text-xs">
                                {calculateAge(patient.data_nascimento)} anos
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-muted-foreground">
                              <div className="flex items-center gap-2">
                                <Mail className="h-4 w-4 text-primary" />
                                <span className="truncate">{patient.email}</span>
                              </div>
                              {patient.telefone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-4 w-4 text-primary" />
                                  <span>{patient.telefone}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="h-4 w-4 text-primary" />
                                <span>{formatDate(patient.data_nascimento)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline" 
                                size="sm"
                                className="medical-input border-primary/20 hover:bg-primary/5 hover:border-primary/40"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                Ver Histórico
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                              <DialogHeader>
                                <DialogTitle className="text-xl">
                                  Histórico - {patient.nome}
                                </DialogTitle>
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
