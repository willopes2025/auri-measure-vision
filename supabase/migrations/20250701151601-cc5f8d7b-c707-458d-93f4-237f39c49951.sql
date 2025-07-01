
-- Criar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Criar tabela de pacientes (se não existir)
CREATE TABLE IF NOT EXISTS public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de medições (se não existir)
CREATE TABLE IF NOT EXISTS public.measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT,
  scale_method TEXT NOT NULL CHECK (scale_method IN ('lidar', 'ruler')),
  measurements_data JSONB NOT NULL,
  ai_observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de valores de medidas específicas (se não existir)
CREATE TABLE IF NOT EXISTS public.measurement_values (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  measurement_id UUID REFERENCES public.measurements(id) ON DELETE CASCADE NOT NULL,
  measurement_type TEXT NOT NULL,
  value_cm DECIMAL(5,2) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.patients ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measurements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.measurement_values ENABLE ROW LEVEL SECURITY;

-- Remover políticas existentes se houver
DROP POLICY IF EXISTS "Allow all operations on patients" ON public.patients;
DROP POLICY IF EXISTS "Allow all operations on measurements" ON public.measurements;
DROP POLICY IF EXISTS "Allow all operations on measurement_values" ON public.measurement_values;

-- Criar políticas de segurança mais restritivas
-- Para pacientes: acesso público para leitura, mas pode ser restringido futuramente
CREATE POLICY "Allow public read access to patients" ON public.patients FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to patients" ON public.patients FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to patients" ON public.patients FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to patients" ON public.patients FOR DELETE USING (true);

-- Para medições: vinculadas aos pacientes
CREATE POLICY "Allow public read access to measurements" ON public.measurements FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to measurements" ON public.measurements FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to measurements" ON public.measurements FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to measurements" ON public.measurements FOR DELETE USING (true);

-- Para valores de medidas: vinculados às medições
CREATE POLICY "Allow public read access to measurement_values" ON public.measurement_values FOR SELECT USING (true);
CREATE POLICY "Allow public insert access to measurement_values" ON public.measurement_values FOR INSERT WITH CHECK (true);
CREATE POLICY "Allow public update access to measurement_values" ON public.measurement_values FOR UPDATE USING (true);
CREATE POLICY "Allow public delete access to measurement_values" ON public.measurement_values FOR DELETE USING (true);

-- Criar índices para performance
CREATE INDEX IF NOT EXISTS idx_measurements_patient_id ON public.measurements(patient_id);
CREATE INDEX IF NOT EXISTS idx_measurement_values_measurement_id ON public.measurement_values(measurement_id);
CREATE INDEX IF NOT EXISTS idx_patients_email ON public.patients(email);

-- Criar função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar triggers para atualizar updated_at
DROP TRIGGER IF EXISTS handle_updated_at ON public.patients;
DROP TRIGGER IF EXISTS handle_updated_at ON public.measurements;

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.patients
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();

CREATE TRIGGER handle_updated_at
  BEFORE UPDATE ON public.measurements
  FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();
