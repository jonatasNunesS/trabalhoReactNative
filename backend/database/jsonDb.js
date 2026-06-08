'use strict';
const fs   = require('fs');
const path = require('path');

const DATA_FILE = path.join(__dirname, 'data.json');

// ─── Seed ─────────────────────────────────────────────────────────────────────
const SEED = {
  barbeiros: [
    { id_barbeiro: 1, nome: 'Carlos Silva', especialidade: 'Fade e Corte Clássico', telefone: '11999990001', imagem: null, ativo: 1, criado_em: '2024-01-01 00:00:00' },
    { id_barbeiro: 2, nome: 'João Santos',  especialidade: 'Barba e Bigode',        telefone: '11999990002', imagem: null, ativo: 1, criado_em: '2024-01-01 00:00:00' },
    { id_barbeiro: 3, nome: 'Pedro Lima',   especialidade: 'Corte Masculino',       telefone: '11999990003', imagem: null, ativo: 1, criado_em: '2024-01-01 00:00:00' },
  ],
  procedimentos: [
    { id_procedimento: 1, nome: 'Corte Simples', preco: 35.00, duracao: 30, descricao: 'Corte básico',            ativo: 1, criado_em: '2024-01-01 00:00:00' },
    { id_procedimento: 2, nome: 'Corte + Barba',  preco: 55.00, duracao: 45, descricao: 'Corte e barba completos', ativo: 1, criado_em: '2024-01-01 00:00:00' },
    { id_procedimento: 3, nome: 'Barba',           preco: 25.00, duracao: 20, descricao: 'Aparar e modelar barba',  ativo: 1, criado_em: '2024-01-01 00:00:00' },
    { id_procedimento: 4, nome: 'Degradê',         preco: 45.00, duracao: 40, descricao: 'Fade/degradê',            ativo: 1, criado_em: '2024-01-01 00:00:00' },
    { id_procedimento: 5, nome: 'Coloração',       preco: 80.00, duracao: 60, descricao: 'Coloração completa',      ativo: 0, criado_em: '2024-01-01 00:00:00' },
  ],
  agendamentos: [],
  horarios_barbeiro: [],
  clientes: [
    { id_cliente: 1, nome: 'Administrador', email: 'admin@barbearia.com', senha: 'admin123', telefone: '11999999999', tipo_usuario: 'admin', is_admin: 1 },
  ],
  barbeiro_procedimento: [
    { id_barbeiro: 1, id_procedimento: 1, habilitado: 1 },
    { id_barbeiro: 1, id_procedimento: 2, habilitado: 1 },
    { id_barbeiro: 1, id_procedimento: 3, habilitado: 1 },
    { id_barbeiro: 2, id_procedimento: 1, habilitado: 1 },
    { id_barbeiro: 2, id_procedimento: 3, habilitado: 1 },
    { id_barbeiro: 2, id_procedimento: 4, habilitado: 1 },
    { id_barbeiro: 3, id_procedimento: 2, habilitado: 1 },
    { id_barbeiro: 3, id_procedimento: 3, habilitado: 1 },
  ],
  configuracoes: [], historico: [], relatorios: [],
  _seq: { barbeiros: 4, procedimentos: 6, agendamentos: 1, horarios_barbeiro: 1, clientes: 2, configuracoes: 1, historico: 1, relatorios: 1 },
};

// ─── Persistence ──────────────────────────────────────────────────────────────
function loadData() {
  if (fs.existsSync(DATA_FILE)) {
    try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); } catch {}
  }
  const d = JSON.parse(JSON.stringify(SEED));
  fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2));
  return d;
}
function saveData(d) { fs.writeFileSync(DATA_FILE, JSON.stringify(d, null, 2)); }

