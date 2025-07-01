
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
      let query = supabase
        .from('measurements')
        .select(`
          *,
          patients (
            nome,
            email
          )
        `)
        .order('created_at', { ascending: false });

      if (patientId) {
        query = query.eq('patient_id', patientId);
      }

      const { data, error } = await query;

      if (error) throw error;
      setMeasurements(data || []);
    } catch (error) {
      console.error('Erro ao buscar medições:', error);
      toast({
        title: "Erro",
        description: "Não foi possível carregar as medições",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addMeasurement = async (
    measurementData: Omit<MeasurementInsert, 'id' | 'created_at' | 'updated_at'>,
    measurementValues: Omit<MeasurementValueInsert, 'id' | 'measurement_id' | 'created_at'>[]
  ) => {
    try {
      // Inserir a medição principal
      const { data: measurement, error: measurementError } = await supabase
        .from('measurements')
        .insert(measurementData)
        .select()
        .single();

      if (measurementError) throw measurementError;

      // Inserir os valores das medidas
      if (measurementValues.length > 0) {
        const valuesWithMeasurementId = measurementValues.map(value => ({
          ...value,
          measurement_id: measurement.id,
        }));

        const { error: valuesError } = await supabase
          .from('measurement_values')
          .insert(valuesWithMeasurementId);

        if (valuesError) throw valuesError;
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
      const { data, error } = await supabase
        .from('measurement_values')
        .select('*')
        .eq('measurement_id', measurementId)
        .order('measurement_type');

      if (error) throw error;
      return { data: data || [], error: null };
    } catch (error) {
      console.error('Erro ao buscar valores da medição:', error);
      return { data: [], error };
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
    refetch: fetchMeasurements,
  };
};
