import {
  getSchedulingPageData as getMockSchedulingPageData,
  getProfessionalsPageData as getMockProfessionalsPageData,
  getDateTimePageData as getMockDateTimePageData,
  getAdminDashboard as getMockAdminDashboard,
  getAdminBarbeiros as getMockAdminBarbeiros,
  createAdminBarbeiro as mockCreateAdminBarbeiro,
  updateAdminBarbeiro as mockUpdateAdminBarbeiro,
  inativarAdminBarbeiro as mockInativarAdminBarbeiro,
  ativarAdminBarbeiro as mockAtivarAdminBarbeiro,
  getAdminProcedimentos as getMockAdminProcedimentos,
  createAdminProcedimento as mockCreateAdminProcedimento,
  updateAdminProcedimento as mockUpdateAdminProcedimento,
  inativarAdminProcedimento as mockInativarAdminProcedimento,
  ativarAdminProcedimento as mockAtivarAdminProcedimento,
  getAdminHorarios as getMockAdminHorarios,
  createAdminHorario as mockCreateAdminHorario,
  updateAdminHorario as mockUpdateAdminHorario,
  bloquearAdminHorario as mockBloquearAdminHorario,
  liberarAdminHorario as mockLiberarAdminHorario,
  getAdminAgendamentos as getMockAdminAgendamentos,
  updateAdminAgendamentoStatus as mockUpdateAdminAgendamentoStatus,
  getAdminBarbeiroProcedimentos as getMockAdminBarbeiroProcedimentos,
  updateAdminBarbeiroProcedimentos as mockUpdateAdminBarbeiroProcedimentos,
} from './mockApi';

const USE_REMOTE_API = false;
const API_BASE_URL = 'http://localhost:3000';

function buildQS(params = {}) {
  const pairs = Object.entries(params).filter(([, v]) => v !== undefined && v !== null && v !== '');
  if (!pairs.length) return '';
  return '?' + pairs.map(([k, v]) => `${encodeURIComponent(k)}=${encodeURIComponent(v)}`).join('&');
}

async function request(path, options = {}) {
  const { method = 'GET', body } = options;
  const config = { method, headers: { 'Content-Type': 'application/json' } };
  if (body !== undefined) config.body = JSON.stringify(body);
  const response = await fetch(`${API_BASE_URL}${path}`, config);
  if (!response.ok) throw new Error(`Erro HTTP ${response.status}`);
  return response.json();
}

// ─── Existing functions ──────────────────────────────────────────────────────
export async function getSchedulingPageData() {
  if (!USE_REMOTE_API) return getMockSchedulingPageData();
  try { return await request('/scheduling-page'); } catch { return getMockSchedulingPageData(); }
}

export async function getProfessionalsPageData(serviceId) {
  if (!USE_REMOTE_API) return getMockProfessionalsPageData(serviceId);
  try { return await request(`/professionals-page?serviceId=${serviceId}`); } catch { return getMockProfessionalsPageData(serviceId); }
}

export async function getDateTimePageData({ serviceId, professionalId }) {
  if (!USE_REMOTE_API) return getMockDateTimePageData({ serviceId, professionalId });
  try { return await request(`/date-time-page?serviceId=${serviceId}&professionalId=${professionalId}`); }
  catch { return getMockDateTimePageData({ serviceId, professionalId }); }
}

// ─── Admin: Dashboard ────────────────────────────────────────────────────────
export async function getAdminDashboard() {
  if (!USE_REMOTE_API) return getMockAdminDashboard();
  return request('/admin/dashboard');
}

// ─── Admin: Barbeiros ────────────────────────────────────────────────────────
export async function getAdminBarbeiros(params = {}) {
  if (!USE_REMOTE_API) return getMockAdminBarbeiros(params);
  return request(`/admin/barbeiros${buildQS(params)}`);
}

export async function createAdminBarbeiro(data) {
  if (!USE_REMOTE_API) return mockCreateAdminBarbeiro(data);
  return request('/admin/barbeiros', { method: 'POST', body: data });
}

