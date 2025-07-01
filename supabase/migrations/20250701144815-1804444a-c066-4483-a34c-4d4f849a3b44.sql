
-- Criar tabela de pacientes
CREATE TABLE public.patients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  data_nascimento DATE NOT NULL,
  email TEXT NOT NULL UNIQUE,
  telefone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de medições
CREATE TABLE public.measurements (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  patient_id UUID REFERENCES public.patients(id) ON DELETE CASCADE NOT NULL,
  image_url TEXT,
  scale_method TEXT NOT NULL CHECK (scale_method IN ('lidar', 'ruler')),
  measurements_data JSONB NOT NULL,
  ai_observations TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de medidas específicas
CREATE TABLE public.measurement_values (
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

-- Criar políticas básicas (acesso público por enquanto - depois implementaremos autenticação)
CREATE POLICY "Allow all operations on patients" ON public.patients FOR ALL USING (true);
CREATE POLICY "Allow all operations on measurements" ON public.measurements FOR ALL USING (true);
CREATE POLICY "Allow all operations on measurement_values" ON public.measurement_values FOR ALL USING (true);

-- Criar índices para performance
CREATE INDEX idx_measurements_patient_id ON public.measurements(patient_id);
CREATE INDEX idx_measurement_values_measurement_id ON public.measurement_values(measurement_id);
CREATE INDEX idx_patients_email ON public.patients(email);
