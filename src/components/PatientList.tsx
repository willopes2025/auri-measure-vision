
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
  Clock,
  Smartphone,
  Brain,
  Ruler
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
          <div className="w-10 h-10 bg-blue-500 rounded-xl flex items-center justify-center">
            <FileText className="w-5 h-5 text-white" />
          </div>
          <h3 className="text-xl font-bold text-white">Histórico de Medições</h3>
        </div>
        
        {measurements.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 bg-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Activity className="w-8 h-8 text-blue-200" />
            </div>
            <p className="text-white text-lg">Nenhuma medição encontrada.</p>
            <p className="text-sm text-blue-200 mt-1">As medições aparecerão aqui após serem realizadas.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {measurements.map((measurement) => (
              <Card key={measurement.id} className="futuristic-card border-l-4 border-l-blue-400">
                <CardContent className="p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start mb-4 gap-4">
                    <div className="flex items-center gap-3">
                      <div className={`p-2 rounded-lg ${measurement.scale_method === 'lidar' ? 'bg-blue-500' : 'bg-green-500'}`}>
                        {measurement.scale_method === 'lidar' ? <Smartphone className="w-4 h-4 text-white" /> : <Ruler className="w-4 h-4 text-white" />}
                      </div>
                      <div>
                        <p className="font-semibold text-white">
                          Método: {measurement.scale_method === 'lidar' ? 'LiDAR' : 'Régua'}
                        </p>
                        <p className="text-sm text-blue-200 flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {formatDate(measurement.created_at)}
                        </p>
                      </div>
                    </div>
                    <Badge variant="outline" className="bg-blue-500/20 text-blue-100 border-blue-400/30">
                      {Object.keys(measurement.measurements_data as object).length} medidas
                    </Badge>
                  </div>
                  
                  {/* Measurement Preview */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                    {Object.entries(measurement.measurements_data as Record<string, number>).slice(0, 4).map(([key, value]) => (
                      <div key={key} className="bg-blue-500/20 p-3 rounded-lg text-center">
                        <div className="font-bold text-white">{value.toFixed(1)} cm</div>
                        <div className="text-xs text-blue-200 capitalize">
                          {key.replace(/_/g, ' ')}
                        </div>
                      </div>
                    ))}
                  </div>
                  
                  {measurement.ai_observations && (
                    <div className="bg-purple-500/20 border border-purple-400/30 rounded-lg p-4">
                      <h4 className="text-sm font-semibold text-purple-100 mb-2 flex items-center gap-2">
                        <Brain className="w-4 h-4" />
                        Observações da IA:
                      </h4>
                      <p className="text-sm text-purple-100 leading-relaxed">{measurement.ai_observations}</p>
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
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
          <h3 className="text-lg font-semibold text-white mb-2">Carregando pacientes...</h3>
          <p className="text-blue-200">Aguarde um momento</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <Card className="futuristic-card">
        <CardHeader className="bg-gradient-to-r from-blue-600/80 to-blue-500/80 border-b border-blue-400/30">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-white" />
              </div>
              <div>
                <CardTitle className="text-white text-xl sm:text-2xl">
                  Pacientes Cadastrados
                </CardTitle>
                <p className="text-blue-200 mt-1 text-sm sm:text-base">
                  {patients.length} {patients.length === 1 ? 'paciente cadastrado' : 'pacientes cadastrados'}
                </p>
              </div>
            </div>
            <Dialog open={showForm} onOpenChange={setShowForm}>
              <DialogTrigger asChild>
                <Button className="medical-button text-white px-4 sm:px-6 py-2 sm:py-3 font-medium w-full sm:w-auto">
                  <Plus className="h-4 sm:h-5 w-4 sm:w-5 mr-2" />
                  Novo Paciente
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-md mx-4 sm:mx-0">
                <DialogHeader>
                  <DialogTitle className="text-xl text-white">Cadastrar Novo Paciente</DialogTitle>
                </DialogHeader>
                <PatientForm onSuccess={() => setShowForm(false)} />
              </DialogContent>
            </Dialog>
          </div>
        </CardHeader>
        <CardContent className="p-4 sm:p-6">
          <div className="space-y-6">
            {/* Search */}
            <div className="relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-blue-200" />
              <Input
                placeholder="Pesquisar por nome ou email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-12 h-10 sm:h-12 medical-input text-sm sm:text-base text-white placeholder-blue-200"
              />
            </div>

            {/* Patients Grid */}
            {filteredPatients.length === 0 ? (
              <div className="text-center py-12 sm:py-16">
                <div className="w-16 sm:w-20 h-16 sm:h-20 bg-blue-500/30 rounded-2xl flex items-center justify-center mx-auto mb-4 sm:mb-6">
                  <User className="h-8 sm:h-10 w-8 sm:w-10 text-blue-200" />
                </div>
                <h3 className="text-lg sm:text-xl font-semibold text-white mb-2">
                  {searchTerm ? 'Nenhum paciente encontrado' : 'Nenhum paciente cadastrado'}
                </h3>
                <p className="text-blue-200 max-w-md mx-auto text-sm sm:text-base px-4">
                  {searchTerm 
                    ? 'Tente ajustar os termos de busca para encontrar o paciente desejado.' 
                    : 'Comece cadastrando seu primeiro paciente clicando no botão "Novo Paciente" acima.'
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-4 sm:gap-6">
                {filteredPatients.map((patient) => (
                  <Card key={patient.id} className="futuristic-card hover:shadow-lg transition-all duration-200 group">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="flex items-center gap-3 sm:gap-4 flex-1 min-w-0">
                          <div className="w-12 sm:w-14 h-12 sm:h-14 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center text-white font-bold text-sm sm:text-lg shadow-lg flex-shrink-0">
                            {patient.nome.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)}
                          </div>
                          <div className="space-y-2 flex-1 min-w-0">
                            <div className="flex flex-col sm:flex-row sm:items-center gap-2">
                              <h3 className="font-bold text-base sm:text-lg text-white truncate">{patient.nome}</h3>
                              <Badge variant="secondary" className="text-xs bg-blue-500/30 text-blue-100 border-blue-400/30 w-fit">
                                {calculateAge(patient.data_nascimento)} anos
                              </Badge>
                            </div>
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-2 sm:gap-4 text-xs sm:text-sm text-blue-200">
                              <div className="flex items-center gap-2 min-w-0">
                                <Mail className="h-3 sm:h-4 w-3 sm:w-4 text-blue-400 flex-shrink-0" />
                                <span className="truncate">{patient.email}</span>
                              </div>
                              {patient.telefone && (
                                <div className="flex items-center gap-2">
                                  <Phone className="h-3 sm:h-4 w-3 sm:w-4 text-blue-400 flex-shrink-0" />
                                  <span>{patient.telefone}</span>
                                </div>
                              )}
                              <div className="flex items-center gap-2">
                                <Calendar className="h-3 sm:h-4 w-3 sm:w-4 text-blue-400 flex-shrink-0" />
                                <span>{formatDate(patient.data_nascimento)}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-3 w-full sm:w-auto">
                          <Dialog>
                            <DialogTrigger asChild>
                              <Button
                                variant="outline" 
                                size="sm"
                                className="medical-input border-blue-400/30 hover:bg-blue-500/20 hover:border-blue-400/50 text-blue-100 w-full sm:w-auto"
                              >
                                <Eye className="h-3 sm:h-4 w-3 sm:w-4 mr-2" />
                                Ver Histórico
                              </Button>
                            </DialogTrigger>
                            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto mx-4 sm:mx-0 futuristic-card">
                              <DialogHeader>
                                <DialogTitle className="text-xl text-white">
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
