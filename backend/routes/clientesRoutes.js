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

        res.status(201).json({
            message: 'Cliente criado com sucesso!',
            id: result.insertId
        });
    } catch (err) {
        res.status(500).json({ erro: "Erro ao criar cliente" });
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
            return res.status(400).json({ erro: 'Informe email/telefone e senha.' });
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
            return res.status(401).json({ erro: 'Credenciais inválidas.' });
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