// ─── Utilities ────────────────────────────────────────────────────────────────
const clean = s => (s || '').replace(/`/g, '').trim();
const norm  = s => s.replace(/\s+/g, ' ').trim();

const DEFAULTS = {
  agendamentos:     { status: 'pendente' },
  barbeiros:        { ativo: 1 },
  procedimentos:    { ativo: 1 },
  horarios_barbeiro:{ disponivel: 1 },
  clientes:         { tipo_usuario: 'cliente', is_admin: 0 },
  barbeiro_procedimento: { habilitado: 1 },
};

const PK = {
  barbeiros: 'id_barbeiro', procedimentos: 'id_procedimento',
  agendamentos: 'id_agendamento', horarios_barbeiro: 'id_horario',
  clientes: 'id_cliente', configuracoes: 'id_config',
  historico: 'id_historico', relatorios: 'id_relatorio',
};

// ─── Param binding ─────────────────────────────────────────────────────────────
// Replaces ALL ?s in a SQL fragment with their literal values — call ONCE per query
// so the same bound string can be evaluated against every row without consuming params again.
class ParamIter {
  constructor(arr) { this.a = arr || []; this.i = 0; }
  next() { return this.a[this.i++]; }
}

function bindParams(fragment, pi) {
  return fragment.replace(/\?/g, () => {
    const v = pi.next();
    if (v === null || v === undefined) return 'NULL';
    if (typeof v === 'number') return String(v);
    if (typeof v === 'boolean') return v ? '1' : '0';
    return `'${String(v).replace(/'/g, "''")}'`;
  });
}

// ─── WHERE evaluator (operates on pre-bound strings — no ? remaining) ─────────
function evalWhere(where, row) {
  if (!where || /^\s*$/.test(where) || where.trim() === '1=1') return true;

  const segs = splitLogical(where);
  if (segs.length > 1) {
    let res = evalSingle(segs[0].expr, row);
    for (let i = 1; i < segs.length; i++) {
      const r = evalSingle(segs[i].expr, row);
      res = segs[i].op === 'OR' ? res || r : res && r;
    }
    return res;
  }
  return evalSingle(where.trim(), row);
}

function splitLogical(str) {
  const segs = []; let depth = 0, start = 0, op = null;
  const up = str.toUpperCase();
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '(') depth++;
    else if (str[i] === ')') depth--;
    else if (depth === 0) {
      for (const kw of [' AND ', ' OR ']) {
        if (up.startsWith(kw, i)) {
          segs.push({ op, expr: str.slice(start, i).trim() });
          op = kw.trim(); start = i + kw.length; i += kw.length - 1; break;
        }
      }
    }
  }
  segs.push({ op, expr: str.slice(start).trim() });
  return segs;
}

function evalSingle(expr, row) {
  expr = expr.trim();
  if (expr.startsWith('(') && expr.endsWith(')')) return evalWhere(expr.slice(1, -1), row);

  // IN / NOT IN
  const inM = expr.match(/^(.+?)\s+(NOT\s+)?IN\s*\((.+)\)$/i);
  if (inM) {
    const col = getCol(inM[1].trim(), row);
    const vals = inM[3].split(',').map(v => {
      v = v.trim();
      if (v === 'NULL') return null;
      if (v.startsWith("'")) return v.slice(1, -1);
      return isNaN(v) ? v : Number(v);
    });
    const found = vals.some(v => loose(col) == loose(v));
    return inM[2] ? !found : found;
  }

  // IS NOT NULL / IS NULL
  if (/IS\s+NOT\s+NULL$/i.test(expr)) {
    const v = getCol(expr.replace(/\s+IS\s+NOT\s+NULL$/i, '').trim(), row);
    return v !== null && v !== undefined;
  }
  if (/IS\s+NULL$/i.test(expr)) {
    const v = getCol(expr.replace(/\s+IS\s+NULL$/i, '').trim(), row);
    return v === null || v === undefined;
  }

  // LIKE / NOT LIKE
  const likeM = expr.match(/^(.+?)\s+(NOT\s+)?LIKE\s+(.+)$/i);
  if (likeM) {
    const col = String(getCol(likeM[1].trim(), row) ?? '').toLowerCase();
    let pat = likeM[3].trim();
    if (pat.startsWith("'")) pat = pat.slice(1, -1);
    const rx = new RegExp('^' + pat.replace(/%/g, '.*').replace(/_/g, '.') + '$', 'i');
    return likeM[2] ? !rx.test(col) : rx.test(col);
  }

  // Comparison
  const cmpM = expr.match(/^(.+?)\s*(!=|<>|>=|<=|>|<|=)\s*(.+)$/);
  if (cmpM) {
    let [, left, op, right] = cmpM;
    const lv = getCol(left.trim(), row);
    let rv;
    if (right.trim() === 'NULL') rv = null;
    else if (right.trim().startsWith("'")) rv = right.trim().slice(1, -1).replace(/''/g, "'");
    else if (!isNaN(right.trim())) rv = Number(right.trim());
    else rv = getCol(right.trim(), row);
    return cmp(lv, op, rv);
  }

  return true;
}

