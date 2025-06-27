
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, Search } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Patient {
  id: string;
  nome: string;
  data_nascimento: string;
  email: string;
  created_at: string;
  totalMeasurements: number;
}

const PatientList = () => {
  const { toast } = useToast();
  const [patients, setPatients] = useState<Patient[]>([
    {
      id: "1",
      nome: "Maria Silva Santos",
      data_nascimento: "1985-03-15",
      email: "maria.silva@email.com",
      created_at: "2024-01-15",
      totalMeasurements: 3
    },
    {
      id: "2", 
      nome: "Ana Paula Costa",
      data_nascimento: "1990-07-22",
      email: "ana.costa@email.com",
      created_at: "2024-02-10",
      totalMeasurements: 1
    },
    {
      id: "3",
      nome: "Fernanda Oliveira",
      data_nascimento: "1978-11-08",
      email: "fernanda.oliveira@email.com", 
      created_at: "2024-01-28",
      totalMeasurements: 2
    }
  ]);

  const [newPatient, setNewPatient] = useState({
    nome: "",
    data_nascimento: "",
    email: ""
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleAddPatient = () => {
    if (!newPatient.nome || !newPatient.data_nascimento || !newPatient.email) {
      toast({
        title: "Campos obrigatórios",
        description: "Por favor, preencha todos os campos.",
        variant: "destructive",
      });
      return;
    }

    const patient: Patient = {
      id: Date.now().toString(),
      ...newPatient,
      created_at: new Date().toISOString().split('T')[0],
      totalMeasurements: 0
    };

    setPatients([...patients, patient]);
    setNewPatient({ nome: "", data_nascimento: "", email: "" });
    setIsDialogOpen(false);
    
    toast({
      title: "Paciente cadastrada",
      description: `${patient.nome} foi adicionada com sucesso.`,
    });
  };

  const filteredPatients = patients.filter(patient =>
    patient.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
    patient.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
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

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Buscar paciente por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="medical-gradient text-white hover:opacity-90 transition-all">
              <Plus className="w-4 h-4 mr-2" />
              Nova Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                Cadastrar Nova Paciente
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 pt-4">
              <div>
                <Label htmlFor="nome">Nome Completo</Label>
                <Input
                  id="nome"
                  value={newPatient.nome}
                  onChange={(e) => setNewPatient({...newPatient, nome: e.target.value})}
                  placeholder="Digite o nome completo"
                />
              </div>
              <div>
                <Label htmlFor="data_nascimento">Data de Nascimento</Label>
                <Input
                  id="data_nascimento"
                  type="date"
                  value={newPatient.data_nascimento}
                  onChange={(e) => setNewPatient({...newPatient, data_nascimento: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                  placeholder="email@exemplo.com"
                />
              </div>
              <Button onClick={handleAddPatient} className="w-full medical-gradient text-white">
                Cadastrar Paciente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Patients Grid */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="hover:shadow-md transition-shadow cursor-pointer border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-blue-100 text-blue-700 font-semibold">
                    {getInitials(patient.nome)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate">{patient.nome}</CardTitle>
                  <p className="text-sm text-muted-foreground truncate">{patient.email}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Idade:</span>
                  <span className="font-medium">{calculateAge(patient.data_nascimento)} anos</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-muted-foreground">Cadastro:</span>
                  <span className="font-medium">
                    {new Date(patient.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Medições:</span>
                  <Badge variant={patient.totalMeasurements > 0 ? "default" : "secondary"}>
                    {patient.totalMeasurements}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-12">
          <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-600 mb-2">
            {searchTerm ? "Nenhuma paciente encontrada" : "Nenhuma paciente cadastrada"}
          </h3>
          <p className="text-gray-500 mb-6">
            {searchTerm 
              ? "Tente ajustar os termos de busca" 
              : "Comece cadastrando sua primeira paciente"
            }
          </p>
          {!searchTerm && (
            <Button onClick={() => setIsDialogOpen(true)} className="medical-gradient text-white">
              <Plus className="w-4 h-4 mr-2" />
              Cadastrar Primeira Paciente
            </Button>
          )}
        </div>
      )}
    </div>
  );
};

export default PatientList;
