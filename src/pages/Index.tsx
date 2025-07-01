
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Camera, 
  Users, 
  BarChart3, 
  Plus,
  Brain,
  Ruler,
  Smartphone,
  ChevronRight
} from "lucide-react";
import { PatientList } from "@/components/PatientList";
import { NewMeasurementForm } from "@/components/NewMeasurementForm";
import { MeasurementHistory } from "@/components/MeasurementHistory";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen medical-gradient">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">
            Simulador de Medidas Mamárias IA
          </h1>
          <p className="text-blue-100 text-lg max-w-2xl mx-auto">
            Sistema avançado para análise e medição mamária com inteligência artificial,
            utilizando tecnologia LiDAR e processamento de imagem.
          </p>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4 bg-white/10 backdrop-blur-lg border border-white/20">
              <TabsTrigger 
                value="overview" 
                className="data-[state=active]:bg-white data-[state=active]:text-primary text-white"
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Visão Geral
              </TabsTrigger>
              <TabsTrigger 
                value="patients"
                className="data-[state=active]:bg-white data-[state=active]:text-primary text-white"
              >
                <Users className="h-4 w-4 mr-2" />
                Pacientes
              </TabsTrigger>
              <TabsTrigger 
                value="new-assessment"
                className="data-[state=active]:bg-white data-[state=active]:text-primary text-white"
              >
                <Plus className="h-4 w-4 mr-2" />
                Nova Avaliação
              </TabsTrigger>
              <TabsTrigger 
                value="history"
                className="data-[state=active]:bg-white data-[state=active]:text-primary text-white"
              >
                <Camera className="h-4 w-4 mr-2" />
                Histórico
              </TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card className="futuristic-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Brain className="h-5 w-5" />
                      IA Avançada
                    </CardTitle>
                    <CardDescription>
                      Análise automatizada com precisão clínica
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="bg-accent/20">
                        Machine Learning
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Algoritmos treinados para detectar e medir estruturas anatômicas
                        com precisão médica certificada.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="futuristic-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Smartphone className="h-5 w-5" />
                      Tecnologia LiDAR
                    </CardTitle>
                    <CardDescription>
                      Medições 3D de alta precisão
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="bg-accent/20">
                        iPhone 12 Pro+
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Utilize o sensor LiDAR do iPhone para capturar medidas
                        tridimensionais com precisão sub-milimétrica.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card className="futuristic-card">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-primary">
                      <Ruler className="h-5 w-5" />
                      Medição Manual
                    </CardTitle>
                    <CardDescription>
                      Opção tradicional com régua
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="secondary" className="bg-accent/20">
                        Método Clássico
                      </Badge>
                      <p className="text-sm text-muted-foreground">
                        Para casos onde a medição manual com régua é preferível
                        ou necessária por questões de protocolo.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card className="futuristic-card">
                <CardHeader>
                  <CardTitle className="text-primary">Como Funciona</CardTitle>
                  <CardDescription>
                    Processo simplificado em 4 etapas
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    {[
                      {
                        step: "1",
                        title: "Cadastro",
                        description: "Registre o paciente no sistema com informações básicas"
                      },
                      {
                        step: "2", 
                        title: "Captura",
                        description: "Capture a imagem usando LiDAR ou câmera tradicional"
                      },
                      {
                        step: "3",
                        title: "Análise IA",
                        description: "IA processa automaticamente e detecta pontos de medição"
                      },
                      {
                        step: "4",
                        title: "Resultados",
                        description: "Visualize medidas precisas e histórico completo"
                      }
                    ].map((item, index) => (
                      <div key={index} className="flex flex-col items-center text-center space-y-3">
                        <div className="w-12 h-12 rounded-full medical-gradient flex items-center justify-center text-white font-bold text-lg">
                          {item.step}
                        </div>
                        <h3 className="font-semibold text-primary">{item.title}</h3>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                        {index < 3 && (
                          <ChevronRight className="h-4 w-4 text-muted-foreground hidden md:block absolute mt-6 ml-24" />
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="patients">
              <PatientList />
            </TabsContent>

            <TabsContent value="new-assessment">
              <NewMeasurementForm />
            </TabsContent>

            <TabsContent value="history">
              <MeasurementHistory />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default Index;
