import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Camera, Upload, Smartphone, Ruler, CheckCircle, AlertTriangle, Download } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  nome: string;
}

const NewAssessment = () => {
  const { toast } = useToast();
  const [selectedPatient, setSelectedPatient] = useState<string>("");
  const [step, setStep] = useState<"select" | "capture" | "processing" | "result">("select");
  const [scaleMethod, setScaleMethod] = useState<"lidar" | "ruler" | null>(null);
  const [progress, setProgress] = useState(0);
  const [isLidarAvailable, setIsLidarAvailable] = useState(true); // Simulate LiDAR availability

  const patients: Patient[] = [
    { id: "1", nome: "Maria Silva Santos" },
    { id: "2", nome: "Ana Paula Costa" },
    { id: "3", nome: "Fernanda Oliveira" }
  ];

  const handlePatientSelect = (patientId: string) => {
    setSelectedPatient(patientId);
    const patient = patients.find(p => p.id === patientId);
    if (patient) {
      toast({
        title: "Paciente selecionada",
        description: `${patient.nome} foi selecionada para avaliação.`,
      });
    }
  };

  const handleScaleMethodSelect = (method: "lidar" | "ruler") => {
    setScaleMethod(method);
    setStep("capture");
    
    if (method === "lidar" && !isLidarAvailable) {
      toast({
        title: "LiDAR não disponível",
        description: "Usando método de régua como alternativa.",
        variant: "destructive",
      });
      setScaleMethod("ruler");
    }
  };

  const simulateCapture = () => {
    setStep("processing");
    setProgress(0);
    
    // Simulate processing with progress updates
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setTimeout(() => setStep("result"), 500);
          return 100;
        }
        return prev + 10;
      });
    }, 300);

    toast({
      title: "Processamento iniciado",
      description: "Analisando imagem e detectando pontos anatômicos...",
    });
  };

  const resetAssessment = () => {
    setStep("select");
    setSelectedPatient("");
    setScaleMethod(null);
    setProgress(0);
  };

  const selectedPatientName = patients.find(p => p.id === selectedPatient)?.nome;

  return (
    <div className="space-y-6">
      {/* Step Indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {["select", "capture", "processing", "result"].map((stepName, index) => (
          <div key={stepName} className="flex items-center">
            <div className={`
              w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
              ${step === stepName ? "bg-blue-600 text-white" : 
                ["select", "capture", "processing", "result"].indexOf(step) > index ? 
                "bg-green-600 text-white" : "bg-gray-200 text-gray-600"}
            `}>
              {["select", "capture", "processing", "result"].indexOf(step) > index ? (
                <CheckCircle className="w-4 h-4" />
              ) : (
                index + 1
              )}
            </div>
            {index < 3 && (
              <div className={`w-12 h-0.5 ${
                ["select", "capture", "processing", "result"].indexOf(step) > index ? 
                "bg-green-600" : "bg-gray-200"
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Patient Selection */}
      {step === "select" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              Selecionar Paciente
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Escolha a paciente para avaliação:
              </label>
              <Select value={selectedPatient} onValueChange={handlePatientSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione uma paciente..." />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {selectedPatient && (
              <div className="mt-6">
                <h3 className="font-medium mb-4">Método de Escala:</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <Card 
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isLidarAvailable ? "border-blue-200 hover:border-blue-400" : "border-gray-200 opacity-50"
                    }`}
                    onClick={() => isLidarAvailable && handleScaleMethodSelect("lidar")}
                  >
                    <CardContent className="p-4 text-center">
                      <Smartphone className={`w-12 h-12 mx-auto mb-3 ${
                        isLidarAvailable ? "text-blue-600" : "text-gray-400"
                      }`} />
                      <h4 className="font-medium mb-2">LiDAR / ARKit</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Medição automática de distância real usando sensores do iPhone
                      </p>
                      <Badge variant={isLidarAvailable ? "default" : "secondary"}>
                        {isLidarAvailable ? "Disponível" : "Não Disponível"}
                      </Badge>
                    </CardContent>
                  </Card>

                  <Card 
                    className="cursor-pointer transition-all hover:shadow-md border-green-200 hover:border-green-400"
                    onClick={() => handleScaleMethodSelect("ruler")}
                  >
                    <CardContent className="p-4 text-center">
                      <Ruler className="w-12 h-12 mx-auto mb-3 text-green-600" />
                      <h4 className="font-medium mb-2">Régua Física</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Use uma régua de 10cm visível na imagem para calibração
                      </p>
                      <Badge variant="outline" className="border-green-600 text-green-600">
                        Sempre Disponível
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Step 2: Image Capture */}
      {step === "capture" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Camera className="w-5 h-5 text-blue-600" />
              Captura de Imagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                <strong>Instruções importantes:</strong><br />
                • Posicione a paciente com braços relaxados ao lado do corpo<br />
                • Certifique-se de boa iluminação uniforme<br />
                • {scaleMethod === "ruler" ? "Inclua uma régua de 10cm visível na imagem" : "Mantenha o dispositivo estável para medição LiDAR"}<br />
                • Foto deve ser frontal, capturando todo o tórax
              </AlertDescription>
            </Alert>

            <div className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <Camera className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-700 mb-2">Zona de Captura</h3>
              <p className="text-gray-500 mb-6">
                Paciente: <strong>{selectedPatientName}</strong><br />
                Método: <strong>{scaleMethod === "lidar" ? "LiDAR" : "Régua Física"}</strong>
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button onClick={simulateCapture} className="medical-gradient text-white">
                  <Camera className="w-4 h-4 mr-2" />
                  Abrir Câmera
                </Button>
                <Button variant="outline" onClick={simulateCapture}>
                  <Upload className="w-4 h-4 mr-2" />
                  Upload de Arquivo
                </Button>
              </div>
            </div>

            <Button variant="outline" onClick={resetAssessment} className="w-full">
              Voltar à Seleção
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Step 3: Processing */}
      {step === "processing" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
              Processando Imagem
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="text-center">
              <h3 className="text-lg font-medium mb-2">Análise em Progresso</h3>
              <p className="text-gray-600 mb-6">
                Detectando pontos anatômicos e calculando medidas para {selectedPatientName}
              </p>
              
              <Progress value={progress} className="w-full mb-4" />
              <p className="text-sm text-gray-500">{progress}% concluído</p>
            </div>

            <div className="bg-blue-50 p-4 rounded-lg">
              <h4 className="font-medium text-blue-900 mb-2">Etapas do Processamento:</h4>
              <ul className="text-sm text-blue-800 space-y-1">
                <li>✓ Detecção de pontos anatômicos (Roboflow YOLOv8)</li>
                <li>✓ Calibração de escala ({scaleMethod === "lidar" ? "LiDAR" : "Régua"})</li>
                <li>✓ Cálculo de distâncias em centímetros</li>
                <li>✓ Geração de overlay e análise IA</li>
                <li>○ Preparando relatório final...</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Step 4: Results */}
      {step === "result" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-green-600" />
              Resultados da Avaliação
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                Análise concluída com sucesso! Todas as medidas foram calculadas e validadas.
              </AlertDescription>
            </Alert>

            {/* Simulated overlay image */}
            <div className="bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
              <div className="w-full h-64 bg-gradient-to-br from-blue-100 to-green-100 rounded-lg flex items-center justify-center mb-4">
                <div className="text-center">
                  <Camera className="w-16 h-16 text-gray-500 mx-auto mb-2" />
                  <p className="text-gray-600">Imagem com Overlay de Medições</p>
                  <p className="text-sm text-gray-500">Pontos anatômicos detectados e marcados</p>
                </div>
              </div>
            </div>

            {/* Measurements Table */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Medidas Principais</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>IJ-AP (Incisura jugular - Mamilo):</span>
                      <strong>23.4 cm</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Ax-AP (Axila - Mamilo):</span>
                      <strong>15.1 cm</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>XI-PAP (Xifoide - Mamilo):</span>
                      <strong>20.9 cm</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Base mamária:</span>
                      <strong>4.5 cm</strong>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-4">
                  <h4 className="font-medium mb-3">Informações Técnicas</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Método de escala:</span>
                      <Badge variant="outline">
                        {scaleMethod === "lidar" ? "LiDAR" : "Régua"}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span>Fator cm/pixel:</span>
                      <strong>0.156</strong>
                    </div>
                    <div className="flex justify-between">
                      <span>Precisão:</span>
                      <Badge className="bg-green-100 text-green-800">±0.2mm</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* AI Observations */}
            <Card>
              <CardContent className="p-4">
                <h4 className="font-medium mb-3">Observações da IA</h4>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Análise anatômica indica simetria adequada entre as medidas bilaterais. 
                  As proporções estão dentro dos parâmetros normais para o biotipo da paciente. 
                  Recomenda-se acompanhamento periódico para monitoramento evolutivo.
                </p>
              </CardContent>
            </Card>

            <div className="flex flex-col sm:flex-row gap-4">
              <Button className="accent-gradient text-white flex-1">
                <Download className="w-4 h-4 mr-2" />
                Baixar Relatório PDF
              </Button>
              <Button variant="outline" onClick={resetAssessment} className="flex-1">
                Nova Avaliação
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default NewAssessment;
