import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientList from "@/components/PatientList";
import NewAssessment from "@/components/NewAssessment";
import MeasurementHistory from "@/components/MeasurementHistory";
import { Users, Camera, History } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("patients");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="medical-gradient text-white shadow-lg">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Simulador de Medidas Mamárias IA</h1>
              <p className="text-blue-100 mt-1">Sistema Profissional de Análise e Medição</p>
            </div>
            <div className="hidden md:flex items-center space-x-4">
              <div className="text-right">
                <p className="text-sm text-blue-100">Versão 1.0</p>
                <p className="text-xs text-blue-200">Aprovado ANVISA</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Navigation Tabs */}
          <div className="flex justify-center mb-8">
            <TabsList className="grid w-full max-w-md grid-cols-3 bg-white shadow-lg border">
              <TabsTrigger 
                value="patients" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-900 data-[state=active]:text-white"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline">Pacientes</span>
              </TabsTrigger>
              <TabsTrigger 
                value="assessment" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-900 data-[state=active]:text-white"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline">Nova Avaliação</span>
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="flex items-center gap-2 data-[state=active]:bg-blue-900 data-[state=active]:text-white"
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline">Histórico</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="max-w-6xl mx-auto">
            <TabsContent value="patients" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="subtle-gradient">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Users className="w-5 h-5 text-blue-900" />
                    Gestão de Pacientes
                  </CardTitle>
                  <CardDescription>
                    Cadastre e gerencie suas pacientes de forma segura e organizada
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <PatientList />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assessment" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="subtle-gradient">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <Camera className="w-5 h-5 text-blue-900" />
                    Nova Avaliação
                  </CardTitle>
                  <CardDescription>
                    Capture imagens e realize medições com precisão milimétrica
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <NewAssessment />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-6">
              <Card className="shadow-lg border-0">
                <CardHeader className="subtle-gradient">
                  <CardTitle className="flex items-center gap-2 text-slate-800">
                    <History className="w-5 h-5 text-blue-900" />
                    Histórico de Medições
                  </CardTitle>
                  <CardDescription>
                    Acompanhe a evolução e compare resultados ao longo do tempo
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-6">
                  <MeasurementHistory />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-blue-900 text-blue-100 py-8 mt-16">
        <div className="container mx-auto px-4 text-center">
          <p className="text-sm">© 2024 Simulador de Medidas Mamárias IA - Tecnologia Médica Avançada</p>
          <p className="text-xs mt-2 text-blue-200">
            Sistema desenvolvido com conformidade LGPD e padrões médicos internacionais
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
