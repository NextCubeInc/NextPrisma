# Configuração de Autenticação - Lovelify Dash

## Visão Geral

Este projeto implementa um sistema de autenticação completo usando Supabase, incluindo:

- ✅ Welcome Page atrativa
- ✅ Sistema de login/registro
- ✅ Recuperação de senha
- ✅ Proteção de rotas
- ✅ Contexto de autenticação
- ✅ Logout funcional

## Configuração do Supabase

### 1. Criar Projeto no Supabase

1. Acesse [supabase.com](https://supabase.com)
2. Crie uma nova conta ou faça login
3. Clique em "New Project"
4. Preencha as informações do projeto:
   - **Name**: Lovelify Dash
   - **Database Password**: Escolha uma senha forte
   - **Region**: Escolha a região mais próxima

### 2. Configurar Autenticação

1. No painel do Supabase, vá para **Authentication** > **Settings**
2. Em **Site URL**, adicione: `http://localhost:5173` (para desenvolvimento)
3. Em **Redirect URLs**, adicione:
   - `http://localhost:5173/login`
   - `http://localhost:5173/dashboard`

### 3. Configurar Email Templates (Opcional)

1. Vá para **Authentication** > **Email Templates**
2. Personalize os templates de:
   - Confirmação de email
   - Recuperação de senha
   - Mudança de email

### 4. Obter Credenciais

1. Vá para **Settings** > **API**
2. Copie:
   - **Project URL**
   - **anon public** key

## Configuração Local

### 1. Criar Arquivo .env.local

Na raiz do projeto, crie um arquivo `.env.local`:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=sua_url_do_supabase_aqui
VITE_SUPABASE_ANON_KEY=sua_chave_anonima_do_supabase_aqui

# App Configuration
VITE_APP_NAME=Lovelify Dash
VITE_APP_VERSION=1.0.0
```

### 2. Substituir Valores

Substitua os valores pelos obtidos no painel do Supabase:
- `sua_url_do_supabase_aqui` → Project URL
- `sua_chave_anonima_do_supabase_aqui` → anon public key

## Estrutura de Arquivos

```
src/
├── contexts/
│   └── AuthContext.tsx          # Contexto de autenticação
├── components/
│   ├── auth/
│   │   └── ProtectedRoute.tsx   # Proteção de rotas
│   └── layout/
│       └── DashboardHeader.tsx  # Header com logout
├── pages/
│   ├── Welcome.tsx              # Página inicial pública
│   └── Login.tsx                # Tela de autenticação
└── lib/
    └── supabase.ts              # Cliente Supabase
```

## Funcionalidades Implementadas

### Welcome Page (`/`)
- Landing page atrativa
- Seção de recursos
- Depoimentos de clientes
- Call-to-action para registro

### Login Page (`/login`)
- **Tab 1: Entrar**
  - Login com email/senha
  - Validação de campos
  - Tratamento de erros
  
- **Tab 2: Criar Conta**
  - Registro com nome completo
  - Confirmação de senha
  - Feedback de sucesso
  
- **Tab 3: Recuperar**
  - Recuperação de senha por email
  - Confirmação de envio

### Proteção de Rotas
- Todas as rotas do dashboard são protegidas
- Redirecionamento automático para `/login`
- Loading state durante verificação

### Dashboard Header
- Informações do usuário logado
- Menu dropdown com opções
- Botão de logout funcional

## Como Usar

### 1. Desenvolvimento

```bash
# Instalar dependências
npm install

# Configurar .env.local com suas credenciais Supabase

# Iniciar servidor
npm run dev
```

### 2. Testar Autenticação

1. Acesse `http://localhost:5173`
2. Clique em "Começar Agora" ou "Entrar"
3. Teste o registro de uma nova conta
4. Teste o login
5. Teste a recuperação de senha

### 3. Acessar Dashboard

Após o login bem-sucedido, você será redirecionado para `/dashboard` e poderá acessar todas as funcionalidades protegidas.

## Segurança

- ✅ Senhas são hasheadas pelo Supabase
- ✅ Tokens JWT para sessões
- ✅ Proteção de rotas implementada
- ✅ Validação de formulários
- ✅ Tratamento de erros seguro

## Personalização

### Cores e Estilo
- As cores seguem o design system existente
- Gradientes e glassmorphism mantidos
- Responsivo para mobile e desktop

### Textos
- Todos os textos estão em português
- Fácil de traduzir para outros idiomas
- Mensagens de erro personalizadas

## Troubleshooting

### Erro: "Missing Supabase environment variables"
- Verifique se o arquivo `.env.local` existe
- Confirme se as variáveis estão corretas
- Reinicie o servidor após criar o arquivo

### Erro: "Invalid login credentials"
- Verifique se a conta foi criada corretamente
- Confirme se o email foi verificado (se necessário)
- Teste com uma nova conta

### Erro: "Email not confirmed"
- Verifique a pasta de spam
- Confirme se o email está correto
- Reenvie o email de confirmação

## Próximos Passos

1. **Configurar Banco de Dados**: Criar tabelas para usuários, workspaces, etc.
2. **Implementar Perfil**: Página de perfil do usuário
3. **Sistema de Permissões**: Controle de acesso baseado em roles
4. **Integração Social**: Login com Google, GitHub, etc.
5. **2FA**: Autenticação de dois fatores

## Suporte

Para dúvidas ou problemas:
1. Verifique este documento
2. Consulte a documentação do Supabase
3. Abra uma issue no repositório


