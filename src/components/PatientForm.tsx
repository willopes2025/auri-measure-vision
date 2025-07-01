
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Calendar } from 'lucide-react';
import { usePatients } from '@/hooks/usePatients';

interface PatientFormProps {
  onSuccess?: () => void;
}

export const PatientForm: React.FC<PatientFormProps> = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    nome: '',
    data_nascimento: '',
    email: '',
    telefone: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addPatient } = usePatients();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const { error } = await addPatient(formData);
      
      if (!error) {
        setFormData({
          nome: '',
          data_nascimento: '',
          email: '',
          telefone: '',
        });
        onSuccess?.();
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="card-blue-gradient">
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-white">
          <User className="h-5 w-5" />
          Cadastro de Paciente
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome" className="text-sm font-medium text-white">
              Nome Completo
            </Label>
            <div className="relative">
              <User className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
              <Input
                id="nome"
                type="text"
                placeholder="Digite o nome completo"
                value={formData.nome}
                onChange={(e) => handleChange('nome', e.target.value)}
                className="pl-10 medical-input"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="data_nascimento" className="text-sm font-medium text-white">
              Data de Nascimento
            </Label>
            <div className="relative">
              <Calendar className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
              <Input
                id="data_nascimento"
                type="date"
                value={formData.data_nascimento}
                onChange={(e) => handleChange('data_nascimento', e.target.value)}
                className="pl-10 medical-input"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium text-white">
              Email
            </Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
              <Input
                id="email"
                type="email"
                placeholder="email@exemplo.com"
                value={formData.email}
                onChange={(e) => handleChange('email', e.target.value)}
                className="pl-10 medical-input"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="telefone" className="text-sm font-medium text-white">
              Telefone (opcional)
            </Label>
            <div className="relative">
              <Phone className="absolute left-3 top-3 h-4 w-4 text-blue-300" />
              <Input
                id="telefone"
                type="tel"
                placeholder="(11) 99999-9999"
                value={formData.telefone}
                onChange={(e) => handleChange('telefone', e.target.value)}
                className="pl-10 medical-input"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full medical-button font-medium transition-all duration-200"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Cadastrando...' : 'Cadastrar Paciente'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