function cmp(a, op, b) {
  const na = numericIf(a), nb = numericIf(b);
  const useNum = typeof na === 'number' && typeof nb === 'number';
  const [lv, rv] = useNum ? [na, nb] : [String(a ?? ''), String(b ?? '')];
  switch (op) {
    case '=':  return lv == rv;
    case '!=': case '<>': return lv != rv;
    case '>':  return lv > rv;
    case '<':  return lv < rv;
    case '>=': return lv >= rv;
    case '<=': return lv <= rv;
  }
  return false;
}

function loose(v) { return numericIf(v) ?? String(v ?? ''); }
function numericIf(v) { return (v !== null && v !== undefined && v !== '' && !isNaN(v)) ? Number(v) : v; }

function getCol(expr, row) {
  expr = clean(expr).trim();
  if (row[expr] !== undefined) return row[expr];
  const bare = expr.includes('.') ? expr.split('.').pop() : expr;
  return row[bare];
}

// ─── Column expression evaluator (for SELECT projections & aggregates) ─────────
function evalExpr(expr, row, group) {
  expr = clean(expr).trim();

  if (/^COUNT\(\s*\*\s*\)$/i.test(expr)) return group ? group.length : 1;

  const countM = expr.match(/^COUNT\(\s*(.+?)\s*\)$/i);
  if (countM) {
    const col = clean(countM[1]);
    return (group || [row]).filter(r => getCol(col, r) != null).length;
  }

  const sumM = expr.match(/^SUM\(\s*(.+?)\s*\)$/i);
  if (sumM) {
    return (group || [row]).reduce((s, r) => s + (Number(evalExpr(sumM[1], r, null)) || 0), 0);
  }

  const avgM = expr.match(/^AVG\(\s*(.+?)\s*\)$/i);
  if (avgM) {
    const vals = (group || [row]).map(r => Number(evalExpr(avgM[1], r, null))).filter(v => !isNaN(v));
    return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : 0;
  }

  const coalM = expr.match(/^COALESCE\(\s*(.+)\s*\)$/i);
  if (coalM) {
    for (const a of splitCommas(coalM[1])) {
      const v = evalExpr(a.trim(), row, group);
      if (v !== null && v !== undefined) return v;
    }
    return null;
  }

  if (!isNaN(expr)) return Number(expr);
  return getCol(expr, row);
}

function splitCommas(str) {
  const p = []; let d = 0, s = 0;
  for (let i = 0; i < str.length; i++) {
    if (str[i] === '(') d++;
    else if (str[i] === ')') d--;
    else if (str[i] === ',' && d === 0) { p.push(str.slice(s, i)); s = i + 1; }
  }
  p.push(str.slice(s));
  return p;
}

// col expression → { expr, alias }
function colAlias(col) {
  const asM = col.match(/^(.+?)\s+AS\s+(\w+)$/i);
  if (asM) return { expr: asM[1].trim(), alias: asM[2] };
  if (col.includes('.')) { const parts = col.split('.'); return { expr: col, alias: parts[parts.length - 1] }; }
  return { expr: col, alias: col };
}

