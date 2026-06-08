const express = require('express');
const router = express.Router();
const db = require('../database/db');

// Buscar horários de um barbeiro para uma data — usa tabela horarios_barbeiro
// BREAKING CHANGE: resposta agora retorna objetos com disponibilidade real,
// não mais um array de strings de horários fixos.
router.get('/:id_barbeiro', async (req, res) => {
    try {
        const { data } = req.query;
        const { id_barbeiro } = req.params;

        if (!data) {
            return res.status(400).json({
                erro: "A data é obrigatória. Exemplo: /1?data=2024-10-10"
            });
        }

        const [barbeiroExiste] = await db.query(
            "SELECT id_barbeiro FROM barbeiros WHERE id_barbeiro = ?",
            [id_barbeiro]
        );

        if (barbeiroExiste.length === 0) {
            return res.status(404).json({ erro: "Barbeiro não encontrado." });
        }

        // Busca horários cadastrados para o barbeiro nessa data
        const [horarios] = await db.query(
            `SELECT id_horario, hora_inicio, hora_fim, disponivel, observacao
             FROM horarios_barbeiro
             WHERE id_barbeiro = ? AND dia = ?
             ORDER BY hora_inicio`,
            [id_barbeiro, data]
        );

        // Busca horários já ocupados por agendamentos não cancelados
        const [agendados] = await db.query(
            `SELECT hora FROM agendamentos
             WHERE id_barbeiro = ? AND data = ? AND status != 'cancelado'`,
            [id_barbeiro, data]
        );

        const horariosOcupados = agendados.map(a =>
            typeof a.hora === 'string' ? a.hora.substring(0, 5) : a.hora
        );

        const resultado = horarios.map(h => {
            const inicioStr = typeof h.hora_inicio === 'string'
                ? h.hora_inicio.substring(0, 5)
                : h.hora_inicio;
            const ocupado = horariosOcupados.includes(inicioStr);
            return {
                id_horario: h.id_horario,
                hora_inicio: inicioStr,
                hora_fim: typeof h.hora_fim === 'string' ? h.hora_fim.substring(0, 5) : h.hora_fim,
                disponivel: h.disponivel && !ocupado ? 1 : 0,
                observacao: h.observacao
            };
        });

        res.json({ barbeiro: id_barbeiro, data, horarios: resultado });

    } catch (err) {
        res.status(500).json({ erro: "Erro ao buscar horários." });
    }
});

module.exports = router;
