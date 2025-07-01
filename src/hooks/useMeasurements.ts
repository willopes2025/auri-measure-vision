
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Tables, TablesInsert } from '@/integrations/supabase/types';
import { useToast } from '@/hooks/use-toast';

type Measurement = Tables<'measurements'> & {
  patients: {
    nome: string;
    email: string;
  } | null;
};

type MeasurementInsert = TablesInsert<'measurements'>;
type MeasurementValueInsert = TablesInsert<'measurement_values'>;

export const useMeasurements = (patientId?: string) => {
  const [measurements, setMeasurements] = useState<Measurement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchMeasurements = async () => {
    try {
      setLoading(true);
      console.log('Buscando medições...', patientId ? `para paciente: ${patientId}` : 'todas');
      
      let query = supabase
        .from('measurements')
        .select(`
          *,
          patients!inner (
            nome,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (patientId) {
        query = query.eq('patient_id', patientId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Erro do Supabase ao buscar medições:', error);
        throw error;
      }
      
      console.log('Medições encontradas:', data?.length || 0);
      setMeasurements(data || []);
    } catch (error) {
      console.error('Erro ao buscar medições:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as medições",
        variant: "destructive",
      });
      setMeasurements([]);
    } finally {
      setLoading(false);
    }
  };

  const addMeasurement = async (
    measurementData: Omit<MeasurementInsert, 'id' | 'created_at' | 'updated_at'>,
    measurementValues?: Omit<MeasurementValueInsert, 'id' | 'measurement_id' | 'created_at'>[]
  ) => {
    try {
      console.log('Adicionando medição:', measurementData);
      
      // Inserir a medição principal
      const { data: measurement, error: measurementError } = await supabase
        .from('measurements')
        .insert(measurementData)
        .select()
        .single();

      if (measurementError) {
        console.error('Erro ao inserir medição:', measurementError);
        throw measurementError;
      }

      console.log('Medição adicionada com sucesso:', measurement);

      // Inserir os valores das medidas, se fornecidos
      if (measurementValues && measurementValues.length > 0) {
        const valuesWithMeasurementId = measurementValues.map(value => ({
          ...value,
          measurement_id: measurement.id,
        }));

        console.log('Adicionando valores de medição:', valuesWithMeasurementId);

        const { error: valuesError } = await supabase
          .from('measurement_values')
          .insert(valuesWithMeasurementId);

        if (valuesError) {
          console.error('Erro ao inserir valores de medição:', valuesError);
          throw valuesError;
        }

        console.log('Valores de medição adicionados com sucesso');
      }

      await fetchMeasurements();
      
      toast({
        title: "Sucesso",
        description: "Medição salva com sucesso",
      });
      
      return { data: measurement, error: null };
    } catch (error) {
      console.error('Erro ao salvar medição:', error);
      toast({
        title: "Erro",
        description: "Não foi possível salvar a medição",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const getMeasurementValues = async (measurementId: string) => {
    try {
      console.log('Buscando valores para medição:', measurementId);
      
      const { data, error } = await supabase
        .from('measurement_values')
        .select('*')
        .eq('measurement_id', measurementId)
        .order('measurement_type');

      if (error) {
        console.error('Erro ao buscar valores da medição:', error);
        throw error;
      }
      
      console.log('Valores encontrados:', data?.length || 0);
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro ao buscar valores da medição:', error);
      return { data: [], error };
    }
  };

  const updateMeasurement = async (id: string, updates: Partial<Omit<MeasurementInsert, 'id' | 'created_at' | 'updated_at'>>) => {
    try {
      console.log('Atualizando medição:', id, updates);
      
      const { data, error } = await supabase
        .from('measurements')
        .update(updates)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Erro ao atualizar medição:', error);
        throw error;
      }
      
      console.log('Medição atualizada com sucesso:', data);
      await fetchMeasurements();
      
      toast({
        title: "Sucesso",
        description: "Medição atualizada com sucesso",
      });
      
      return { data, error: null };
    } catch (error) {
      console.error('Erro ao atualizar medição:', error);
      toast({
        title: "Erro",
        description: "Não foi possível atualizar a medição",
        variant: "destructive",
      });
      return { data: null, error };
    }
  };

  const deleteMeasurement = async (id: string) => {
    try {
      console.log('Removendo medição:', id);
      
      const { error } = await supabase
        .from('measurements')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Erro ao remover medição:', error);
        throw error;
      }
      
      console.log('Medição removida com sucesso');
      await fetchMeasurements();
      
      toast({
        title: "Sucesso",
        description: "Medição removida com sucesso",
      });
      
      return { error: null };
    } catch (error) {
      console.error('Erro ao remover medição:', error);
      toast({
        title: "Erro",
        description: "Não foi possível remover a medição",
        variant: "destructive",
      });
      return { error };
    }
  };

  useEffect(() => {
    fetchMeasurements();
  }, [patientId]);

  return {
    measurements,
    loading,
    addMeasurement,
    getMeasurementValues,
    updateMeasurement,
    deleteMeasurement,
    refetch: fetchMeasurements,
  };
};
