'use strict';
const express = require('express');
const router = express.Router();
const db = require('../database/db');
const jwt = require('jsonwebtoken');

// TODO: Em produção, defina JWT_SECRET em variável de ambiente segura.
const JWT_SECRET = process.env.JWT_SECRET || 'barbearia_dev_secret_2026';

// Listar todos os clientes (sem expor senha)
router.get('/', async (req, res) => {
    try {
        const [results] = await db.query(
            'SELECT id_cliente, nome, telefone, email, tipo_usuario, is_admin FROM clientes'
        );
        res.json(results);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar clientes' });
    }
});

// Criar cliente — is_admin é sempre 0 independente do body (segurança)
router.post('/', async (req, res) => {
    try {
        const { nome, email, senha, telefone } = req.body;

        if (!nome || !email || !senha) {
            return res.status(400).json({ erro: 'Preencha todos os campos obrigatórios.' });
        }

        // Verificar e-mail duplicado
        const [existenteEmail] = await db.query(
            'SELECT id_cliente FROM clientes WHERE email = ?', [email]
        );
        if (existenteEmail.length > 0) {
            return res.status(409).json({ erro: 'Este e-mail já está cadastrado.' });
        }

        // Verificar telefone duplicado (se informado)
        if (telefone) {
            const [existenteTel] = await db.query(
                'SELECT id_cliente FROM clientes WHERE telefone = ?', [telefone]
            );
            if (existenteTel.length > 0) {
                return res.status(409).json({ erro: 'Este telefone já está cadastrado.' });
            }
        }

        const sql = 'INSERT INTO clientes (nome, email, senha, telefone, is_admin, tipo_usuario) VALUES (?, ?, ?, ?, ?, ?)';
        const [result] = await db.query(sql, [nome, email, senha, telefone || null, 0, 'cliente']);

        res.status(201).json({
            message: 'Cliente criado com sucesso!',
            id: result.insertId,
        });
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao criar cliente' });
    }
});

// Login por e-mail OU telefone — retorna JWT + dados do cliente (nunca a senha)
router.post('/login', async (req, res) => {
    console.log('\n========== LOGIN ==========');
    console.log('Body recebido:', req.body);

    try {
        const { identificador, senha } = req.body;

        if (!identificador || !senha) {
            return res.status(400).json({ erro: 'Informe e-mail/telefone e senha.' });
        }

        const sql = `
            SELECT id_cliente, nome, email, telefone, tipo_usuario, is_admin
            FROM clientes
            WHERE (email = ? OR telefone = ?) AND senha = ?
        `;
        const [results] = await db.query(sql, [identificador, identificador, senha]);

        if (results.length === 0) {
            console.log('Nenhum usuário encontrado');
            return res.status(401).json({ erro: 'Credenciais inválidas.' });
        }

        const cliente = results[0];

        // TODO: Em produção, validar token nas rotas protegidas via middleware verificarAdmin (adminRoutes.js).
        const token = jwt.sign(
            {
                id_cliente: cliente.id_cliente,
                nome: cliente.nome,
                email: cliente.email,
                is_admin: Boolean(cliente.is_admin),
            },
            JWT_SECRET,
            { expiresIn: '30d' }
        );

        console.log('Login realizado para:', cliente.nome, '| admin:', Boolean(cliente.is_admin));

        res.json({
            message: 'Login realizado com sucesso!',
            cliente: {
                id_cliente: cliente.id_cliente,
                nome: cliente.nome,
                email: cliente.email,
                telefone: cliente.telefone,
                is_admin: Boolean(cliente.is_admin),
            },
            token,
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ erro: 'Erro ao realizar login' });
    }
});

// Logout — JWT é stateless; a sessão real é removida no frontend (AsyncStorage)
router.post('/logout', (req, res) => {
    res.json({ message: 'Logout realizado com sucesso!' });
});

// Buscar cliente por ID (sem expor senha)
router.get('/:id', async (req, res) => {
    try {
        const sql = 'SELECT id_cliente, nome, telefone, email, tipo_usuario, is_admin FROM clientes WHERE id_cliente = ?';
        const [results] = await db.query(sql, [req.params.id]);

        if (results.length === 0) {
            return res.status(404).json({ erro: 'Cliente não encontrado.' });
        }

        res.json(results[0]);
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao buscar cliente' });
    }
});

// Atualizar cliente (nome, email, telefone — nunca is_admin via esta rota)
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
        res.status(500).json({ erro: 'Erro ao atualizar cliente' });
    }
});

// Remover cliente
router.delete('/:id', async (req, res) => {
    try {
        const sql = 'DELETE FROM clientes WHERE id_cliente = ?';
        const [result] = await db.query(sql, [req.params.id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ erro: 'Cliente não encontrado.' });
        }

        res.json({ message: 'Cliente removido com sucesso!' });
    } catch (err) {
        res.status(500).json({ erro: 'Erro ao remover cliente' });
    }
});

module.exports = router;
