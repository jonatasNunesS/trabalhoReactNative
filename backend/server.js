// Importa o módulo HTTP nativo do Node.js
const http = require('http');
const db = require('./database/db')

const barbeirosRoutes = require('./routes/barbeirosRoutes');

// Define a porta do servidor (usa variável de ambiente ou padrão 3000)
const PORT = process.env.PORT || 3000;

// Função para lidar com as requisições
const requestHandler = (req, res) => {
  try {
    // Define o tipo de conteúdo da resposta
    res.setHeader('Content-Type', 'application/json');

    // Roteamento básico
    if (req.url === '/' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ message: 'Servidor Node.js ativo!' }));
    } 
    else if (req.url === '/sobre' && req.method === 'GET') {
      res.writeHead(200);
      res.end(JSON.stringify({ autor: 'Seu Nome', versao: '1.0.0' }));
    } 
    else {
      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Rota não encontrada' }));
    }
  } catch (error) {
    // Tratamento de erros internos
    res.writeHead(500);
    res.end(JSON.stringify({ error: 'Erro interno no servidor' }));
    console.error('Erro no servidor:', error);
  }
};

// Cria o servidor
const server = http.createServer(requestHandler);

server.use("/api", barbeirosRoutes);


// Inicia o servidor
server.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});