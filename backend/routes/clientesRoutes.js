const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Listar todos os clientes
router.get('/', async (req, res) => {
    try {
        const [results] = await db.query('SELECT * FROM clientes');
        res.json(results);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Criar cliente
router.post('/', async (req, res) => {
    try {
        const { nome, email, senha, telefone } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ error: 'Preencha todos os campos obrigatórios.' });
        }

        const sql = 'INSERT INTO clientes (nome, email, senha, telefone) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(sql, [nome, email, senha, telefone]);

        res.status(201).json({ message: 'Cliente criado com sucesso!', id: result.insertId });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        const sql = 'SELECT * FROM clientes WHERE email = ? AND senha = ?';
        const [results] = await db.query(sql, [email, senha]);

        if (results.length === 0) {
            return res.status(401).json({ error: 'Credenciais inválidas.' });
        }

        res.json({ message: 'Login realizado com sucesso!', cliente: results[0] });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Buscar cliente por ID
router.get('/:id', async (req, res) => {
    try {
        const sql = 'SELECT * FROM clientes WHERE id_cliente = ?';
        const [results] = await db.query(sql, [req.params.id]);

        if (results.length === 0) {
            return res.status(404).json({ error: 'Cliente não encontrado.' });
        }

        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Atualizar cliente
router.put('/:id', async (req, res) => {
    try {
        const { nome, email, telefone } = req.body;

        const sql = 'UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id_cliente = ?';
        await db.query(sql, [nome, email, telefone, req.params.id]);

        res.json({ message: 'Cliente atualizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

// Deletar cliente
router.delete('/:id', async (req, res) => {
    try {
        const sql = 'DELETE FROM clientes WHERE id_cliente = ?';
        await db.query(sql, [req.params.id]);

        res.json({ message: 'Cliente removido com sucesso!' });
    } catch (err) {
        res.status(500).json({ error: err });
    }
});

module.exports = router;
