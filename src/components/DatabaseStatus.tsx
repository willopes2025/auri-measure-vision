
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Database, CheckCircle, XCircle, RefreshCw } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface DatabaseStatus {
  connected: boolean;
  patients: number;
  measurements: number;
  lastCheck: Date;
}

export const DatabaseStatus: React.FC = () => {
  const [status, setStatus] = useState<DatabaseStatus>({
    connected: false,
    patients: 0,
    measurements: 0,
    lastCheck: new Date()
  });
  const [loading, setLoading] = useState(true);

  const checkDatabaseStatus = async () => {
    setLoading(true);
    try {
      console.log('Verificando status do banco de dados...');

      // Testar conexão e contar registros
      const [patientsResult, measurementsResult] = await Promise.all([
        supabase.from('patients').select('id', { count: 'exact', head: true }),
        supabase.from('measurements').select('id', { count: 'exact', head: true })
      ]);

      const patientsCount = patientsResult.count || 0;
      const measurementsCount = measurementsResult.count || 0;
      const connected = !patientsResult.error && !measurementsResult.error;

      console.log('Status do banco:', {
        connected,
        patients: patientsCount,
        measurements: measurementsCount
      });

      setStatus({
        connected,
        patients: patientsCount,
        measurements: measurementsCount,
        lastCheck: new Date()
      });
    } catch (error) {
      console.error('Erro ao verificar status do banco:', error);
      setStatus(prev => ({
        ...prev,
        connected: false,
        lastCheck: new Date()
      }));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    checkDatabaseStatus();
  }, []);

  return (
    <Card className="futuristic-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-primary">
            <Database className="h-5 w-5" />
            Status do Banco de Dados
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={checkDatabaseStatus}
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Atualizar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-2">
          {status.connected ? (
            <CheckCircle className="h-5 w-5 text-green-500" />
          ) : (
            <XCircle className="h-5 w-5 text-red-500" />
          )}
          <span className="font-medium">
            Conexão: 
          </span>
          <Badge variant={status.connected ? 'default' : 'destructive'}>
            {status.connected ? 'Conectado' : 'Desconectado'}
          </Badge>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-blue-600">{status.patients}</div>
            <div className="text-sm text-blue-600">Pacientes</div>
          </div>
          <div className="bg-green-50 p-3 rounded-lg text-center">
            <div className="text-2xl font-bold text-green-600">{status.measurements}</div>
            <div className="text-sm text-green-600">Medições</div>
          </div>
        </div>

        <div className="text-xs text-muted-foreground text-center">
          Última verificação: {status.lastCheck.toLocaleTimeString('pt-BR')}
        </div>
      </CardContent>
    </Card>
  );
};
