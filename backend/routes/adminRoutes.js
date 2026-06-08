const express = require('express');
const router = express.Router();
const db = require('../database/db');

// TODO: Futuramente, adicionar middleware de autenticação admin antes de todas as rotas.
// Descomente e implemente a função abaixo quando JWT estiver configurado:
//
// const verificarAdmin = (req, res, next) => {
//   const token = req.headers.authorization?.split(' ')[1];
//   if (!token) return res.status(401).json({ erro: 'Token não informado.' });
//   try {
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     if (decoded.tipo_usuario !== 'admin') return res.status(403).json({ erro: 'Acesso restrito a administradores.' });
//     req.usuario = decoded;
//     next();
//   } catch {
//     return res.status(401).json({ erro: 'Token inválido ou expirado.' });
//   }
// };
// router.use(verificarAdmin);

const STATUS_VALIDOS = ['pendente', 'confirmado', 'concluido', 'cancelado'];

// Converte "HH:MM" ou "HH:MM:SS" para minutos totais, evitando comparação de string.
// "9:00" e "10:00" são ambíguos em string compare ("10:00" < "9:00" por "1" < "9").
function timeToMinutes(t) {
    const parts = String(t).split(':').map(Number);
    return (parts[0] || 0) * 60 + (parts[1] || 0);
}

// ================================================================
// DASHBOARD
// ================================================================

router.get('/dashboard', async (req, res) => {
    try {
        const hoje = new Date().toISOString().split('T')[0];
        const inicioMes = hoje.substring(0, 7) + '-01';

        const [[{ agendamentosHoje }]] = await db.query(
            `SELECT COUNT(*) AS agendamentosHoje FROM agendamentos WHERE data = ?`,
            [hoje]
        );

        const [[{ pendentes }]] = await db.query(
            `SELECT COUNT(*) AS pendentes FROM agendamentos WHERE status = 'pendente'`
        );

        const [[{ concluidosMes }]] = await db.query(
            `SELECT COUNT(*) AS concluidosMes FROM agendamentos
             WHERE status = 'concluido' AND data >= ?`,
            [inicioMes]
        );

        const [[{ receitaMes }]] = await db.query(
            `SELECT COALESCE(SUM(COALESCE(a.valor_total, p.preco)), 0) AS receitaMes
             FROM agendamentos a
             JOIN procedimentos p ON a.id_procedimento = p.id_procedimento
             WHERE a.status = 'concluido' AND a.data >= ?`,
            [inicioMes]
        );

        const [[{ barbeirosAtivos }]] = await db.query(
            `SELECT COUNT(*) AS barbeirosAtivos FROM barbeiros WHERE ativo = 1`
        );

        const [[{ servicosAtivos }]] = await db.query(
            `SELECT COUNT(*) AS servicosAtivos FROM procedimentos WHERE ativo = 1`
        );

        const [proximosAgendamentos] = await db.query(
            `SELECT a.id_agendamento, a.data, a.hora, a.status,
                    COALESCE(a.valor_total, p.preco) AS valor_total,
                    c.nome AS cliente, b.nome AS barbeiro, p.nome AS procedimento
             FROM agendamentos a
             JOIN clientes c ON a.id_cliente = c.id_cliente
             JOIN barbeiros b ON a.id_barbeiro = b.id_barbeiro
             JOIN procedimentos p ON a.id_procedimento = p.id_procedimento
             WHERE a.status IN ('pendente','confirmado') AND a.data >= ?
             ORDER BY a.data, a.hora
             LIMIT 10`,
            [hoje]
        );

        const [servicosMaisVendidos] = await db.query(
            `SELECT p.id_procedimento, p.nome,
                    COUNT(*) AS total_vendidos,
                    SUM(COALESCE(a.valor_total, p.preco)) AS receita
             FROM agendamentos a
             JOIN procedimentos p ON a.id_procedimento = p.id_procedimento
             WHERE a.status IN ('confirmado','concluido') AND a.data >= ?
             GROUP BY p.id_procedimento, p.nome
             ORDER BY total_vendidos DESC
             LIMIT 5`,
            [inicioMes]
        );

        const [barbeirosMaisAtivos] = await db.query(
            `SELECT b.id_barbeiro, b.nome, COUNT(*) AS total_atendimentos
             FROM agendamentos a
             JOIN barbeiros b ON a.id_barbeiro = b.id_barbeiro
             WHERE a.status IN ('confirmado','concluido') AND a.data >= ?
             GROUP BY b.id_barbeiro, b.nome
             ORDER BY total_atendimentos DESC
             LIMIT 5`,
            [inicioMes]
        );

        res.json({
            metricas: {
                agendamentosHoje,
                pendentes,
                concluidosMes,
                receitaMes,
                barbeirosAtivos,
                servicosAtivos
            },
            proximosAgendamentos,
            servicosMaisVendidos,
            barbeirosMaisAtivos
        });

    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar dados do dashboard" });
    }
});

