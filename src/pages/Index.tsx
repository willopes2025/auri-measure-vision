
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PatientList from "@/components/PatientList";
import NewAssessment from "@/components/NewAssessment";
import MeasurementHistory from "@/components/MeasurementHistory";
import { Users, Camera, History, Zap, Activity } from "lucide-react";

const Index = () => {
  const [activeTab, setActiveTab] = useState("patients");

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-slate-100 tech-pattern">
      {/* Header */}
      <header className="medical-gradient text-white shadow-2xl relative overflow-hidden">
        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-white/10 rounded-xl backdrop-blur-sm border border-white/20">
                <Activity className="w-8 h-8 text-blue-100" />
              </div>
              <div>
                <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                  Simulador de Medidas Mamárias IA
                </h1>
                <p className="text-blue-100 mt-2 flex items-center gap-2">
                  <Zap className="w-4 h-4" />
                  Sistema Profissional de Análise e Medição
                </p>
              </div>
            </div>
            <div className="hidden md:flex items-center space-x-6">
              <div className="text-right glass-effect p-4 rounded-xl">
                <p className="text-sm text-blue-100 font-semibold">Versão 2.0</p>
                <p className="text-xs text-blue-200">Aprovado ANVISA</p>
              </div>
            </div>
          </div>
        </div>
        
        {/* Animated background elements */}
        <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
          <div className="absolute top-20 left-20 w-32 h-32 bg-blue-400/10 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-blue-300/10 rounded-full blur-lg animate-pulse delay-1000"></div>
          <div className="absolute top-1/2 left-1/3 w-16 h-16 bg-blue-200/10 rounded-full blur-md animate-pulse delay-500"></div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-12">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          {/* Navigation Tabs */}
          <div className="flex justify-center mb-12">
            <TabsList className="grid w-full max-w-lg grid-cols-3 futuristic-card shadow-xl border-0 p-2">
              <TabsTrigger 
                value="patients" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-900 data-[state=active]:to-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg"
              >
                <Users className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Pacientes</span>
              </TabsTrigger>
              <TabsTrigger 
                value="assessment" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-900 data-[state=active]:to-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg"
              >
                <Camera className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Nova Avaliação</span>
              </TabsTrigger>
              <TabsTrigger 
                value="history" 
                className="flex items-center gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-900 data-[state=active]:to-blue-800 data-[state=active]:text-white data-[state=active]:shadow-lg transition-all duration-300 rounded-lg"
              >
                <History className="w-4 h-4" />
                <span className="hidden sm:inline font-medium">Histórico</span>
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Tab Contents */}
          <div className="max-w-7xl mx-auto">
            <TabsContent value="patients" className="space-y-8">
              <Card className="futuristic-card shadow-2xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-blue-100/50">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="p-2 bg-blue-900/10 rounded-lg">
                      <Users className="w-6 h-6 text-blue-900" />
                    </div>
                    Gestão de Pacientes
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Cadastre e gerencie suas pacientes de forma segura e organizada
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <PatientList />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="assessment" className="space-y-8">
              <Card className="futuristic-card shadow-2xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-blue-100/50">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="p-2 bg-blue-900/10 rounded-lg">
                      <Camera className="w-6 h-6 text-blue-900" />
                    </div>
                    Nova Avaliação
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Capture imagens e realize medições com precisão milimétrica
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <NewAssessment />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history" className="space-y-8">
              <Card className="futuristic-card shadow-2xl border-0 overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-slate-50 to-blue-50 border-b border-blue-100/50">
                  <CardTitle className="flex items-center gap-3 text-slate-800">
                    <div className="p-2 bg-blue-900/10 rounded-lg">
                      <History className="w-6 h-6 text-blue-900" />
                    </div>
                    Histórico de Medições
                  </CardTitle>
                  <CardDescription className="text-slate-600">
                    Acompanhe a evolução e compare resultados ao longo do tempo
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <MeasurementHistory />
                </CardContent>
              </Card>
            </TabsContent>
          </div>
        </Tabs>
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-blue-100 py-12 mt-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-blue-400/5 to-transparent"></div>
        <div className="container mx-auto px-4 text-center relative z-10">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Activity className="w-5 h-5 text-blue-300" />
            <p className="text-sm font-medium">© 2024 Simulador de Medidas Mamárias IA</p>
          </div>
          <p className="text-xs text-blue-200 max-w-2xl mx-auto">
            Sistema desenvolvido com conformidade LGPD e padrões médicos internacionais • Tecnologia Médica Avançada
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
