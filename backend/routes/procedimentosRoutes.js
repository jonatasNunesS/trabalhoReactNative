const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Listar todos os procedimentos
router.get('/', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM procedimentos');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Buscar procedimento por ID
router.get('/:id', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM procedimentos WHERE id_procedimento = ?', [req.params.id]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Procedimento não encontrado.' });
        }

        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Criar procedimento
router.post('/', async (req, res) => {
    try {
        const { nome, preco, descricao } = req.body;

        if (!nome || !preco) {
            return res.status(400).json({ error: 'Nome e preço são obrigatórios.' });
        }

        const sql = 'INSERT INTO procedimentos (nome, preco, descricao) VALUES (?, ?, ?)';
        const [result] = await db.query(sql, [nome, preco, descricao]);

        res.status(201).json({ message: 'Procedimento criado com sucesso!', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Atualizar procedimento
router.put('/:id', async (req, res) => {
    try {
        const { nome, preco, descricao } = req.body;

        const sql = 'UPDATE procedimentos SET nome = ?, preco = ?, descricao = ? WHERE id_procedimento = ?';
        await db.query(sql, [nome, preco, descricao, req.params.id]);

        res.json({ message: 'Procedimento atualizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Deletar procedimento
router.delete('/:id', async (req, res) => {
    try {
        const sql = 'DELETE FROM procedimentos WHERE id_procedimento = ?';
        await db.query(sql, [req.params.id]);

        res.json({ message: 'Procedimento removido com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;