// ================================================================
// BARBEIROS
// ================================================================

// GET /admin/barbeiros — lista todos; aceita ?ativo=1 ou ?ativo=0
router.get('/barbeiros', async (req, res) => {
    try {
        const { ativo } = req.query;
        let sql = 'SELECT id_barbeiro, nome, especialidade, telefone, imagem, ativo, criado_em FROM barbeiros';
        const params = [];

        if (ativo !== undefined) {
            sql += ' WHERE ativo = ?';
            params.push(ativo);
        }

        sql += ' ORDER BY nome';
        const [results] = await db.query(sql, params);
        res.json(results);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao listar barbeiros" });
    }
});

// POST /admin/barbeiros — cadastra barbeiro
router.post('/barbeiros', async (req, res) => {
    try {
        const { nome, especialidade, telefone, imagem } = req.body;

        if (!nome || nome.trim() === '') {
            return res.status(400).json({ erro: 'O nome do barbeiro é obrigatório.' });
        }

        const [result] = await db.query(
            'INSERT INTO barbeiros (nome, especialidade, telefone, imagem) VALUES (?, ?, ?, ?)',
            [nome.trim(), especialidade || null, telefone || null, imagem || null]
        );

        res.status(201).json({ message: 'Barbeiro cadastrado com sucesso!', id: result.insertId });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao cadastrar barbeiro" });
    }
});