// ─── JOIN resolver ─────────────────────────────────────────────────────────────
function resolveJoins(fromClause, data) {
  const joinRe = /(?:LEFT\s+)?JOIN\s+(\w+)\s+(\w+)\s+ON\s+(\w+)\.(\w+)\s*=\s*(\w+)\.(\w+)/gi;
  const mainPart = fromClause.split(/(?:LEFT\s+)?JOIN\b/i)[0].trim().split(/\s+/);
  const mainTable = clean(mainPart[0]);
  const mainAlias = mainPart[1] ? clean(mainPart[1]) : mainTable;

  let rows = (data[mainTable] || []).map(r => flatRow(r, mainAlias));
  let m;
  while ((m = joinRe.exec(fromClause)) !== null) {
    const [, jTable, jAlias, lA, lC, rA, rC] = m.map(clean);
    const rRaws = (data[jTable] || []).map(r => flatRow(r, jAlias));
    const joined = [];
    for (const left of rows) {
      const lv = left[`${lA}.${lC}`] ?? left[lC];
      const match = rRaws.find(r => loose(lv) == loose(r[`${rA}.${rC}`] ?? r[rC]));
      if (match) joined.push({ ...left, ...match });
      else joined.push(left);
    }
    rows = joined;
  }
  return rows;
}

function flatRow(row, alias) {
  const out = {};
  for (const k of Object.keys(row)) {
    out[`${alias}.${k}`] = row[k];
    if (out[k] === undefined) out[k] = row[k]; // bare fallback (first alias wins)
  }
  return out;
}

function bareRow(row) {
  const out = {};
  for (const k of Object.keys(row)) { if (!k.includes('.')) out[k] = row[k]; }
  return out;
}

// ─── Query executors ──────────────────────────────────────────────────────────
function run(data, sql, rawParams) {
  const s = norm(sql);
  const up = s.toUpperCase();
  const pi = new ParamIter(Array.isArray(rawParams) ? rawParams.flat(1) : []);

  if (/^(ALTER|CREATE|DROP|TRUNCATE|SELECT 1\b)/.test(up)) return [[], []];
  if (up.startsWith('SELECT')) return execSelect(data, s, pi);
  if (up.startsWith('INSERT')) return execInsert(data, s, rawParams, pi);
  if (up.startsWith('UPDATE')) return execUpdate(data, s, pi);
  if (up.startsWith('DELETE')) return execDelete(data, s, pi);
  return [[], []];
}

