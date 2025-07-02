import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { History, Search, Download, Eye, Calendar, TrendingUp, Users, Zap } from "lucide-react";

interface Measurement {
  id: string;
  patient_id: string;
  patient_name: string;
  date: string;
  scale_method: "lidar" | "ruler";
  ij_ap_cm: number;
  ax_ap_cm: number;
  xi_pap_cm: number;
  base_cm: number;
  cm_per_px: number;
  ai_observations: string;
}

const MeasurementHistory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedPatient, setSelectedPatient] = useState<string>("all");
  const [sortBy, setSortBy] = useState<"date" | "patient">("date");

  const measurements: Measurement[] = [
    {
      id: "1",
      patient_id: "1",
      patient_name: "Maria Silva Santos",
      date: "2024-06-25",
      scale_method: "lidar",
      ij_ap_cm: 23.4,
      ax_ap_cm: 15.1,
      xi_pap_cm: 20.9,
      base_cm: 4.5,
      cm_per_px: 0.156,
      ai_observations: "Simetria adequada, proporções normais para biotipo."
    },
    {
      id: "2", 
      patient_id: "1",
      patient_name: "Maria Silva Santos",
      date: "2024-06-20",
      scale_method: "ruler",
      ij_ap_cm: 23.1,
      ax_ap_cm: 15.3,
      xi_pap_cm: 20.7,
      base_cm: 4.4,
      cm_per_px: 0.158,
      ai_observations: "Evolução positiva observada. Manter acompanhamento."
    },
    {
      id: "3",
      patient_id: "2", 
      patient_name: "Ana Paula Costa",
      date: "2024-06-24",
      scale_method: "lidar",
      ij_ap_cm: 22.8,
      ax_ap_cm: 14.9,
      xi_pap_cm: 19.5,
      base_cm: 4.2,
      cm_per_px: 0.162,
      ai_observations: "Primeira avaliação. Baseline estabelecido com sucesso."
    },
    {
      id: "4",
      patient_id: "3",
      patient_name: "Fernanda Oliveira", 
      date: "2024-06-22",
      scale_method: "ruler",
      ij_ap_cm: 24.1,
      ax_ap_cm: 16.2,
      xi_pap_cm: 21.3,
      base_cm: 4.8,
      cm_per_px: 0.154,
      ai_observations: "Medidas dentro do padrão. Recomenda-se controle em 3 meses."
    },
    {
      id: "5",
      patient_id: "3",
      patient_name: "Fernanda Oliveira",
      date: "2024-06-15",
      scale_method: "lidar", 
      ij_ap_cm: 24.0,
      ax_ap_cm: 16.1,
      xi_pap_cm: 21.1,
      base_cm: 4.7,
      cm_per_px: 0.155,
      ai_observations: "Estabilidade nas medidas. Evolução favorável."
    }
  ];

  const patients = [
    { id: "all", name: "Todas as pacientes" },
    { id: "1", name: "Maria Silva Santos" },
    { id: "2", name: "Ana Paula Costa" },
    { id: "3", name: "Fernanda Oliveira" }
  ];

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit', 
      year: 'numeric'
    });
  };

  const filteredMeasurements = measurements
    .filter(measurement => {
      const matchesSearch = measurement.patient_name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesPatient = selectedPatient === "all" || measurement.patient_id === selectedPatient;
      return matchesSearch && matchesPatient;
    })
    .sort((a, b) => {
      if (sortBy === "date") {
        return new Date(b.date).getTime() - new Date(a.date).getTime();
      } else {
        return a.patient_name.localeCompare(b.patient_name);
      }
    });

  const getPatientMeasurementCount = (patientId: string) => {
    return measurements.filter(m => m.patient_id === patientId).length;
  };

  return (
    <div className="space-y-8">
      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
            <Input
              placeholder="Buscar por nome da paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-12 h-12 medical-input text-white placeholder-blue-200"
            />
          </div>
          
          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger className="w-full sm:w-56 h-12 medical-input text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="futuristic-card border-0">
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  <div className="flex items-center justify-between w-full">
                    <span className="text-white">{patient.name}</span>
                    {patient.id !== "all" && (
                      <Badge variant="secondary" className="ml-2 text-xs bg-blue-500/30 text-blue-100 border-blue-400/30">
                        {getPatientMeasurementCount(patient.id)}
                      </Badge>
                    )}
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: "date" | "patient") => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-40 h-12 medical-input text-white">
              <SelectValue />
            </SelectTrigger>
            <SelectContent className="futuristic-card border-0">
              <SelectItem value="date" className="text-white">Por Data</SelectItem>
              <SelectItem value="patient" className="text-white">Por Paciente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="futuristic-card border-0">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-blue-500/30 rounded-xl">
                <TrendingUp className="w-6 h-6 text-blue-200" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">{measurements.length}</div>
            <div className="text-sm text-blue-200">Total de Medições</div>
          </CardContent>
        </Card>
        <Card className="futuristic-card border-0">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-blue-500/30 rounded-xl">
                <Users className="w-6 h-6 text-blue-200" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {new Set(measurements.map(m => m.patient_id)).size}
            </div>
            <div className="text-sm text-blue-200">Pacientes Avaliadas</div>
          </CardContent>
        </Card>
        <Card className="futuristic-card border-0">
          <CardContent className="p-6 text-center">
            <div className="flex items-center justify-center mb-3">
              <div className="p-3 bg-blue-500/30 rounded-xl">
                <Zap className="w-6 h-6 text-blue-200" />
              </div>
            </div>
            <div className="text-3xl font-bold text-white mb-1">
              {measurements.filter(m => m.scale_method === "lidar").length}
            </div>
            <div className="text-sm text-blue-200">Medições Automáticas</div>
          </CardContent>
        </Card>
      </div>

      {/* Measurements List */}
      <div className="space-y-6">
        {filteredMeasurements.map((measurement) => (
          <Card key={measurement.id} className="futuristic-card hover:shadow-2xl transition-all duration-300 border-0">
            <CardContent className="p-8">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                {/* Patient Info */}
                <div className="flex items-center space-x-6">
                  <Avatar className="h-16 w-16 border-2 border-blue-400/50">
                    <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white font-bold text-lg">
                      {getInitials(measurement.patient_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-semibold text-xl text-white mb-2">{measurement.patient_name}</h3>
                    <div className="flex items-center gap-4 text-sm text-blue-200">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        {formatDate(measurement.date)}
                      </div>
                      <Badge 
                        variant="secondary"
                        className="bg-blue-500/30 text-blue-100 border-blue-400/30"
                      >
                        Medição Automática
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Measurements Preview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <div className="text-lg font-bold text-white">{measurement.ij_ap_cm} cm</div>
                    <div className="text-xs text-blue-200 font-medium">IJ-AP</div>
                  </div>
                  <div className="text-center p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <div className="text-lg font-bold text-white">{measurement.ax_ap_cm} cm</div>
                    <div className="text-xs text-blue-200 font-medium">Ax-AP</div>
                  </div>
                  <div className="text-center p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <div className="text-lg font-bold text-white">{measurement.xi_pap_cm} cm</div>
                    <div className="text-xs text-blue-200 font-medium">XI-PAP</div>
                  </div>
                  <div className="text-center p-3 bg-blue-500/20 rounded-lg border border-blue-400/30">
                    <div className="text-lg font-bold text-white">{measurement.base_cm} cm</div>
                    <div className="text-xs text-blue-200 font-medium">Base</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-3">
                  <Button size="sm" variant="outline" className="border-blue-400/30 hover:bg-blue-500/20 text-blue-100">
                    <Eye className="w-4 h-4 mr-2" />
                    Visualizar
                  </Button>
                  <Button size="sm" variant="outline" className="border-blue-400/30 hover:bg-blue-500/20 text-blue-100">
                    <Download className="w-4 h-4 mr-2" />
                    PDF
                  </Button>
                </div>
              </div>

              {/* AI Observations */}
              {measurement.ai_observations && (
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-500/20 to-blue-600/20 rounded-xl border border-blue-400/30">
                  <h4 className="text-sm font-semibold text-white mb-2 flex items-center gap-2">
                    <Zap className="w-4 h-4 text-blue-400" />
                    Observações da IA:
                  </h4>
                  <p className="text-sm text-blue-100 leading-relaxed">{measurement.ai_observations}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMeasurements.length === 0 && (
        <div className="text-center py-16">
          <div className="futuristic-card max-w-md mx-auto p-12">
            <History className="w-20 h-20 text-blue-400 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-white mb-4">
              {searchTerm || selectedPatient !== "all" 
                ? "Nenhuma medição encontrada" 
                : "Nenhuma medição realizada"}
            </h3>
            <p className="text-blue-200">
              {searchTerm || selectedPatient !== "all"
                ? "Tente ajustar os filtros de busca"
                : "As medições aparecerão aqui após serem realizadas"}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default MeasurementHistory;
