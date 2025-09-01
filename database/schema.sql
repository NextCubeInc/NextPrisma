-- Script SQL para criar as tabelas no Supabase
-- Execute este script no SQL Editor do seu projeto Supabase

-- Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Tabela de usuários
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255),
    avatar_url TEXT,
    company VARCHAR(255),
    phone VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    settings JSONB DEFAULT '{}'::jsonb
);

-- Tabela de workspaces
CREATE TABLE IF NOT EXISTS workspaces (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    type VARCHAR(50) NOT NULL CHECK (type IN ('general', 'store')),
    description TEXT,
    owner_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status VARCHAR(50) DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'suspended')),
    settings JSONB DEFAULT '{}'::jsonb
);

-- Tabela de membros dos workspaces
CREATE TABLE IF NOT EXISTS workspace_members (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    role VARCHAR(50) NOT NULL CHECK (role IN ('owner', 'admin', 'member')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    permissions JSONB DEFAULT '{}'::jsonb,
    UNIQUE(workspace_id, user_id)
);

-- Tabela de leads
CREATE TABLE IF NOT EXISTS leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    source VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'warm' CHECK (status IN ('hot', 'warm', 'cold')),
    score INTEGER DEFAULT 50 CHECK (score >= 0 AND score <= 100),
    value DECIMAL(10,2) DEFAULT 0.00,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    metadata JSONB DEFAULT '{}'::jsonb
);

-- Tabela de métricas das lojas
CREATE TABLE IF NOT EXISTS store_metrics (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    workspace_id UUID NOT NULL REFERENCES workspaces(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    leads_count INTEGER DEFAULT 0,
    revenue DECIMAL(10,2) DEFAULT 0.00,
    roi DECIMAL(5,2) DEFAULT 0.00,
    dwell_time VARCHAR(50),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(workspace_id, date)
);

-- Índices para melhor performance
CREATE INDEX IF NOT EXISTS idx_workspaces_owner_id ON workspaces(owner_id);
CREATE INDEX IF NOT EXISTS idx_workspaces_type ON workspaces(type);
CREATE INDEX IF NOT EXISTS idx_workspace_members_workspace_id ON workspace_members(workspace_id);
CREATE INDEX IF NOT EXISTS idx_workspace_members_user_id ON workspace_members(user_id);
CREATE INDEX IF NOT EXISTS idx_leads_workspace_id ON leads(workspace_id);
CREATE INDEX IF NOT EXISTS idx_leads_status ON leads(status);
CREATE INDEX IF NOT EXISTS idx_leads_source ON leads(source);
CREATE INDEX IF NOT EXISTS idx_store_metrics_workspace_id ON store_metrics(workspace_id);
CREATE INDEX IF NOT EXISTS idx_store_metrics_date ON store_metrics(date);

-- Função para atualizar o timestamp de updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at automaticamente
CREATE TRIGGER update_workspaces_updated_at 
    BEFORE UPDATE ON workspaces 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_users_updated_at 
    BEFORE UPDATE ON users 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_leads_updated_at 
    BEFORE UPDATE ON leads 
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Políticas de segurança RLS (Row Level Security)
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspaces ENABLE ROW LEVEL SECURITY;
ALTER TABLE workspace_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE store_metrics ENABLE ROW LEVEL SECURITY;

-- Política para usuários (cada usuário só vê seus próprios dados)
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);

-- Política para workspaces (usuários só veem workspaces onde são membros)
CREATE POLICY "Users can view workspaces they are members of" ON workspaces
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM workspace_members 
            WHERE workspace_id = workspaces.id 
            AND user_id = auth.uid()
        )
    );

CREATE POLICY "Only owners can update workspaces" ON workspaces
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM workspace_members 
            WHERE workspace_id = workspaces.id 
            AND user_id = auth.uid() 
            AND role = 'owner'
        )
    );

-- Política para membros dos workspaces
CREATE POLICY "Users can view workspace members" ON workspace_members
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM workspace_members wm
            WHERE wm.workspace_id = workspace_members.workspace_id 
            AND wm.user_id = auth.uid()
        )
    );

-- Política para leads (usuários só veem leads dos workspaces onde são membros)
CREATE POLICY "Users can view leads from their workspaces" ON leads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM workspace_members 
            WHERE workspace_id = leads.workspace_id 
            AND user_id = auth.uid()
        )
    );

-- Política para métricas das lojas
CREATE POLICY "Users can view metrics from their workspaces" ON store_metrics
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM workspace_members 
            WHERE workspace_id = store_metrics.workspace_id 
            AND user_id = auth.uid()
        )
    );

-- Inserir dados de exemplo (opcional)
INSERT INTO users (id, email, full_name, company) VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'admin@lovelify.com', 'Admin Lovelify', 'Lovelify Digital')
ON CONFLICT (id) DO NOTHING;

INSERT INTO workspaces (id, name, type, description, owner_id) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', 'Workspace Geral', 'general', 'Visão consolidada de todos os negócios', '550e8400-e29b-41d4-a716-446655440000'),
    ('550e8400-e29b-41d4-a716-446655440002', 'Loja Fashion Prime', 'store', 'E-commerce de moda', '550e8400-e29b-41d4-a716-446655440000')
ON CONFLICT (id) DO NOTHING;

INSERT INTO workspace_members (workspace_id, user_id, role) VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'owner'),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'owner')
ON CONFLICT (workspace_id, user_id) DO NOTHING;
