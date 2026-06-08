// db.js
// Auto-detecta MySQL/MariaDB. Se a conexão falhar, usa JSON file-based DB.
const mysql = require('mysql2/promise');

let _dbPromise = null;

function getDb() {
  if (!_dbPromise) {
    _dbPromise = (async () => {
      try {
        const pool = mysql.createPool({
          host: 'localhost',
          user: 'root',
          password: '',
          database: 'barbearia',
          waitForConnections: true,
          connectionLimit: 10,
          queueLimit: 0,
          connectTimeout: 3000,
        });
        await pool.query('SELECT 1');
        console.log('✅ MySQL/MariaDB conectado');
        return pool;
      } catch {
        const { JsonDb } = require('./jsonDb');
        console.log('⚠️  MySQL offline → banco JSON local ativo (database/data.json)');
        return new JsonDb();
      }
    })();
  }
  return _dbPromise;
}

// Inicia a detecção imediatamente no require
getDb();

// Proxy: cada chamada (query, getConnection, etc.) aguarda a resolução do DB
const db = new Proxy({}, {
  get(_, prop) {
    return async (...args) => {
      const resolved = await getDb();
      return resolved[prop](...args);
    };
  },
});

module.exports = db;
