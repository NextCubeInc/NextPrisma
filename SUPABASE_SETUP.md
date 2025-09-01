# 🚀 GUIA COMPLETO DE CONFIGURAÇÃO DO SUPABASE

## 📋 **PRÉ-REQUISITOS**

1. **Conta no Supabase** - [Criar conta gratuita](https://supabase.com)
2. **Node.js** instalado (versão 16+)
3. **Git** para controle de versão

## 🔧 **ETAPA 1: CRIAR PROJETO NO SUPABASE**

### 1.1 Acessar o Dashboard
- Vá para [supabase.com](https://supabase.com)
- Faça login na sua conta
- Clique em "New Project"

### 1.2 Configurar Projeto
- **Nome**: `lovelify-dash` (ou o nome que preferir)
- **Database Password**: Crie uma senha forte (guarde-a!)
- **Region**: Escolha a região mais próxima (ex: São Paulo)
- **Pricing Plan**: Free tier (gratuito)

### 1.3 Aguardar Setup
- O projeto levará alguns minutos para ser criado
- Aguarde até aparecer "Project is ready"

## 🔑 **ETAPA 2: OBTER CREDENCIAIS**

### 2.1 Acessar Configurações
- No dashboard do projeto, vá para **Settings** → **API**
- Copie as seguintes informações:

```bash
# URL do Projeto
Project URL: https://xxxxxxxxxxxxx.supabase.co

# Chave Anônima (anon public)
anon public: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

### 2.2 Configurar Variáveis de Ambiente
- Crie um arquivo `.env.local` na raiz do projeto:

```bash
# .env.local
VITE_SUPABASE_URL=https://xxxxxxxxxxxxx.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
```

## 🗄️ **ETAPA 3: CONFIGURAR BANCO DE DADOS**

### 3.1 Acessar SQL Editor
- No dashboard, vá para **SQL Editor**
- Clique em **New Query**

### 3.2 Executar Script de Setup
- Copie e cole o conteúdo do arquivo `database/schema.sql`
- Clique em **Run** para executar

### 3.3 Verificar Tabelas
- Vá para **Table Editor**
- Confirme que as seguintes tabelas foram criadas:
  - `users`
  - `workspaces`
  - `workspace_members`
  - `leads`
  - `store_metrics`

## 🔐 **ETAPA 4: CONFIGURAR AUTENTICAÇÃO (OPCIONAL)**

### 4.1 Habilitar Auth
- Vá para **Authentication** → **Settings**
- Habilite os provedores desejados:
  - Email/Password
  - Google
  - GitHub

### 4.2 Configurar URLs
- **Site URL**: `http://localhost:5173` (desenvolvimento)
- **Redirect URLs**: `http://localhost:5173/auth/callback`

## 🚀 **ETAPA 5: TESTAR CONEXÃO**

### 5.1 Instalar Dependências
```bash
npm install
```

### 5.2 Iniciar Servidor
```bash
npm run dev
```

### 5.3 Verificar Console
- Abra o console do navegador
- Deve aparecer: "✅ Variáveis de ambiente configuradas corretamente"

## 📊 **ETAPA 6: VERIFICAR FUNCIONALIDADES**

### 6.1 Testar Workspaces
- Acesse `/workspaces`
- Verifique se os dados estão sendo carregados do Supabase

### 6.2 Testar Leads
- Acesse `/leads`
- Confirme se a tabela está funcionando

### 6.3 Verificar Sidebar
- O seletor de workspace deve mostrar os dados reais
- Troca entre workspaces deve funcionar

## 🛠️ **SOLUÇÃO DE PROBLEMAS**

### Problema: "Missing Supabase environment variables"
**Solução**: Verifique se o arquivo `.env.local` existe e tem as credenciais corretas

### Problema: "Failed to fetch"
**Solução**: 
1. Verifique se o projeto Supabase está ativo
2. Confirme se as credenciais estão corretas
3. Verifique se as tabelas foram criadas

### Problema: "RLS policy violation"
**Solução**: Execute novamente o script SQL para criar as políticas de segurança

### Problema: "Connection timeout"
**Solução**: 
1. Verifique sua conexão com a internet
2. Confirme se a região do Supabase está correta
3. Tente novamente em alguns minutos

## 🔒 **SEGURANÇA E BOAS PRÁTICAS**

### 1. **Nunca commite o .env.local**
```bash
# .gitignore
.env.local
.env.production
```

### 2. **Use variáveis de ambiente diferentes para cada ambiente**
- `.env.local` - Desenvolvimento local
- `.env.production` - Produção
- `.env.staging` - Staging

### 3. **Monitore o uso do banco**
- Supabase Free tier tem limite de 500MB
- Monitore no dashboard

### 4. **Backup regular**
- Use o recurso de backup automático do Supabase
- Exporte dados importantes regularmente

## 📈 **PRÓXIMOS PASSOS**

### 1. **Implementar Autenticação Real**
- Substituir mock user ID por sistema de auth real
- Implementar login/logout

### 2. **Adicionar Mais Funcionalidades**
- Sistema de notificações
- Relatórios avançados
- Integrações com APIs externas

### 3. **Otimizações**
- Implementar cache com React Query
- Adicionar paginação para grandes datasets
- Implementar busca e filtros avançados

### 4. **Deploy**
- Configurar variáveis de ambiente para produção
- Deploy no Vercel, Netlify ou similar

## 📞 **SUPORTE**

- **Documentação Supabase**: [docs.supabase.com](https://docs.supabase.com)
- **Comunidade**: [GitHub Discussions](https://github.com/supabase/supabase/discussions)
- **Discord**: [discord.gg/supabase](https://discord.gg/supabase)

---

**🎯 Seu app Lovelify Dash agora está conectado ao Supabase e pronto para produção!**