// PUT /admin/barbeiros/:id — atualiza barbeiro
router.put('/barbeiros/:id', async (req, res) => {
    try {
        const { nome, especialidade, telefone, imagem } = req.body;

        if (!nome || nome.trim() === '') {
            return res.status(400).json({ erro: 'O nome do barbeiro é obrigatório.' });
        }

        const [result] = await db.query(
            'UPDATE barbeiros SET nome = ?, especialidade = ?, telefone = ?, imagem = ? WHERE id_barbeiro = ?',
            [nome.trim(), especialidade || null, telefone || null, imagem || null, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Barbeiro não encontrado.' });
        }

        res.json({ message: 'Barbeiro atualizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao atualizar barbeiro" });
    }
});

// PATCH /admin/barbeiros/:id/inativar
router.patch('/barbeiros/:id/inativar', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE barbeiros SET ativo = 0 WHERE id_barbeiro = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Barbeiro não encontrado.' });
        }

        res.json({ message: 'Barbeiro inativado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao inativar barbeiro" });
    }
});

// PATCH /admin/barbeiros/:id/ativar
router.patch('/barbeiros/:id/ativar', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE barbeiros SET ativo = 1 WHERE id_barbeiro = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Barbeiro não encontrado.' });
        }

        res.json({ message: 'Barbeiro ativado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao ativar barbeiro" });
    }
});

// ================================================================
// PROCEDIMENTOS
// ================================================================

// GET /admin/procedimentos — lista todos; aceita ?ativo=1 ou ?ativo=0
router.get('/procedimentos', async (req, res) => {
    try {
        const { ativo } = req.query;
        let sql = 'SELECT id_procedimento, nome, preco, duracao, descricao, ativo, criado_em FROM procedimentos';
        const params = [];

        if (ativo !== undefined) {
            sql += ' WHERE ativo = ?';
            params.push(ativo);
        }

        sql += ' ORDER BY nome';
        const [results] = await db.query(sql, params);
        res.json(results);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao listar procedimentos" });
    }
});

// POST /admin/procedimentos — cadastra serviço
router.post('/procedimentos', async (req, res) => {
    try {
        const { nome, preco, duracao, descricao } = req.body;

        if (!nome || nome.trim() === '') {
            return res.status(400).json({ erro: 'O nome do serviço é obrigatório.' });
        }
        if (preco === undefined || preco === null || preco === '') {
            return res.status(400).json({ erro: 'O preço do serviço é obrigatório.' });
        }
        if (parseFloat(preco) < 0) {
            return res.status(400).json({ erro: 'O preço não pode ser negativo.' });
        }
        if (!duracao) {
            return res.status(400).json({ erro: 'A duração do serviço é obrigatória.' });
        }
        if (parseInt(duracao) <= 0) {
            return res.status(400).json({ erro: 'A duração deve ser maior que zero.' });
        }

        const [result] = await db.query(
            'INSERT INTO procedimentos (nome, preco, duracao, descricao) VALUES (?, ?, ?, ?)',
            [nome.trim(), preco, duracao, descricao || null]
        );

        res.status(201).json({ message: 'Serviço cadastrado com sucesso!', id: result.insertId });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao cadastrar serviço" });
    }
});

// PUT /admin/procedimentos/:id — atualiza serviço
router.put('/procedimentos/:id', async (req, res) => {
    try {
        const { nome, preco, duracao, descricao } = req.body;

        if (!nome || nome.trim() === '') {
            return res.status(400).json({ erro: 'O nome do serviço é obrigatório.' });
        }
        if (preco === undefined || preco === null || preco === '') {
            return res.status(400).json({ erro: 'O preço do serviço é obrigatório.' });
        }
        if (parseFloat(preco) < 0) {
            return res.status(400).json({ erro: 'O preço não pode ser negativo.' });
        }
        if (!duracao) {
            return res.status(400).json({ erro: 'A duração do serviço é obrigatória.' });
        }
        if (parseInt(duracao) <= 0) {
            return res.status(400).json({ erro: 'A duração deve ser maior que zero.' });
        }

        const [result] = await db.query(
            'UPDATE procedimentos SET nome = ?, preco = ?, duracao = ?, descricao = ? WHERE id_procedimento = ?',
            [nome.trim(), preco, duracao, descricao || null, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Serviço não encontrado.' });
        }

        res.json({ message: 'Serviço atualizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao atualizar serviço" });
    }
});

// PATCH /admin/procedimentos/:id/inativar
router.patch('/procedimentos/:id/inativar', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE procedimentos SET ativo = 0 WHERE id_procedimento = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Serviço não encontrado.' });
        }

        res.json({ message: 'Serviço inativado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao inativar serviço" });
    }
});

// PATCH /admin/procedimentos/:id/ativar
router.patch('/procedimentos/:id/ativar', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE procedimentos SET ativo = 1 WHERE id_procedimento = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Serviço não encontrado.' });
        }

        res.json({ message: 'Serviço ativado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao ativar serviço" });
    }
});

// ================================================================
// HORÁRIOS
// ================================================================

// GET /admin/horarios — lista com filtros opcionais: ?id_barbeiro=1&data=2026-06-08
router.get('/horarios', async (req, res) => {
    try {
        const { id_barbeiro, data } = req.query;
        let sql = `
            SELECT hb.id_horario, hb.id_barbeiro, b.nome AS barbeiro,
                   hb.dia, hb.hora_inicio, hb.hora_fim, hb.disponivel, hb.observacao
            FROM horarios_barbeiro hb
            JOIN barbeiros b ON hb.id_barbeiro = b.id_barbeiro
            WHERE 1=1
        `;
        const params = [];

        if (id_barbeiro) {
            sql += ' AND hb.id_barbeiro = ?';
            params.push(id_barbeiro);
        }
        if (data) {
            sql += ' AND hb.dia = ?';
            params.push(data);
        }

        sql += ' ORDER BY hb.dia, hb.hora_inicio';
        const [results] = await db.query(sql, params);
        res.json(results);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao listar horários" });
    }
});

// POST /admin/horarios — cadastra horário
router.post('/horarios', async (req, res) => {
    try {
        const { id_barbeiro, dia, hora_inicio, hora_fim, disponivel, observacao } = req.body;

        if (!id_barbeiro || !dia || !hora_inicio || !hora_fim) {
            return res.status(400).json({ erro: 'id_barbeiro, dia, hora_inicio e hora_fim são obrigatórios.' });
        }

        if (timeToMinutes(hora_fim) <= timeToMinutes(hora_inicio)) {
            return res.status(400).json({ erro: 'O horário de fim deve ser posterior ao horário de início.' });
        }

        const [result] = await db.query(
            `INSERT INTO horarios_barbeiro (id_barbeiro, dia, hora_inicio, hora_fim, disponivel, observacao)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [id_barbeiro, dia, hora_inicio, hora_fim, disponivel !== undefined ? disponivel : 1, observacao || null]
        );

        res.status(201).json({ message: 'Horário cadastrado com sucesso!', id: result.insertId });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao cadastrar horário" });
    }
});

// PUT /admin/horarios/:id — atualiza horário
router.put('/horarios/:id', async (req, res) => {
    try {
        const { id_barbeiro, dia, hora_inicio, hora_fim, disponivel, observacao } = req.body;

        if (!id_barbeiro || !dia || !hora_inicio || !hora_fim) {
            return res.status(400).json({ erro: 'id_barbeiro, dia, hora_inicio e hora_fim são obrigatórios.' });
        }

        if (timeToMinutes(hora_fim) <= timeToMinutes(hora_inicio)) {
            return res.status(400).json({ erro: 'O horário de fim deve ser posterior ao horário de início.' });
        }

        const [result] = await db.query(
            `UPDATE horarios_barbeiro
             SET id_barbeiro = ?, dia = ?, hora_inicio = ?, hora_fim = ?, disponivel = ?, observacao = ?
             WHERE id_horario = ?`,
            [id_barbeiro, dia, hora_inicio, hora_fim, disponivel !== undefined ? disponivel : 1, observacao || null, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Horário não encontrado.' });
        }

        res.json({ message: 'Horário atualizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao atualizar horário" });
    }
});

// PATCH /admin/horarios/:id/bloquear
router.patch('/horarios/:id/bloquear', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE horarios_barbeiro SET disponivel = 0 WHERE id_horario = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Horário não encontrado.' });
        }

        res.json({ message: 'Horário bloqueado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao bloquear horário" });
    }
});

// PATCH /admin/horarios/:id/liberar
router.patch('/horarios/:id/liberar', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE horarios_barbeiro SET disponivel = 1 WHERE id_horario = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Horário não encontrado.' });
        }

        res.json({ message: 'Horário liberado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao liberar horário" });
    }
});

// DELETE /admin/horarios/:id — remove se não houver agendamento vinculado; bloqueia se houver
router.delete('/horarios/:id', async (req, res) => {
    try {
        const [horario] = await db.query(
            'SELECT * FROM horarios_barbeiro WHERE id_horario = ?',
            [req.params.id]
        );

        if (horario.length === 0) {
            return res.status(404).json({ erro: 'Horário não encontrado.' });
        }

        const h = horario[0];

        const [agendamentos] = await db.query(
            `SELECT id_agendamento FROM agendamentos
             WHERE id_barbeiro = ? AND data = ? AND hora = ? AND status != 'cancelado'`,
            [h.id_barbeiro, h.dia, h.hora_inicio]
        );

        if (agendamentos.length > 0) {
            await db.query(
                'UPDATE horarios_barbeiro SET disponivel = 0 WHERE id_horario = ?',
                [req.params.id]
            );
            return res.json({
                message: 'Horário bloqueado (não removido) pois possui agendamento ativo vinculado.',
                bloqueado: true
            });
        }

        await db.query('DELETE FROM horarios_barbeiro WHERE id_horario = ?', [req.params.id]);
        res.json({ message: 'Horário removido com sucesso!', bloqueado: false });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao remover horário" });
    }
});

// ================================================================
// AGENDAMENTOS
// ================================================================

// GET /admin/agendamentos — lista com filtros: data_inicio, data_fim, status, id_barbeiro
router.get('/agendamentos', async (req, res) => {
    try {
        const { data_inicio, data_fim, status, id_barbeiro } = req.query;

        let sql = `
            SELECT a.id_agendamento, a.data, a.hora, a.status,
                   COALESCE(a.valor_total, p.preco) AS valor_total,
                   c.nome AS cliente, c.telefone AS telefone_cliente,
                   b.nome AS barbeiro,
                   p.nome AS procedimento, p.duracao
            FROM agendamentos a
            JOIN clientes c ON a.id_cliente = c.id_cliente
            JOIN barbeiros b ON a.id_barbeiro = b.id_barbeiro
            JOIN procedimentos p ON a.id_procedimento = p.id_procedimento
            WHERE 1=1
        `;
        const params = [];

        if (data_inicio) {
            sql += ' AND a.data >= ?';
            params.push(data_inicio);
        }
        if (data_fim) {
            sql += ' AND a.data <= ?';
            params.push(data_fim);
        }
        if (status) {
            if (!STATUS_VALIDOS.includes(status)) {
                return res.status(400).json({ erro: `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}` });
            }
            sql += ' AND a.status = ?';
            params.push(status);
        }
        if (id_barbeiro) {
            sql += ' AND a.id_barbeiro = ?';
            params.push(id_barbeiro);
        }

        sql += ' ORDER BY a.data DESC, a.hora DESC';
        const [results] = await db.query(sql, params);
        res.json(results);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao listar agendamentos" });
    }
});

// PATCH /admin/agendamentos/:id/status — atualiza status do agendamento
router.patch('/agendamentos/:id/status', async (req, res) => {
    try {
        const { status } = req.body;

        if (!status) {
            return res.status(400).json({ erro: 'O campo status é obrigatório.' });
        }

        if (!STATUS_VALIDOS.includes(status)) {
            return res.status(400).json({ erro: `Status inválido. Use: ${STATUS_VALIDOS.join(', ')}` });
        }

        const [result] = await db.query(
            'UPDATE agendamentos SET status = ? WHERE id_agendamento = ?',
            [status, req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Agendamento não encontrado.' });
        }

        res.json({ message: `Status atualizado para '${status}'.` });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao atualizar status do agendamento" });
    }
});

// ================================================================
// BARBEIRO x PROCEDIMENTOS
// ================================================================

// GET /admin/barbeiros/:id/procedimentos — lista serviços que o barbeiro executa
router.get('/barbeiros/:id/procedimentos', async (req, res) => {
    try {
        const [results] = await db.query(
            `SELECT p.id_procedimento, p.nome, p.preco, p.duracao, p.descricao, bp.habilitado
             FROM barbeiro_procedimento bp
             JOIN procedimentos p ON bp.id_procedimento = p.id_procedimento
             WHERE bp.id_barbeiro = ?
             ORDER BY p.nome`,
            [req.params.id]
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao listar procedimentos do barbeiro" });
    }
});

// PUT /admin/barbeiros/:id/procedimentos — substitui lista de procedimentos do barbeiro
// Body: { "procedimentos": [1, 2, 3] }
router.put('/barbeiros/:id/procedimentos', async (req, res) => {
    try {
        const { procedimentos } = req.body;
        const id_barbeiro = req.params.id;

        if (!Array.isArray(procedimentos)) {
            return res.status(400).json({ erro: 'O campo procedimentos deve ser um array de IDs.' });
        }

        const conn = await db.getConnection();
        try {
            await conn.beginTransaction();

            await conn.query('DELETE FROM barbeiro_procedimento WHERE id_barbeiro = ?', [id_barbeiro]);

            if (procedimentos.length > 0) {
                const valores = procedimentos.map(id_proc => [id_barbeiro, id_proc, 1]);
                await conn.query(
                    'INSERT INTO barbeiro_procedimento (id_barbeiro, id_procedimento, habilitado) VALUES ?',
                    [valores]
                );
            }

            await conn.commit();
            res.json({ message: 'Procedimentos do barbeiro atualizados com sucesso!' });
        } catch (err) {
            await conn.rollback();
            throw err;
        } finally {
            conn.release();
        }
    } catch (err) {
        res.status(500).json({ erro: "Erro ao atualizar procedimentos do barbeiro" });
    }
});

module.exports = router;
