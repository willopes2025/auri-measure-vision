
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Users, Plus, Search, UserPlus, Calendar, Mail } from "lucide-react";
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
    <div className="space-y-8">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row gap-6 justify-between items-start sm:items-center">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-blue-400 w-5 h-5" />
          <Input
            placeholder="Buscar paciente por nome ou email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-12 h-12 bg-white/50 backdrop-blur-sm border-blue-200/50 focus:border-blue-400 focus:ring-blue-400/20 transition-all duration-300"
          />
        </div>
        
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-gradient-to-r from-blue-900 to-blue-800 text-white hover:from-blue-800 hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300 h-12 px-6 neon-border">
              <Plus className="w-5 h-5 mr-2" />
              Nova Paciente
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md futuristic-card border-0">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-3 text-xl">
                <div className="p-2 bg-blue-900/10 rounded-lg">
                  <UserPlus className="w-5 h-5 text-blue-900" />
                </div>
                Cadastrar Nova Paciente
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-6 pt-6">
              <div className="space-y-2">
                <Label htmlFor="nome" className="text-sm font-medium text-slate-700">Nome Completo</Label>
                <Input
                  id="nome"
                  value={newPatient.nome}
                  onChange={(e) => setNewPatient({...newPatient, nome: e.target.value})}
                  placeholder="Digite o nome completo"
                  className="h-11 bg-white/50 border-blue-200/50 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="data_nascimento" className="text-sm font-medium text-slate-700">Data de Nascimento</Label>
                <Input
                  id="data_nascimento"
                  type="date"
                  value={newPatient.data_nascimento}
                  onChange={(e) => setNewPatient({...newPatient, data_nascimento: e.target.value})}
                  className="h-11 bg-white/50 border-blue-200/50 focus:border-blue-400"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-medium text-slate-700">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={newPatient.email}
                  onChange={(e) => setNewPatient({...newPatient, email: e.target.value})}
                  placeholder="email@exemplo.com"
                  className="h-11 bg-white/50 border-blue-200/50 focus:border-blue-400"
                />
              </div>
              <Button 
                onClick={handleAddPatient} 
                className="w-full h-12 bg-gradient-to-r from-blue-900 to-blue-800 text-white hover:from-blue-800 hover:to-blue-700 shadow-lg transition-all duration-300"
              >
                Cadastrar Paciente
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      {/* Patients Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {filteredPatients.map((patient) => (
          <Card key={patient.id} className="futuristic-card hover:shadow-2xl transition-all duration-300 cursor-pointer border-l-4 border-l-blue-600 group">
            <CardHeader className="pb-4">
              <div className="flex items-center space-x-4">
                <Avatar className="h-14 w-14 border-2 border-blue-200">
                  <AvatarFallback className="bg-gradient-to-br from-blue-100 to-blue-50 text-blue-900 font-bold text-lg">
                    {getInitials(patient.nome)}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <CardTitle className="text-lg truncate text-slate-800 group-hover:text-blue-900 transition-colors">
                    {patient.nome}
                  </CardTitle>
                  <p className="text-sm text-slate-500 truncate flex items-center gap-1">
                    <Mail className="w-3 h-3" />
                    {patient.email}
                  </p>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0 space-y-4">
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    Idade:
                  </span>
                  <span className="font-semibold text-slate-700">
                    {calculateAge(patient.data_nascimento)} anos
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-500">Cadastro:</span>
                  <span className="font-semibold text-slate-700">
                    {new Date(patient.created_at).toLocaleDateString('pt-BR')}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-slate-500">Medições:</span>
                  <Badge 
                    variant={patient.totalMeasurements > 0 ? "default" : "secondary"}
                    className={patient.totalMeasurements > 0 ? "bg-blue-900 hover:bg-blue-800" : ""}
                  >
                    {patient.totalMeasurements}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredPatients.length === 0 && (
        <div className="text-center py-16">
          <div className="futuristic-card max-w-md mx-auto p-8">
            <Users className="w-20 h-20 text-blue-300 mx-auto mb-6" />
            <h3 className="text-xl font-semibold text-slate-700 mb-3">
              {searchTerm ? "Nenhuma paciente encontrada" : "Nenhuma paciente cadastrada"}
            </h3>
            <p className="text-slate-500 mb-8">
              {searchTerm 
                ? "Tente ajustar os termos de busca" 
                : "Comece cadastrando sua primeira paciente"
              }
            </p>
            {!searchTerm && (
              <Button 
                onClick={() => setIsDialogOpen(true)} 
                className="bg-gradient-to-r from-blue-900 to-blue-800 text-white hover:from-blue-800 hover:to-blue-700 shadow-lg px-8 py-3"
              >
                <Plus className="w-5 h-5 mr-2" />
                Cadastrar Primeira Paciente
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PatientList;
