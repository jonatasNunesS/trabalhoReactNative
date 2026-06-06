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

        res.status(201).json({
            message: 'Cliente criado com sucesso!',
            id: result.insertId
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: err.message });
    }
});

// Login com email OU telefone
router.post('/login', async (req, res) => {
    console.log('\n========== LOGIN ==========');
    console.log('Body recebido:', req.body);

    try {
        const { identificador, senha } = req.body;

        if (!identificador || !senha) {
            console.log('Identificador ou senha ausentes');

            return res.status(400).json({
                error: 'Informe email/telefone e senha.'
            });
        }

        console.log('Identificador:', identificador);

        const sql = `
            SELECT *
            FROM clientes
            WHERE (email = ? OR telefone = ?)
            AND senha = ?
        `;

        const [results] = await db.query(sql, [
            identificador,
            identificador,
            senha
        ]);

        console.log('Quantidade encontrada:', results.length);

        if (results.length === 0) {
            console.log('Nenhum usuário encontrado');

            return res.status(401).json({
                error: 'Credenciais inválidas.'
            });
        }

        console.log('Login realizado para:', results[0].nome);

        res.json({
            message: 'Login realizado com sucesso!',
            cliente: {
                id_cliente: results[0].id_cliente,
                nome: results[0].nome,
                email: results[0].email,
                telefone: results[0].telefone
            }
        });

    } catch (err) {
        console.error('Erro no login:', err);

        res.status(500).json({
            error: err.message
        });
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