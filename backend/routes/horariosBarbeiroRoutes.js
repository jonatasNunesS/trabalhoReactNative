const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Horários fixos do barbeiro
const horariosPadrao = [
    "08:00", "09:00", "10:00", "11:00",
    "12:00", "13:00", "14:00", "15:00",
    "16:00", "17:00", "18:00"
];

// Buscar horários disponíveis de um barbeiro
router.get('/:id_barbeiro', async (req, res) => {
    try {
        const { data } = req.query;
        const { id_barbeiro } = req.params;

        if (!data) {
            return res.status(400).json({
                error: "A data é obrigatória. Exemplo: /1?data=2024-10-10"
            });
        }

        // Verificar se o barbeiro existe
        const [barbeiroExiste] = await db.query(
            "SELECT id_barbeiro FROM barbeiros WHERE id_barbeiro = ?",
            [id_barbeiro]
        );

        if (barbeiroExiste.length === 0) {
            return res.status(404).json({ error: "Barbeiro não encontrado." });
        }

        // Buscar horários ocupados
        const sql = `
            SELECT hora 
            FROM agendamentos 
            WHERE id_barbeiro = ? AND data = ?
        `;

        const [results] = await db.query(sql, [id_barbeiro, data]);

        const horariosOcupados = results.map(r => r.hora);

        // Filtrar horários disponíveis
        const horariosDisponiveis = horariosPadrao.filter(
            h => !horariosOcupados.includes(h)
        );

        res.json({
            barbeiro: id_barbeiro,
            data,
            horarios_disponiveis: horariosDisponiveis
        });

    } catch (err) {
        res.status(500).json({ error: "Erro ao buscar horários.", detalhes: err });
    }
});

module.exports = router;
