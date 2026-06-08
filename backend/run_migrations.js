const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

const db = require('./database/db');

async function runMigrations() {
  const sqlFile = path.join(__dirname, 'migrations_admin.sql');
  const sql = fs.readFileSync(sqlFile, 'utf8');

  // Remove comentários de linha e divide em statements individuais
  const statements = sql
    .split('\n')
    .filter(line => !line.trim().startsWith('--') && line.trim() !== '')
    .join('\n')
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  console.log(`\n🚀 Rodando migrations_admin.sql (${statements.length} statements)...\n`);

  for (const stmt of statements) {
    try {
      await db.query(stmt);
      const preview = stmt.replace(/\s+/g, ' ').substring(0, 80);
      console.log(`  ✓  ${preview}${stmt.length > 80 ? '...' : ''}`);
    } catch (err) {
      console.error(`  ✗  ERRO: ${err.sqlMessage || err.message || JSON.stringify(err)}`);
      console.error(`     Code: ${err.code || ''} | errno: ${err.errno || ''}`);
      console.error(`     Statement: ${stmt.substring(0, 120)}`);
    }
  }

  console.log('\n✅ Migrations concluídas.\n');
  process.exit(0);
}

runMigrations().catch(err => {
  console.error('Falha ao executar migrations:', err.message);
  process.exit(1);
});
