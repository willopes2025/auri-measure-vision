
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type Patient = Tables<'patients'>;
type PatientInsert = TablesInsert<'patients'>;

export const usePatients = () => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchPatients = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('patients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPatients(data || []);
    } catch (error) {
      console.error('Erro ao buscar pacientes:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar a lista de pacientes",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addPatient = async (patientData: Omit<PatientInsert, 'id' | 'created_at' | 'updated_at'>) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .insert(patientData)
        .select()
        .single();

      if (error) throw error;
      
      setPatients(prev => [data, ...prev]);
      toast({
        title: "Sucesso",
        description: "Paciente cadastrado com sucesso",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao cadastrar paciente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível cadastrar o paciente",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const updatePatient = async (id: string, updates: Partial<PatientInsert>) => {
    try {
      const { data, error } = await supabase
        .from('patients')
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      
      setPatients(prev => prev.map(p => p.id === id ? data : p));
      toast({
        title: "Sucesso",
        description: "Paciente atualizado com sucesso",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar paciente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar o paciente",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deletePatient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('patients')
        .delete()
        .eq('id', id);

      if (error) throw error;
      
      setPatients(prev => prev.filter(p => p.id !== id));
      toast({
        title: "Sucesso",
        description: "Paciente removido com sucesso",
      });
      
      return { error: null };
    } catch (error) {
      console.error('Erro ao remover paciente:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover o paciente",
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchPatients();
  }, []);

  return {
    patients,
    loading,
    addPatient,
    updatePatient,
    deletePatient,
    refetch: fetchPatients,
  };
};
