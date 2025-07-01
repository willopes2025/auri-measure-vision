
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
  ChevronRight,
  Zap,
  Shield,
  Clock,
  Award,
  TrendingUp
} from "lucide-react";
import { PatientList } from "@/components/PatientList";
import { NewMeasurementForm } from "@/components/NewMeasurementForm";
import MeasurementHistory from "@/components/MeasurementHistory";

const Index = () => {
  const [activeTab, setActiveTab] = useState("overview");

  return (
    <div className="min-h-screen medical-gradient relative">
      <div className="container mx-auto px-4 py-8 relative z-10">
        {/* Enhanced Header */}
        <div className="text-center mb-12">
          <div className="mb-6">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-white/20 backdrop-blur-sm rounded-2xl mb-6 border border-white/30">
              <Brain className="w-10 h-10 text-white" />
            </div>
            <h1 className="text-5xl font-bold text-white mb-4 tracking-tight">
              Simulador de Medidas Mamárias IA
            </h1>
            <p className="text-blue-100 text-xl max-w-3xl mx-auto leading-relaxed">
              Sistema avançado para análise e medição mamária com inteligência artificial,
              utilizando tecnologia LiDAR e processamento de imagem de última geração.
            </p>
          </div>
          
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {[
              { icon: Shield, label: "Precisão", value: "99.5%", color: "bg-green-500" },
              { icon: Zap, label: "Velocidade", value: "<3s", color: "bg-yellow-500" },
              { icon: Award, label: "Certificado", value: "ISO", color: "bg-blue-500" },
              { icon: TrendingUp, label: "Melhorias", value: "+15%", color: "bg-purple-500" }
            ].map((stat, index) => (
              <div key={index} className="stats-card p-4 rounded-xl">
                <div className="flex items-center gap-3">
                  <div className={`p-2 ${stat.color} rounded-lg`}>
                    <stat.icon className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="font-bold text-slate-800">{stat.value}</div>
                    <div className="text-sm text-slate-600">{stat.label}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Tabs */}
        <div className="max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-8">
            <TabsList className="grid w-full grid-cols-4 bg-white/15 backdrop-blur-xl border border-white/30 p-1 rounded-2xl">
              {[
                { value: "overview", icon: BarChart3, label: "Visão Geral" },
                { value: "patients", icon: Users, label: "Pacientes" },
                { value: "new-assessment", icon: Plus, label: "Nova Avaliação" },
                { value: "history", icon: Clock, label: "Histórico" }
              ].map((tab) => (
                <TabsTrigger 
                  key={tab.value}
                  value={tab.value}
                  className="data-[state=active]:bg-white data-[state=active]:text-primary data-[state=active]:shadow-lg text-white font-medium py-3 px-6 rounded-xl transition-all duration-200"
                >
                  <tab.icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="overview" className="space-y-8">
              {/* Feature Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[
                  {
                    icon: Brain,
                    title: "IA Avançada",
                    description: "Análise automatizada com precisão clínica",
                    badge: "Machine Learning",
                    details: "Algoritmos treinados para detectar e medir estruturas anatômicas com precisão médica certificada e validação contínua.",
                    color: "from-purple-500 to-purple-600"
                  },
                  {
                    icon: Smartphone,
                    title: "Tecnologia LiDAR",
                    description: "Medições 3D de alta precisão",
                    badge: "iPhone 12 Pro+",
                    details: "Utilize o sensor LiDAR do iPhone para capturar medidas tridimensionais com precisão sub-milimétrica e mapeamento em tempo real.",
                    color: "from-blue-500 to-blue-600"
                  },
                  {
                    icon: Ruler,
                    title: "Medição Manual",
                    description: "Opção tradicional com régua",
                    badge: "Método Clássico",
                    details: "Para casos onde a medição manual com régua é preferível ou necessária por questões de protocolo médico estabelecido.",
                    color: "from-green-500 to-green-600"
                  }
                ].map((feature, index) => (
                  <Card key={index} className="futuristic-card group overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-200`}>
                        <feature.icon className="h-6 w-6 text-white" />
                      </div>
                      <CardTitle className="flex items-center gap-2 text-primary text-lg">
                        {feature.title}
                      </CardTitle>
                      <CardDescription className="text-base">
                        {feature.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <Badge variant="secondary" className="bg-accent/20 text-primary font-medium">
                          {feature.badge}
                        </Badge>
                        <p className="text-sm text-muted-foreground leading-relaxed">
                          {feature.details}
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* How it Works Section */}
              <Card className="futuristic-card overflow-hidden">
                <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 border-b">
                  <CardTitle className="text-primary text-2xl flex items-center gap-3">
                    <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                      <Zap className="w-5 h-5 text-white" />
                    </div>
                    Como Funciona
                  </CardTitle>
                  <CardDescription className="text-lg">
                    Processo simplificado e otimizado em 4 etapas
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[
                      {
                        step: "1",
                        title: "Cadastro",
                        description: "Registre o paciente no sistema com informações básicas e dados pessoais",
                        icon: Users,
                        color: "bg-blue-500"
                      },
                      {
                        step: "2", 
                        title: "Captura",
                        description: "Capture a imagem usando LiDAR ou câmera tradicional com alta qualidade",
                        icon: Camera,
                        color: "bg-green-500"
                      },
                      {
                        step: "3",
                        title: "Análise IA",
                        description: "IA processa automaticamente e detecta pontos de medição com precisão",
                        icon: Brain,
                        color: "bg-purple-500"
                      },
                      {
                        step: "4",
                        title: "Resultados",
                        description: "Visualize medidas precisas, relatórios e histórico completo do paciente",
                        icon: BarChart3,
                        color: "bg-orange-500"
                      }
                    ].map((item, index) => (
                      <div key={index} className="relative flex flex-col items-center text-center space-y-4 group">
                        <div className={`relative w-16 h-16 ${item.color} rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-200`}>
                          {item.step}
                          <div className="absolute inset-0 bg-white/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-200"></div>
                        </div>
                        <div className={`w-10 h-10 ${item.color} rounded-xl flex items-center justify-center mb-2`}>
                          <item.icon className="w-5 h-5 text-white" />
                        </div>
                        <h3 className="font-bold text-primary text-lg">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed max-w-48">{item.description}</p>
                        {index < 3 && (
                          <ChevronRight className="h-6 w-6 text-primary/30 hidden lg:block absolute -right-4 top-8 group-hover:text-primary/60 transition-colors" />
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