// ── SELECT ─────────────────────────────────────────────────────────────────────
function execSelect(data, sql, pi) {
  // Strip LIMIT
  const limM = sql.match(/\bLIMIT\s+(\d+)/i);
  const limit = limM ? parseInt(limM[1]) : null;
  let s = limM ? sql.slice(0, limM.index).trim() : sql;

  // Strip ORDER BY (from the right)
  const obIdx = s.toUpperCase().lastIndexOf(' ORDER BY ');
  let orderStr = null;
  if (obIdx !== -1) { orderStr = s.slice(obIdx + 10).trim(); s = s.slice(0, obIdx).trim(); }

  // Strip GROUP BY
  const gbIdx = s.toUpperCase().lastIndexOf(' GROUP BY ');
  let groupStr = null;
  if (gbIdx !== -1) { groupStr = s.slice(gbIdx + 10).trim(); s = s.slice(0, gbIdx).trim(); }

  // Split WHERE
  const wIdx = s.toUpperCase().indexOf(' WHERE ');
  let fromPart, wherePart = null;
  if (wIdx !== -1) { wherePart = s.slice(wIdx + 7).trim(); fromPart = s.slice(0, wIdx).trim(); }
  else { fromPart = s; }

  const fromM = fromPart.match(/^SELECT\s+(.+?)\s+FROM\s+(.+)$/i);
  if (!fromM) return [[], []];
  const colsPart   = fromM[1].trim();
  const fromClause = fromM[2].trim();

  // Pre-bind WHERE params (once — not per-row)
  const boundWhere = wherePart ? bindParams(wherePart, pi) : null;

  // Build rows (with JOINs if any)
  let rows = fromClause.match(/\bJOIN\b/i)
    ? resolveJoins(fromClause, data)
    : (() => {
        const parts = fromClause.split(/\s+/);
        const tbl = clean(parts[0]), alias = parts[1] ? clean(parts[1]) : clean(parts[0]);
        return (data[tbl] || []).map(r => flatRow(r, alias));
      })();

  // Filter
  if (boundWhere) rows = rows.filter(r => evalWhere(boundWhere, r));

  // GROUP BY
  if (groupStr) {
    const gCols = groupStr.split(',').map(c => clean(c.trim()));
    const map = new Map();
    for (const r of rows) {
      const key = gCols.map(c => getCol(c, r)).join('\x00');
      if (!map.has(key)) map.set(key, []);
      map.get(key).push(r);
    }
    const cols = splitCommas(colsPart).map(c => colAlias(c.trim()));
    rows = [...map.values()].map(grp => {
      const out = { ...grp[0] };
      for (const { expr, alias } of cols) out[alias] = evalExpr(expr, grp[0], grp);
      return out;
    });
  }

  // ORDER BY
  if (orderStr) {
    const orders = orderStr.split(',').map(o => {
      const p = o.trim().split(/\s+/);
      return { col: clean(p[0]), desc: /DESC/i.test(p[1] || '') };
    });
    rows.sort((a, b) => {
      for (const { col, desc } of orders) {
        const av = getCol(col, a), bv = getCol(col, b);
        const d = (av == null ? '' : av) < (bv == null ? '' : bv) ? -1 : av > bv ? 1 : 0;
        if (d !== 0) return desc ? -d : d;
      }
      return 0;
    });
  }

  if (limit !== null) rows = rows.slice(0, limit);

  // Project
  const selCols = splitCommas(colsPart).map(c => colAlias(c.trim()));

  // Aggregate-only SELECT without GROUP BY → collapse all rows into one
  const isAgg = e => /^(COUNT|SUM|AVG|COALESCE)\s*\(/i.test(e.trim());
  if (!groupStr && selCols.length > 0 && selCols.every(({ expr }) => isAgg(expr))) {
    const group = rows;
    const out = {};
    for (const { expr, alias } of selCols) out[alias] = evalExpr(expr, group[0] || {}, group);
    return [[out], []];
  }

  if (selCols.length === 1 && selCols[0].expr === '*') {
    rows = rows.map(r => bareRow(r));
  } else {
    rows = rows.map(row => {
      const out = {};
      for (const { expr, alias } of selCols) {
        if (expr === '*') { Object.assign(out, bareRow(row)); }
        else out[alias] = evalExpr(expr, row, null);
      }
      return out;
    });
  }
  return [rows, []];
}

// ── INSERT ─────────────────────────────────────────────────────────────────────
function execInsert(data, sql, rawParams, pi) {
  // INSERT ... SELECT ... WHERE NOT EXISTS  (migration seed)
  if (/SELECT\s+.+WHERE\s+NOT\s+EXISTS/i.test(sql)) {
    const neM = sql.match(/WHERE\s+NOT\s+EXISTS\s*\(\s*SELECT.+?FROM\s+(\w+)\s+WHERE\s+(.+?)\s*\)/i);
    if (neM) {
      const chkBound = bindParams(neM[2], pi);
      const [ex] = execSelect(data, `SELECT 1 FROM ${clean(neM[1])} WHERE ${chkBound}`, new ParamIter([]));
      if (ex.length > 0) return [{ affectedRows: 0, insertId: 0 }, []];
    }
    const selM = sql.match(/INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s*SELECT\s+(.+?)\s+WHERE/i);
    if (selM) {
      const tbl  = clean(selM[1]);
      const cols = selM[2].split(',').map(c => clean(c.trim()));
      const vals = selM[3].split(',').map(v => {
        v = v.trim();
        if (v.startsWith("'")) return v.slice(1, -1);
        if (!isNaN(v)) return Number(v);
        return v;
      });
      return doInsert(data, tbl, cols, vals);
    }
    return [{ affectedRows: 0, insertId: 0 }, []];
  }

  const m = sql.match(/^INSERT\s+INTO\s+(\w+)\s*\(([^)]+)\)\s+VALUES\s*(.+)$/i);
  if (!m) return [{ affectedRows: 0, insertId: 0 }, []];

  const tbl   = clean(m[1]);
  const cols  = m[2].split(',').map(c => clean(c.trim()));
  const valPt = m[3].trim();

  // Bulk: VALUES ?  — rawParams = [[[r1vals],[r2vals],...]]
  if (valPt === '?') {
    const outer    = Array.isArray(rawParams) ? rawParams : [];
    const rowArrays = Array.isArray(outer[0]) ? outer[0] : outer;
    const rows2d   = Array.isArray(rowArrays[0]) ? rowArrays : [rowArrays];
    let lastId = 0, aff = 0;
    for (const rv of rows2d) { const r = doInsert(data, tbl, cols, rv); lastId = r[0].insertId; aff += r[0].affectedRows; }
    return [{ affectedRows: aff, insertId: lastId }, []];
  }

  // Single row: consume params via pi
  const vals = cols.map(() => pi.next());
  return doInsert(data, tbl, cols, vals);
}

