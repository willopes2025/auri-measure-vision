
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PatientForm } from "@/components/PatientForm";
import { PatientList } from "@/components/PatientList";
import { NewMeasurementForm } from "@/components/NewMeasurementForm";
import MeasurementHistory from "@/components/MeasurementHistory";
import { DatabaseStatus } from "@/components/DatabaseStatus";
import UserProfile from "@/components/UserProfile";
import { Users, Activity, Plus } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("patients");

  return (
    <div className="min-h-screen blue-gradient-bg">
      <div className="container mx-auto p-6">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Sistema de Medição Médica
            </h1>
            <p className="text-blue-100 text-lg">
              Plataforma para análise e medição de imagens médicas com IA
            </p>
          </div>
          <div className="flex items-center gap-4">
            <DatabaseStatus />
            <UserProfile />
          </div>
        </div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-6 bg-blue-800/50">
            <TabsTrigger 
              value="patients" 
              className="text-white data-[state=active]:bg-blue-600 flex items-center gap-2"
            >
              <Users className="h-4 w-4" />
              Pacientes
            </TabsTrigger>
            <TabsTrigger 
              value="new-measurement" 
              className="text-white data-[state=active]:bg-blue-600 flex items-center gap-2"
            >
              <Plus className="h-4 w-4" />
              Nova Medição
            </TabsTrigger>
            <TabsTrigger 
              value="measurements" 
              className="text-white data-[state=active]:bg-blue-600 flex items-center gap-2"
            >
              <Activity className="h-4 w-4" />
              Medições
            </TabsTrigger>
          </TabsList>

          <TabsContent value="patients" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="futuristic-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Plus className="h-5 w-5" />
                    Novo Paciente
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Cadastre um novo paciente no sistema
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PatientForm />
                </CardContent>
              </Card>

              <Card className="futuristic-card">
                <CardHeader>
                  <CardTitle className="text-white flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Lista de Pacientes
                  </CardTitle>
                  <CardDescription className="text-blue-100">
                    Visualize e gerencie pacientes cadastrados
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PatientList />
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="new-measurement" className="space-y-6">
            <Card className="futuristic-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Plus className="h-5 w-5" />
                  Nova Medição
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Realize uma nova medição para um paciente
                </CardDescription>
              </CardHeader>
              <CardContent>
                <NewMeasurementForm />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="measurements" className="space-y-6">
            <Card className="futuristic-card">
              <CardHeader>
                <CardTitle className="text-white flex items-center gap-2">
                  <Activity className="h-5 w-5" />
                  Histórico de Medições
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Visualize e analise todas as medições realizadas
                </CardDescription>
              </CardHeader>
              <CardContent>
                <MeasurementHistory />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
