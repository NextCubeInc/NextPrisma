import React, { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { 
  Database, 
  CheckCircle, 
  XCircle, 
  Loader2, 
  RefreshCw, 
  Info,
  Users,
  Play
} from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useAuth } from '../contexts/AuthContext'

interface TestResult {
  name: string
  success: boolean
  message: string
  data?: any
}

export default function DatabaseTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [lastTestTime, setLastTestTime] = useState<Date | null>(null)
  const { user } = useAuth()

  useEffect(() => {
    runTests()
  }, [])

  const runTests = async () => {
    setIsLoading(true)
    const results: TestResult[] = []

    try {
      // Teste 1: Conexão básica
      try {
        const { data, error } = await supabase.from('users').select('count', { count: 'exact' })
        if (error) throw error
        results.push({
          name: 'Conexão com Supabase',
          success: true,
          message: 'Conexão estabelecida com sucesso',
          data: { userCount: data?.length || 0 }
        })
      } catch (error) {
        results.push({
          name: 'Conexão com Supabase',
          success: false,
          message: `Erro na conexão: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        })
      }

      // Teste 2: Autenticação
      try {
        const { data: { user: currentUser } } = await supabase.auth.getUser()
        results.push({
          name: 'Autenticação',
          success: !!currentUser,
          message: currentUser ? `Usuário autenticado: ${currentUser.email}` : 'Nenhum usuário autenticado',
          data: { userId: currentUser?.id, email: currentUser?.email }
        })
      } catch (error) {
        results.push({
          name: 'Autenticação',
          success: false,
          message: `Erro na autenticação: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        })
      }

      // Teste 3: Listar tabelas (usando informações do schema)
      try {
        const { data, error } = await supabase
          .from('information_schema.tables')
          .select('table_name')
          .eq('table_schema', 'public')
        
        if (error) throw error
        results.push({
          name: 'Estrutura do Banco',
          success: true,
          message: `${data?.length || 0} tabelas encontradas`,
          data: { tables: data?.map(t => t.table_name) || [] }
        })
      } catch (error) {
        // Se não conseguir acessar information_schema, tenta uma abordagem alternativa
        results.push({
          name: 'Estrutura do Banco',
          success: false,
          message: 'Não foi possível acessar informações do schema (normal em alguns casos)',
          data: { note: 'Isso pode ser normal dependendo das permissões do banco' }
        })
      }

      // Teste 4: Operação de leitura simples
      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .limit(5)
        
        if (error) throw error
        results.push({
          name: 'Leitura de Dados',
          success: true,
          message: `Leitura realizada com sucesso. ${data?.length || 0} registros encontrados`,
          data: { records: data?.length || 0 }
        })
      } catch (error) {
        results.push({
          name: 'Leitura de Dados',
          success: false,
          message: `Erro na leitura: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
        })
      }

      // Teste 5: Verificar configurações
      const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
      const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY
      
      results.push({
        name: 'Configurações',
        success: !!(supabaseUrl && supabaseKey),
        message: supabaseUrl && supabaseKey ? 'Variáveis de ambiente configuradas' : 'Variáveis de ambiente faltando',
        data: { 
          hasUrl: !!supabaseUrl, 
          hasKey: !!supabaseKey,
          url: supabaseUrl ? `${supabaseUrl.substring(0, 20)}...` : 'Não configurada'
        }
      })

    } catch (error) {
      results.push({
        name: 'Erro Geral',
        success: false,
        message: `Erro inesperado: ${error instanceof Error ? error.message : 'Erro desconhecido'}`
      })
    }

    setTestResults(results)
    setLastTestTime(new Date())
    setIsLoading(false)
  }

  const getStatusIcon = (success: boolean) => {
    return success ? (
      <CheckCircle className="h-5 w-5 text-green-500" />
    ) : (
      <XCircle className="h-5 w-5 text-red-500" />
    )
  }

  const getStatusBadge = (success: boolean) => {
    return (
      <Badge variant={success ? "default" : "destructive"}>
        {success ? "Sucesso" : "Falha"}
      </Badge>
    )
  }

  const successCount = testResults.filter(r => r.success).length
  const totalTests = testResults.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Teste de Banco de Dados</h1>
          <p className="text-muted-foreground">
            Verificação da conectividade e funcionalidade do Supabase
          </p>
        </div>
        <Button onClick={runTests} disabled={isLoading}>
          {isLoading ? (
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
          ) : (
            <RefreshCw className="mr-2 h-4 w-4" />
          )}
          {isLoading ? 'Testando...' : 'Executar Testes'}
        </Button>
      </div>

      {/* Resumo dos Testes */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total de Testes</CardTitle>
            <Play className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTests}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Sucessos</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{successCount}</div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Falhas</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{totalTests - successCount}</div>
          </CardContent>
        </Card>
      </div>

      {/* Status Geral */}
      {testResults.length > 0 && (
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            {successCount === totalTests 
              ? "Todos os testes passaram! O Supabase está funcionando corretamente."
              : `${successCount} de ${totalTests} testes passaram. Verifique os erros abaixo.`
            }
            {lastTestTime && (
              <span className="block mt-1 text-xs text-muted-foreground">
                Último teste: {lastTestTime.toLocaleString()}
              </span>
            )}
          </AlertDescription>
        </Alert>
      )}

      {/* Resultados Detalhados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Resultados dos Testes
          </CardTitle>
          <CardDescription>
            Detalhes de cada teste executado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin" />
              <span className="ml-2">Executando testes...</span>
            </div>
          ) : testResults.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              Nenhum teste executado ainda
            </div>
          ) : (
            <div className="space-y-4">
              {testResults.map((result, index) => (
                <div key={index} className="flex items-start gap-3 p-4 border rounded-lg">
                  {getStatusIcon(result.success)}
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <h4 className="font-medium">{result.name}</h4>
                      {getStatusBadge(result.success)}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {result.message}
                    </p>
                    {result.data && (
                      <details className="mt-2">
                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                          Ver detalhes
                        </summary>
                        <pre className="text-xs bg-muted p-2 rounded mt-1 overflow-auto">
                          {JSON.stringify(result.data, null, 2)}
                        </pre>
                      </details>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Informações do Usuário */}
      {user && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Informações do Usuário
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">Email:</span>
                <span className="text-sm">{user.email}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">ID:</span>
                <span className="text-sm font-mono">{user.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm font-medium">Criado em:</span>
                <span className="text-sm">{new Date(user.created_at).toLocaleString()}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}