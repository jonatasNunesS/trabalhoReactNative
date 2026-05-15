const express = require("express");
const router = express.Router();
const db = require('../database/db');

// Listar todos os barbeiros
router.get("/", async (req, res) => {
  try {
    const [barbeiros] = await db.query('SELECT * FROM barbeiros');
    res.json(barbeiros);
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar barbeiros" });
  }
});

// Buscar barbeiro por ID
router.get("/:id", async (req, res) => {
  try {
    const [result] = await db.query(
      'SELECT * FROM barbeiros WHERE id_barbeiro = ?',
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
    const { nome, especialidade, telefone } = req.body;

    const sql = `
      INSERT INTO barbeiros (nome, especialidade, telefone)
      VALUES (?, ?, ?)
    `;

    const [result] = await db.query(sql, [nome, especialidade, telefone]);

    res.status(201).json({
      message: "Barbeiro criado com sucesso!",
      id: result.insertId
    });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao criar barbeiro" });
  }
});

// Atualizar barbeiro
router.put("/:id", async (req, res) => {
  try {
    const { nome, especialidade, telefone } = req.body;

    const sql = `
      UPDATE barbeiros
      SET nome = ?, especialidade = ?, telefone = ?
      WHERE id_barbeiro = ?
    `;

    await db.query(sql, [nome, especialidade, telefone, req.params.id]);

    res.json({ message: "Barbeiro atualizado com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao atualizar barbeiro" });
  }
});

// Deletar barbeiro
router.delete("/:id", async (req, res) => {
  try {
    await db.query('DELETE FROM barbeiros WHERE id_barbeiro = ?', [
      req.params.id
    ]);

    res.json({ message: "Barbeiro removido com sucesso!" });
  } catch (error) {
    res.status(500).json({ erro: "Erro ao remover barbeiro" });
  }
});

module.exports = router;
