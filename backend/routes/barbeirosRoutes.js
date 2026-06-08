const express = require("express");
const router = express.Router();
const db = require('../database/db');

// Listar barbeiros ativos
router.get("/", async (req, res) => {
  try {
    const [barbeiros] = await db.query(
      'SELECT id_barbeiro, nome, especialidade, telefone, imagem, ativo FROM barbeiros WHERE ativo = 1 ORDER BY nome'
    );
    res.json(barbeiros);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar barbeiros" });
  }
});

// Buscar barbeiro por ID
router.get("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      'SELECT id_barbeiro, nome, especialidade, telefone, imagem, ativo FROM barbeiros WHERE id_barbeiro = ?',
      [req.params.id]
    );

    if (result.length === 0) {
      return res.status(404).json({ erro: "Barbeiro não encontrado" });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar barbeiro" });
  }
});

// Criar barbeiro
router.post("/", async (req, res) => {
  try {
    const { nome, especialidade, telefone, imagem } = req.body;

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ erro: "O nome do barbeiro é obrigatório." });
    }

    const sql = `INSERT INTO barbeiros (nome, especialidade, telefone, imagem) VALUES (?, ?, ?, ?)`;
    const [result] = await db.query(sql, [nome.trim(), especialidade || null, telefone || null, imagem || null]);

    res.status(201).json({ message: "Barbeiro criado com sucesso!", id: result.insertId });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar barbeiro" });
  }
});

// Atualizar barbeiro
router.put("/:id", async (req, res) => {
  try {
    const { nome, especialidade, telefone, imagem } = req.body;

    if (!nome || nome.trim() === '') {
      return res.status(400).json({ erro: "O nome do barbeiro é obrigatório." });
    }

    const sql = `UPDATE barbeiros SET nome = ?, especialidade = ?, telefone = ?, imagem = ? WHERE id_barbeiro = ?`;
    const [result] = await db.query(sql, [nome.trim(), especialidade || null, telefone || null, imagem || null, req.params.id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Barbeiro não encontrado." });
    }

    res.json({ message: "Barbeiro atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar barbeiro" });
  }
});

// Inativar barbeiro (sem exclusão física)
router.delete("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      'UPDATE barbeiros SET ativo = 0 WHERE id_barbeiro = ?',
      [req.params.id]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ erro: "Barbeiro não encontrado." });
    }

    res.json({ message: "Barbeiro inativado com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao inativar barbeiro" });
  }
});

module.exports = router;
