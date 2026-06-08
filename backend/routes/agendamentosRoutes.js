const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Criar agendamento
router.post('/', async (req, res) => {
    try {
        const { id_cliente, id_barbeiro, id_procedimento, data, hora } = req.body;
        let { valor_total } = req.body;

        if (!id_cliente || !id_barbeiro || !id_procedimento || !data || !hora) {
            return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
        }

        // Se valor_total não informado, busca o preço do procedimento automaticamente
        if (valor_total === undefined || valor_total === null) {
            const [proc] = await db.query(
                'SELECT preco FROM procedimentos WHERE id_procedimento = ?',
                [id_procedimento]
            );
            if (proc.length > 0) {
                valor_total = proc[0].preco;
            }
        }

        const sql = `
            INSERT INTO agendamentos (id_cliente, id_barbeiro, id_procedimento, data, hora, valor_total)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            id_cliente, id_barbeiro, id_procedimento, data, hora, valor_total != null ? valor_total : null
        ]);

        res.status(201).json({ message: 'Agendamento criado com sucesso!', id: result.insertId });

    } catch (err) {
        res.status(500).json({ erro: "Erro ao criar agendamento" });
    }
});

// Listar agendamentos de um cliente
router.get('/cliente/:id', async (req, res) => {
    try {
        const sql = `
            SELECT a.id_agendamento, a.data, a.hora, a.status,
                   COALESCE(a.valor_total, p.preco) AS valor_total,
                   c.nome AS cliente,
                   b.nome AS barbeiro,
                   p.nome AS procedimento
            FROM agendamentos a
            JOIN clientes c ON a.id_cliente = c.id_cliente
            JOIN barbeiros b ON a.id_barbeiro = b.id_barbeiro
            JOIN procedimentos p ON a.id_procedimento = p.id_procedimento
            WHERE a.id_cliente = ?
            ORDER BY a.data DESC, a.hora DESC
        `;

        const [results] = await db.query(sql, [req.params.id]);
        res.json(results);

    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar agendamentos do cliente" });
    }
});

// Listar agendamentos de um barbeiro
router.get('/barbeiro/:id', async (req, res) => {
    try {
        const sql = `
            SELECT a.id_agendamento, a.data, a.hora, a.status,
                   COALESCE(a.valor_total, p.preco) AS valor_total,
                   c.nome AS cliente,
                   p.nome AS procedimento
            FROM agendamentos a
            JOIN clientes c ON a.id_cliente = c.id_cliente
            JOIN procedimentos p ON a.id_procedimento = p.id_procedimento
            WHERE a.id_barbeiro = ?
            ORDER BY a.data DESC, a.hora DESC
        `;

        const [results] = await db.query(sql, [req.params.id]);
        res.json(results);

    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar agendamentos do barbeiro" });
    }
});

// Buscar agendamento por ID
router.get('/:id', async (req, res) => {
    try {
        const sql = `
            SELECT a.id_agendamento, a.id_cliente, a.id_barbeiro, a.id_procedimento,
                   a.data, a.hora, a.status,
                   COALESCE(a.valor_total, p.preco) AS valor_total
            FROM agendamentos a
            JOIN procedimentos p ON a.id_procedimento = p.id_procedimento
            WHERE a.id_agendamento = ?
        `;
        const [results] = await db.query(sql, [req.params.id]);

        if (results.length === 0) {
            return res.status(404).json({ erro: 'Agendamento não encontrado.' });
        }

        res.json(results[0]);

    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar agendamento" });
    }
});

// Cancelar agendamento (inativação por status, sem exclusão física)
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            "UPDATE agendamentos SET status = 'cancelado' WHERE id_agendamento = ?",
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Agendamento não encontrado.' });
        }

        res.json({ message: 'Agendamento cancelado com sucesso!' });

    } catch (err) {
        res.status(500).json({ erro: "Erro ao cancelar agendamento" });
    }
});

module.exports = router;
