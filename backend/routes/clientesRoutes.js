const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Listar todos os clientes (sem expor senha)
router.get('/', async (req, res) => {
    try {
        const [results] = await db.query(
            'SELECT id_cliente, nome, telefone, email, tipo_usuario FROM clientes'
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar clientes" });
    }
});

// Criar cliente
router.post('/', async (req, res) => {
    try {
        const { nome, email, senha, telefone } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
        }

        const sql = 'INSERT INTO clientes (nome, email, senha, telefone) VALUES (?, ?, ?, ?)';
        const [result] = await db.query(sql, [nome, email, senha, telefone || null]);

        res.status(201).json({ message: 'Cliente criado com sucesso!', id: result.insertId });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao criar cliente" });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, senha } = req.body;

        const sql = 'SELECT id_cliente, nome, telefone, email, tipo_usuario FROM clientes WHERE email = ? AND senha = ?';
        const [results] = await db.query(sql, [email, senha]);

        if (results.length === 0) {
            return res.status(401).json({ erro: 'Credenciais inválidas.' });
        }

        res.json({ message: 'Login realizado com sucesso!', cliente: results[0] });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao realizar login" });
    }
});

// Buscar cliente por ID (sem expor senha)
router.get('/:id', async (req, res) => {
    try {
        const sql = 'SELECT id_cliente, nome, telefone, email, tipo_usuario FROM clientes WHERE id_cliente = ?';
        const [results] = await db.query(sql, [req.params.id]);

        if (results.length === 0) {
            return res.status(404).json({ erro: 'Cliente não encontrado.' });
        }

        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar cliente" });
    }
});

// Atualizar cliente
router.put('/:id', async (req, res) => {
    try {
        const { nome, email, telefone } = req.body;

        const sql = 'UPDATE clientes SET nome = ?, email = ?, telefone = ? WHERE id_cliente = ?';
        const [result] = await db.query(sql, [nome, email, telefone, req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Cliente não encontrado.' });
        }

        res.json({ message: 'Cliente atualizado com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao atualizar cliente" });
    }
});

// Deletar cliente
router.delete('/:id', async (req, res) => {
    try {
        const sql = 'DELETE FROM clientes WHERE id_cliente = ?';
        const [result] = await db.query(sql, [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Cliente não encontrado.' });
        }

        res.json({ message: 'Cliente removido com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao remover cliente" });
    }
});

module.exports = router;
