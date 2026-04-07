// db.js
const mysql = require('mysql2/promise'); // Note o '/promise'

// Criação do pool de conexões
const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'barbearia',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

console.log("Pool de conexões MySQL criado!");

module.exports = db;
