// Configuração de ambiente para o Supabase
export const env = {
  SUPABASE_URL: import.meta.env.VITE_SUPABASE_URL || 'sua_url_do_supabase_aqui',
  SUPABASE_ANON_KEY: import.meta.env.VITE_SUPABASE_ANON_KEY || 'sua_chave_anonima_do_supabase_aqui',
  APP_NAME: import.meta.env.VITE_APP_NAME || 'Lovelify Dash',
  APP_VERSION: import.meta.env.VITE_APP_VERSION || '1.0.0'
}

// Validação das variáveis obrigatórias
export const validateEnv = () => {
  const requiredVars = ['VITE_SUPABASE_URL', 'VITE_SUPABASE_ANON_KEY']
  const missingVars = requiredVars.filter(varName => !import.meta.env[varName])
  
  if (missingVars.length > 0) {
    console.error('❌ Variáveis de ambiente obrigatórias não encontradas:', missingVars)
    console.error('📝 Crie um arquivo .env.local com as seguintes variáveis:')
    console.error('VITE_SUPABASE_URL=sua_url_do_supabase')
    console.error('VITE_SUPABASE_ANON_KEY=sua_chave_anonima')
    return false
  }
  
  console.log('✅ Variáveis de ambiente configuradas corretamente')
  return true
}
