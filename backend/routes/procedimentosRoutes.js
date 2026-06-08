const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Listar procedimentos ativos
router.get('/', async (req, res) => {
    try {
        const [results] = await db.query(
            'SELECT id_procedimento, nome, preco, duracao, descricao, ativo FROM procedimentos WHERE ativo = 1 ORDER BY nome'
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar procedimentos" });
    }
});

// Buscar procedimento por ID
router.get('/:id', async (req, res) => {
    try {
        const [results] = await db.query(
            'SELECT id_procedimento, nome, preco, duracao, descricao, ativo FROM procedimentos WHERE id_procedimento = ?',
            [req.params.id]
        );

        if (results.length === 0) {
            return res.status(404).json({ erro: 'Procedimento não encontrado.' });
        }

        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar procedimento" });
    }
});

// Criar procedimento
router.post('/', async (req, res) => {
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

        const sql = 'INSERT INTO procedimentos (nome, preco, duracao, descricao) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(sql, [nome.trim(), preco, duracao, descricao || null]);

        res.status(201).json({ message: 'Procedimento criado com sucesso!', id: result.insertId });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao criar procedimento" });
    }
});

// Atualizar procedimento
router.put('/:id', async (req, res) => {
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

        const sql = 'UPDATE procedimentos SET nome = ?, preco = ?, duracao = ?, descricao = ? WHERE id_procedimento = ?';
        const [result] = await db.query(sql, [nome.trim(), preco, duracao, descricao || null, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Procedimento não encontrado.' });
        }

        res.json({ message: 'Procedimento atualizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao atualizar procedimento" });
    }
});

// Inativar procedimento (sem exclusão física)
router.delete('/:id', async (req, res) => {
    try {
        const [result] = await db.query(
            'UPDATE procedimentos SET ativo = 0 WHERE id_procedimento = ?',
            [req.params.id]
        );

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Procedimento não encontrado.' });
        }

        res.json({ message: 'Procedimento inativado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao inativar procedimento" });
    }
});

module.exports = router;
