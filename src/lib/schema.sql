-- Tabela de Usuários (Administradores e Entrevistadores)
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    role VARCHAR(50) DEFAULT 'admin',
    created_at TIMESTAMPTZ DEFAULT clock_timestamp(),
    updated_at TIMESTAMPTZ DEFAULT clock_timestamp()
);

-- Tabela de Pesquisas / Entrevistas
CREATE TABLE IF NOT EXISTS surveys (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    -- Dados da Entrevista
    entrevistador VARCHAR(255) NOT NULL,
    data_entrevista DATE NOT NULL,
    hora_entrevista VARCHAR(50),
    bairro_zona VARCHAR(255) NOT NULL,
    numero_formulario VARCHAR(100),
    contacto VARCHAR(100),
    
    -- Secção A — Perfil do Estabelecimento
    tipo_estabelecimento JSONB NOT NULL DEFAULT '[]'::jsonb,
    tipo_estabelecimento_outro TEXT,
    tempo_aberto VARCHAR(100),
    num_funcionarios VARCHAR(100),
    electricidade VARCHAR(100),
    dispositivos JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Secção B — Controlo Actual de Vendas e Stock
    controlo_vendas JSONB NOT NULL DEFAULT '[]'::jsonb,
    controlo_vendas_qual TEXT,
    controlo_vendas_outro TEXT,
    controlo_stock VARCHAR(100),
    controlo_stock_outro TEXT,
    frequencia_ruptura VARCHAR(100),
    perda_vendas VARCHAR(100),
    fecho_caixa JSONB NOT NULL DEFAULT '[]'::jsonb,
    
    -- Secção C — Problemas e Dor do Negócio
    maior_problema JSONB NOT NULL DEFAULT '[]'::jsonb,
    maior_problema_outro TEXT,
    desvio_funcionarios VARCHAR(100),
    software_anterior VARCHAR(100),
    software_anterior_qual TEXT,
    software_anterior_motivo TEXT,
    
    -- Secção D — Disposição para Adoptar um Sistema
    disposicao_uso VARCHAR(100),
    disposicao_pagar VARCHAR(100),
    forma_pagamento VARCHAR(100),
    prioridades JSONB NOT NULL DEFAULT '{}'::jsonb,
    
    -- Secção E — Infraestrutura Tecnológica
    operador_movel VARCHAR(100),
    operador_movel_outro TEXT,
    qualidade_internet VARCHAR(100),
    leitor_codigo_barras VARCHAR(100),
    
    -- Secção F — Perguntas Abertas
    o_que_nunca_deve_ter TEXT,
    mudar_modo_gestao TEXT,
    sugestoes_comentarios TEXT,
    
    -- Metadados
    created_at TIMESTAMPTZ DEFAULT clock_timestamp()
);

-- Índices para otimização de pesquisas no dashboard
CREATE INDEX IF NOT EXISTS idx_surveys_data ON surveys(data_entrevista);
CREATE INDEX IF NOT EXISTS idx_surveys_entrevistador ON surveys(entrevistador);
CREATE INDEX IF NOT EXISTS idx_surveys_bairro ON surveys(bairro_zona);
CREATE INDEX IF NOT EXISTS idx_surveys_created_at ON surveys(created_at DESC);