export async function updateAdminBarbeiro(id, data) {
  if (!USE_REMOTE_API) return mockUpdateAdminBarbeiro(id, data);
  return request(`/admin/barbeiros/${id}`, { method: 'PUT', body: data });
}

export async function inativarAdminBarbeiro(id) {
  if (!USE_REMOTE_API) return mockInativarAdminBarbeiro(id);
  return request(`/admin/barbeiros/${id}/inativar`, { method: 'PATCH' });
}

export async function ativarAdminBarbeiro(id) {
  if (!USE_REMOTE_API) return mockAtivarAdminBarbeiro(id);
  return request(`/admin/barbeiros/${id}/ativar`, { method: 'PATCH' });
}

// ─── Admin: Procedimentos ─────────────────────────────────────────────────────
export async function getAdminProcedimentos(params = {}) {
  if (!USE_REMOTE_API) return getMockAdminProcedimentos(params);
  return request(`/admin/procedimentos${buildQS(params)}`);
}

export async function createAdminProcedimento(data) {
  if (!USE_REMOTE_API) return mockCreateAdminProcedimento(data);
  return request('/admin/procedimentos', { method: 'POST', body: data });
}

export async function updateAdminProcedimento(id, data) {
  if (!USE_REMOTE_API) return mockUpdateAdminProcedimento(id, data);
  return request(`/admin/procedimentos/${id}`, { method: 'PUT', body: data });
}

export async function inativarAdminProcedimento(id) {
  if (!USE_REMOTE_API) return mockInativarAdminProcedimento(id);
  return request(`/admin/procedimentos/${id}/inativar`, { method: 'PATCH' });
}

export async function ativarAdminProcedimento(id) {
  if (!USE_REMOTE_API) return mockAtivarAdminProcedimento(id);
  return request(`/admin/procedimentos/${id}/ativar`, { method: 'PATCH' });
}

// ─── Admin: Horários ──────────────────────────────────────────────────────────
export async function getAdminHorarios(params = {}) {
  if (!USE_REMOTE_API) return getMockAdminHorarios(params);
  return request(`/admin/horarios${buildQS(params)}`);
}

export async function createAdminHorario(data) {
  if (!USE_REMOTE_API) return mockCreateAdminHorario(data);
  return request('/admin/horarios', { method: 'POST', body: data });
}

export async function updateAdminHorario(id, data) {
  if (!USE_REMOTE_API) return mockUpdateAdminHorario(id, data);
  return request(`/admin/horarios/${id}`, { method: 'PUT', body: data });
}

export async function bloquearAdminHorario(id) {
  if (!USE_REMOTE_API) return mockBloquearAdminHorario(id);
  return request(`/admin/horarios/${id}/bloquear`, { method: 'PATCH' });
}

export async function liberarAdminHorario(id) {
  if (!USE_REMOTE_API) return mockLiberarAdminHorario(id);
  return request(`/admin/horarios/${id}/liberar`, { method: 'PATCH' });
}

// ─── Admin: Agendamentos ──────────────────────────────────────────────────────
export async function getAdminAgendamentos(params = {}) {
  if (!USE_REMOTE_API) return getMockAdminAgendamentos(params);
  return request(`/admin/agendamentos${buildQS(params)}`);
}

export async function updateAdminAgendamentoStatus(id, status) {
  if (!USE_REMOTE_API) return mockUpdateAdminAgendamentoStatus(id, status);
  return request(`/admin/agendamentos/${id}/status`, { method: 'PATCH', body: { status } });
}

// ─── Admin: Barbeiro × Procedimentos ─────────────────────────────────────────
export async function getAdminBarbeiroProcedimentos(id) {
  if (!USE_REMOTE_API) return getMockAdminBarbeiroProcedimentos(id);
  return request(`/admin/barbeiros/${id}/procedimentos`);
}

export async function updateAdminBarbeiroProcedimentos(id, procedimentos) {
  if (!USE_REMOTE_API) return mockUpdateAdminBarbeiroProcedimentos(id, procedimentos);
  return request(`/admin/barbeiros/${id}/procedimentos`, { method: 'PUT', body: { procedimentos } });
}

export { API_BASE_URL, USE_REMOTE_API };
