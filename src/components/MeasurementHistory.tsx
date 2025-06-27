
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { History, Search, Download, Eye, Calendar } from "lucide-react";

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
    <div className="space-y-6">
      {/* Filters and Search */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="flex flex-col sm:flex-row gap-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Buscar por nome da paciente..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <Select value={selectedPatient} onValueChange={setSelectedPatient}>
            <SelectTrigger className="w-full sm:w-48">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {patients.map((patient) => (
                <SelectItem key={patient.id} value={patient.id}>
                  {patient.name}
                  {patient.id !== "all" && (
                    <span className="ml-2 text-gray-500">
                      ({getPatientMeasurementCount(patient.id)})
                    </span>
                  )}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={(value: "date" | "patient") => setSortBy(value)}>
            <SelectTrigger className="w-full sm:w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">Por Data</SelectItem>
              <SelectItem value="patient">Por Paciente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-blue-600">{measurements.length}</div>
            <div className="text-sm text-gray-600">Total de Medições</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {new Set(measurements.map(m => m.patient_id)).size}
            </div>
            <div className="text-sm text-gray-600">Pacientes Avaliadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {measurements.filter(m => m.scale_method === "lidar").length}
            </div>
            <div className="text-sm text-gray-600">Medições LiDAR</div>
          </CardContent>
        </Card>
      </div>

      {/* Measurements List */}
      <div className="space-y-4">
        {filteredMeasurements.map((measurement) => (
          <Card key={measurement.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-6">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Patient Info */}
                <div className="flex items-center space-x-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                      {getInitials(measurement.patient_name)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h3 className="font-medium text-lg">{measurement.patient_name}</h3>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar className="w-4 h-4" />
                      {formatDate(measurement.date)}
                      <Badge 
                        variant={measurement.scale_method === "lidar" ? "default" : "secondary"}
                        className="ml-2"
                      >
                        {measurement.scale_method === "lidar" ? "LiDAR" : "Régua"}
                      </Badge>
                    </div>
                  </div>
                </div>

                {/* Measurements Preview */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 text-center">
                  <div>
                    <div className="text-sm font-medium text-blue-600">{measurement.ij_ap_cm} cm</div>
                    <div className="text-xs text-gray-500">IJ-AP</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-green-600">{measurement.ax_ap_cm} cm</div>
                    <div className="text-xs text-gray-500">Ax-AP</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-purple-600">{measurement.xi_pap_cm} cm</div>
                    <div className="text-xs text-gray-500">XI-PAP</div>
                  </div>
                  <div>
                    <div className="text-sm font-medium text-orange-600">{measurement.base_cm} cm</div>
                    <div className="text-xs text-gray-500">Base</div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <Button size="sm" variant="outline">
                    <Eye className="w-4 h-4 mr-1" />
                    Visualizar
                  </Button>
                  <Button size="sm" variant="outline">
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                </div>
              </div>

              {/* AI Observations */}
              {measurement.ai_observations && (
                <div className="mt-4 p-3 bg-gray-50 rounded-lg">
                  <h4 className="text-sm font-medium text-gray-700 mb-1">Observações da IA:</h4>
                  <p className="text-sm text-gray-600">{measurement.ai_observations}</p>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredMeasurements.length === 0 && (
        <div className="text-center py-12">
          <History className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {searchTerm || selectedPatient !== "all" 
              ? "Nenhuma medição encontrada" 
              : "Nenhuma medição realizada"}
          </h3>
          <p className="text-gray-500">
            {searchTerm || selectedPatient !== "all"
              ? "Tente ajustar os filtros de busca"
              : "As medições aparecerão aqui após serem realizadas"}
          </p>
        </div>
      )}
    </div>
  );
};

export default MeasurementHistory;
