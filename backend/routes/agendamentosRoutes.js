const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Criar agendamento
router.post('/', async (req, res) => {
    try {
        const { id_cliente, id_barbeiro, id_procedimento, data, hora, valor_total } = req.body;

        if (!id_cliente || !id_barbeiro || !id_procedimento || !data || !hora) {
            return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
        }

        const sql = `
            INSERT INTO agendamentos 
            (id_cliente, id_barbeiro, id_procedimento, data, hora, valor_total)
            VALUES (?, ?, ?, ?, ?, ?)
        `;

        const [result] = await db.query(sql, [
            id_cliente,
            id_barbeiro,
            id_procedimento,
            data,
            hora,
            valor_total
        ]);

        res.status(201).json({
            message: 'Agendamento criado com sucesso!',
            id: result.insertId
        });

    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Listar agendamentos de um cliente
router.get('/cliente/:id', async (req, res) => {
    try {
        const sql = `
            SELECT a.*, 
                   c.nome AS cliente,
                   b.nome AS barbeiro,
                   p.nome AS procedimento
            FROM agendamentos a
            JOIN clientes c ON a.id_cliente = c.id_cliente
            JOIN barbeiros b ON a.id_barbeiro = b.id_barbeiro
            JOIN procedimentos p ON a.id_procedimento = p.id_procedimento
            WHERE a.id_cliente = ?
            ORDER BY data, hora
        `;

        const [results] = await db.query(sql, [req.params.id]);
        res.json(results);

    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Listar agendamentos de um barbeiro
router.get('/barbeiro/:id', async (req, res) => {
    try {
        const sql = `
            SELECT a.*, 
                   c.nome AS cliente,
                   p.nome AS procedimento
            FROM agendamentos a
            JOIN clientes c ON a.id_cliente = c.id_cliente
            JOIN procedimentos p ON a.id_procedimento = p.id_procedimento
            WHERE a.id_barbeiro = ?
            ORDER BY data, hora
        `;

        const [results] = await db.query(sql, [req.params.id]);
        res.json(results);

    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Buscar agendamento por ID
router.get('/:id', async (req, res) => {
    try {
        const sql = 'SELECT * FROM agendamentos WHERE id_agendamento = ?';
        const [results] = await db.query(sql, [req.params.id]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Agendamento não encontrado.' });
        }

        res.json(results[0]);

    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Cancelar agendamento
router.delete('/:id', async (req, res) => {
    try {
        const sql = 'DELETE FROM agendamentos WHERE id_agendamento = ?';
        await db.query(sql, [req.params.id]);

        res.json({ message: 'Agendamento cancelado com sucesso!' });

    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;
