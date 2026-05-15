const express = require('express');
const app = express();
const cors = require('cors');

// Permite receber e enviar JSON
app.use(cors());
app.use(express.json());

// Rotas
const clientesRoutes = require('./routes/clientesRoutes');
const barbeirosRoutes = require('./routes/barbeirosRoutes');
const procedimentosRoutes = require('./routes/procedimentosRoutes');
const agendamentosRoutes = require('./routes/agendamentosRoutes');
const horariosRoutes = require('./routes/horariosBarbeiroRoutes');

app.use('/horarios', horariosRoutes);
app.use('/agendamentos', agendamentosRoutes);
app.use('/procedimentos', procedimentosRoutes);
app.use('/clientes', clientesRoutes);
app.use('/barbeiros', barbeirosRoutes);

// Rota inicial
app.get('/', (req, res) => {
  res.json({ message: 'Servidor Node.js com Express ativo e usando JSON!' });
});

// Porta
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});