function doInsert(data, tbl, cols, vals) {
  if (!data[tbl]) data[tbl] = [];
  if (!data._seq[tbl]) data._seq[tbl] = 1;
  const pk  = PK[tbl];
  const row = { ...(DEFAULTS[tbl] || {}) };  // apply column defaults first
  cols.forEach((c, i) => { row[c] = vals[i] !== undefined ? vals[i] : null; });
  if (pk) {
    if (!row[pk]) row[pk] = data._seq[tbl]++;
    else if (Number(row[pk]) >= data._seq[tbl]) data._seq[tbl] = Number(row[pk]) + 1;
  }
  data[tbl].push(row);
  saveData(data);
  return [{ affectedRows: 1, insertId: row[pk] || 0 }, []];
}

// ── UPDATE ─────────────────────────────────────────────────────────────────────
function execUpdate(data, sql, pi) {
  const m = sql.match(/^UPDATE\s+(\w+)\s+SET\s+(.+?)\s+WHERE\s+(.+)$/i);
  if (!m) return [{ affectedRows: 0 }, []];

  const tbl   = clean(m[1]);
  const setPt = m[2];
  if (!data[tbl]) return [{ affectedRows: 0 }, []];

  // Parse SET pairs, consume their params
  const pairs = setPt.split(',').map(s => {
    const [col, ...rest] = s.split('=');
    return { col: clean(col.trim()), raw: rest.join('=').trim() };
  });
  const setVals = pairs.map(p => {
    if (p.raw === '?') return pi.next();
    if (p.raw === 'NULL') return null;
    if (p.raw.startsWith("'")) return p.raw.slice(1, -1);
    if (!isNaN(p.raw)) return Number(p.raw);
    return p.raw;
  });

  // Pre-bind WHERE params AFTER consuming SET params
  const boundWhere = bindParams(m[3], pi);

  let aff = 0;
  for (const row of data[tbl]) {
    if (evalWhere(boundWhere, flatRow(row, tbl))) {
      pairs.forEach((p, i) => { row[p.col] = setVals[i]; });
      aff++;
    }
  }
  if (aff) saveData(data);
  return [{ affectedRows: aff }, []];
}

// ── DELETE ─────────────────────────────────────────────────────────────────────
function execDelete(data, sql, pi) {
  const m = sql.match(/^DELETE\s+FROM\s+(\w+)\s+WHERE\s+(.+)$/i);
  if (!m) return [{ affectedRows: 0 }, []];

  const tbl        = clean(m[1]);
  const boundWhere = bindParams(m[2], pi);
  if (!data[tbl]) return [{ affectedRows: 0 }, []];

  const before = data[tbl].length;
  data[tbl] = data[tbl].filter(r => !evalWhere(boundWhere, flatRow(r, tbl)));
  const aff = before - data[tbl].length;
  if (aff) saveData(data);
  return [{ affectedRows: aff }, []];
}

// ─── JsonDb class ─────────────────────────────────────────────────────────────
class JsonDb {
  constructor() {
    this.data = loadData();
    console.log('📂 JSON DB ativo →', DATA_FILE);
  }

  async query(sql, params) {
    return run(this.data, sql, params || []);
  }

  async getConnection() {
    const snapshot = JSON.parse(JSON.stringify(this.data));
    const self = this;
    return {
      async beginTransaction() {},
      async query(sql, params) { return run(self.data, sql, params || []); },
      async commit()   { saveData(self.data); },
      async rollback() { self.data = snapshot; },
      release()        {},
    };
  }
}

module.exports = { JsonDb };
