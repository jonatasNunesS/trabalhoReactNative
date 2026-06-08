-- migrations_admin.sql
-- Migrações para suporte à Tela Admin da Barbearia
-- Gerado em: 2026-06-08
--
-- IMPORTANTE: Execute este arquivo UMA VEZ no banco de dados existente.
-- Todos os ALTER TABLE usam IF NOT EXISTS (MariaDB 10.0+) para evitar erros em
-- execuções repetidas. Nenhum dado existente será perdido.
-- Nenhuma tabela será dropada ou recriada.

-- ================================================================
-- 1. TABELA: barbeiros
-- Adiciona telefone, ativo e timestamps
-- ================================================================

ALTER TABLE `barbeiros`
  ADD COLUMN IF NOT EXISTS `telefone`      VARCHAR(20)  NULL,
  ADD COLUMN IF NOT EXISTS `ativo`         TINYINT(1)   NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS `criado_em`     DATETIME     DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS `atualizado_em` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- ================================================================
-- 2. TABELA: procedimentos
-- Adiciona descricao, ativo e timestamps
-- duracao já existe (int) — não duplicar
-- ================================================================

ALTER TABLE `procedimentos`
  ADD COLUMN IF NOT EXISTS `descricao`     VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS `ativo`         TINYINT(1)   NOT NULL DEFAULT 1,
  ADD COLUMN IF NOT EXISTS `criado_em`     DATETIME     DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS `atualizado_em` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- ================================================================
-- 3. TABELA: agendamentos
-- Adiciona valor_total e timestamps
-- Ajusta o ENUM de status para incluir 'cancelado'
--
-- NOTA: MODIFY não aceita IF NOT EXISTS. Este comando é seguro pois apenas
-- redefine o tipo da coluna, adicionando 'cancelado' ao enum existente.
-- Os valores atuais (pendente, confirmado, concluido) são preservados.
-- ================================================================

ALTER TABLE `agendamentos`
  ADD COLUMN IF NOT EXISTS `valor_total`   DECIMAL(10,2) NULL,
  ADD COLUMN IF NOT EXISTS `criado_em`     DATETIME      DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS `atualizado_em` DATETIME      DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

ALTER TABLE `agendamentos`
  MODIFY `status` ENUM('pendente','confirmado','concluido','cancelado') DEFAULT 'pendente';

-- ================================================================
-- 4. TABELA: horarios_barbeiro
-- Adiciona observacao e timestamps
-- ================================================================

ALTER TABLE `horarios_barbeiro`
  ADD COLUMN IF NOT EXISTS `observacao`    VARCHAR(255) NULL,
  ADD COLUMN IF NOT EXISTS `criado_em`     DATETIME     DEFAULT CURRENT_TIMESTAMP,
  ADD COLUMN IF NOT EXISTS `atualizado_em` DATETIME     DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP;

-- ================================================================
-- 5. USUÁRIO ADMINISTRADOR (seed de desenvolvimento)
-- Cria um usuário admin apenas se não existir nenhum com esse e-mail.
-- Senha em texto puro — adequado para dev; usar hash (bcrypt) em produção.
-- ================================================================

INSERT INTO `clientes` (nome, email, senha, telefone, tipo_usuario)
SELECT 'Administrador', 'admin@barbearia.com', 'admin123', '11999999999', 'admin'
WHERE NOT EXISTS (
    SELECT 1 FROM `clientes` WHERE email = 'admin@barbearia.com'
);

-- ================================================================
-- FIM DAS MIGRAÇÕES
-- ================================================================
