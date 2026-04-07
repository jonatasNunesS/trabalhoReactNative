const express = require("express");
const router = express.Router();
const {buscarBarbeiros} = require('../controller/barbeirosController')

router.get("/barbeiros", async (req, res) => {
  try {
    const [barbeiros] = await db.query('SELECT * FROM barbeiros');
    console.log(`Barbeiros encontrados:  \n${barbeiros}.`)
  } catch (error) {
    res.status(500).json({ erro: "Erro ao buscar barbeiros" });
  }
});

module.exports= router;
