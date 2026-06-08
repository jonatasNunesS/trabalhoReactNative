import {
  exampleHomeData,
  exampleProfessionalsData,
  exampleSlotsByProfessional,
} from '../data/exampleData';

function wait(ms = 350) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// ─── Existing mock functions ────────────────────────────────────────────────
export async function getSchedulingPageData() {
  await wait();
  return JSON.parse(JSON.stringify(exampleHomeData));
}

export async function getProfessionalsPageData(serviceId) {
  await wait();
  const service = exampleHomeData.popularServices.find((item) => item.id === serviceId);
  return {
    serviceName: service?.name || 'Serviço',
    currentStep: exampleProfessionalsData.currentStep,
    totalSteps: exampleProfessionalsData.totalSteps,
    professionals: Array.isArray(service?.availableBarbers) ? service.availableBarbers : [],
  };
}

export async function getDateTimePageData({ serviceId, professionalId }) {
  await wait();
  const service = exampleHomeData.popularServices.find((item) => item.id === serviceId);
  const professional = exampleHomeData.popularServices
    .flatMap((item) => item.availableBarbers || [])
    .find((barber) => barber.id === professionalId);
  const availability = exampleSlotsByProfessional[professionalId] || { dates: [], timeSlots: {} };
  return {
    service: service || null,
    professional: professional || null,
    dates: availability.dates,
    timeSlots: availability.timeSlots,
    currentStep: 3,
    totalSteps: 4,
  };
}

// ─── Admin mock store (persiste durante a sessão) ────────────────────────────
let _nextBarbId = 4;
let _nextProcId = 6;
let _nextHorId = 5;

const _barbeiros = [
  { id_barbeiro: 1, nome: 'Carlos Mendes', especialidade: 'Corte e acabamento', telefone: '11999990001', imagem: '', ativo: 1, criado_em: '2026-01-10T00:00:00' },
  { id_barbeiro: 2, nome: 'João Silva', especialidade: 'Fade e social', telefone: '11999990002', imagem: '', ativo: 1, criado_em: '2026-01-15T00:00:00' },
  { id_barbeiro: 3, nome: 'Rafael Costa', especialidade: 'Barba e visagismo', telefone: '11999990003', imagem: '', ativo: 0, criado_em: '2026-02-01T00:00:00' },
];

const _procedimentos = [
  { id_procedimento: 1, nome: 'Corte Simples', preco: 40.00, duracao: 30, descricao: 'Corte na tesoura ou máquina', ativo: 1, criado_em: '2026-01-10T00:00:00' },
  { id_procedimento: 2, nome: 'Barba Completa', preco: 35.00, duracao: 25, descricao: 'Barba completa com toalha quente', ativo: 1, criado_em: '2026-01-10T00:00:00' },
  { id_procedimento: 3, nome: 'Corte + Barba', preco: 65.00, duracao: 50, descricao: 'Pacote completo corte e barba', ativo: 1, criado_em: '2026-01-10T00:00:00' },
  { id_procedimento: 4, nome: 'Sobrancelha', preco: 20.00, duracao: 15, descricao: 'Design e acabamento de sobrancelha', ativo: 1, criado_em: '2026-01-10T00:00:00' },
  { id_procedimento: 5, nome: 'Hidratação Capilar', preco: 55.00, duracao: 40, descricao: null, ativo: 0, criado_em: '2026-02-05T00:00:00' },
];

const _horarios = [
  { id_horario: 1, id_barbeiro: 1, barbeiro: 'Carlos Mendes', dia: '2026-06-08', hora_inicio: '08:00', hora_fim: '09:00', disponivel: 1, observacao: null },
  { id_horario: 2, id_barbeiro: 1, barbeiro: 'Carlos Mendes', dia: '2026-06-08', hora_inicio: '09:00', hora_fim: '10:00', disponivel: 0, observacao: 'Reservado' },
  { id_horario: 3, id_barbeiro: 2, barbeiro: 'João Silva', dia: '2026-06-08', hora_inicio: '10:00', hora_fim: '11:00', disponivel: 1, observacao: null },
  { id_horario: 4, id_barbeiro: 1, barbeiro: 'Carlos Mendes', dia: '2026-06-09', hora_inicio: '08:00', hora_fim: '09:00', disponivel: 1, observacao: null },
];

const _agendamentos = [
  { id_agendamento: 1, data: '2026-06-08', hora: '08:00', status: 'pendente', valor_total: 40.00, cliente: 'Pedro Alves', telefone_cliente: '11988880001', barbeiro: 'Carlos Mendes', procedimento: 'Corte Simples', duracao: 30 },
  { id_agendamento: 2, data: '2026-06-08', hora: '10:00', status: 'confirmado', valor_total: 65.00, cliente: 'Lucas Rocha', telefone_cliente: '11988880002', barbeiro: 'João Silva', procedimento: 'Corte + Barba', duracao: 50 },
  { id_agendamento: 3, data: '2026-06-07', hora: '14:00', status: 'concluido', valor_total: 35.00, cliente: 'André Melo', telefone_cliente: '11988880003', barbeiro: 'Carlos Mendes', procedimento: 'Barba Completa', duracao: 25 },
  { id_agendamento: 4, data: '2026-06-07', hora: '16:00', status: 'cancelado', valor_total: 20.00, cliente: 'Felipe Dias', telefone_cliente: '11988880004', barbeiro: 'João Silva', procedimento: 'Sobrancelha', duracao: 15 },
  { id_agendamento: 5, data: '2026-06-08', hora: '11:00', status: 'pendente', valor_total: 65.00, cliente: 'Bruno Lima', telefone_cliente: '11988880005', barbeiro: 'Carlos Mendes', procedimento: 'Corte + Barba', duracao: 50 },
];

const _barbeiroProcedimentos = { 1: [1, 2, 3], 2: [1, 3, 4], 3: [2, 3] };

// ─── Admin mock functions ────────────────────────────────────────────────────

export async function getAdminDashboard() {
  await wait(300);
  const hoje = new Date().toISOString().split('T')[0];
  const iniMes = hoje.substring(0, 7) + '-01';
  const agendamentosHoje = _agendamentos.filter(a => a.data === hoje).length;
  const pendentes = _agendamentos.filter(a => a.status === 'pendente').length;
  const concluidosMes = _agendamentos.filter(a => a.status === 'concluido' && a.data >= iniMes).length;
  const receitaMes = _agendamentos
    .filter(a => a.status === 'concluido' && a.data >= iniMes)
    .reduce((s, a) => s + (a.valor_total || 0), 0);
  const barbeirosAtivos = _barbeiros.filter(b => b.ativo).length;
  const servicosAtivos = _procedimentos.filter(p => p.ativo).length;
  const proximosAgendamentos = _agendamentos
    .filter(a => ['pendente', 'confirmado'].includes(a.status) && a.data >= hoje)
    .slice(0, 10);
  const servicosMaisVendidos = Object.values(
    _agendamentos
      .filter(a => ['confirmado', 'concluido'].includes(a.status))
      .reduce((acc, a) => {
        if (!acc[a.procedimento]) acc[a.procedimento] = { nome: a.procedimento, total_vendidos: 0, receita: 0 };
        acc[a.procedimento].total_vendidos++;
        acc[a.procedimento].receita += a.valor_total || 0;
        return acc;
      }, {})
  ).sort((a, b) => b.total_vendidos - a.total_vendidos).slice(0, 5);
  const barbeirosMaisAtivos = Object.values(
    _agendamentos
      .filter(a => ['confirmado', 'concluido'].includes(a.status))
      .reduce((acc, a) => {
        if (!acc[a.barbeiro]) acc[a.barbeiro] = { nome: a.barbeiro, total_atendimentos: 0 };
        acc[a.barbeiro].total_atendimentos++;
        return acc;
      }, {})
  ).sort((a, b) => b.total_atendimentos - a.total_atendimentos).slice(0, 5);
  return {
    metricas: { agendamentosHoje, pendentes, concluidosMes, receitaMes, barbeirosAtivos, servicosAtivos },
    proximosAgendamentos,
    servicosMaisVendidos,
    barbeirosMaisAtivos,
  };
}

export async function getAdminBarbeiros(params = {}) {
  await wait(200);
  let result = [..._barbeiros];
  if (params.ativo !== undefined) result = result.filter(b => b.ativo === Number(params.ativo));
  return result;
}

export async function createAdminBarbeiro(data) {
  await wait(300);
  const novo = { ...data, id_barbeiro: _nextBarbId++, ativo: 1, criado_em: new Date().toISOString() };
  _barbeiros.push(novo);
  return { message: 'Barbeiro cadastrado com sucesso!', id: novo.id_barbeiro };
}

export async function updateAdminBarbeiro(id, data) {
  await wait(300);
  const idx = _barbeiros.findIndex(b => b.id_barbeiro === id);
  if (idx >= 0) Object.assign(_barbeiros[idx], data);
  return { message: 'Barbeiro atualizado com sucesso!' };
}

export async function inativarAdminBarbeiro(id) {
  await wait(200);
  const b = _barbeiros.find(b => b.id_barbeiro === id);
  if (b) b.ativo = 0;
  return { message: 'Barbeiro inativado com sucesso!' };
}

export async function ativarAdminBarbeiro(id) {
  await wait(200);
  const b = _barbeiros.find(b => b.id_barbeiro === id);
  if (b) b.ativo = 1;
  return { message: 'Barbeiro ativado com sucesso!' };
}

export async function getAdminProcedimentos(params = {}) {
  await wait(200);
  let result = [..._procedimentos];
  if (params.ativo !== undefined) result = result.filter(p => p.ativo === Number(params.ativo));
  return result;
}

export async function createAdminProcedimento(data) {
  await wait(300);
  const novo = { ...data, id_procedimento: _nextProcId++, ativo: 1, criado_em: new Date().toISOString() };
  _procedimentos.push(novo);
  return { message: 'Procedimento cadastrado com sucesso!', id: novo.id_procedimento };
}

export async function updateAdminProcedimento(id, data) {
  await wait(300);
  const idx = _procedimentos.findIndex(p => p.id_procedimento === id);
  if (idx >= 0) Object.assign(_procedimentos[idx], data);
  return { message: 'Procedimento atualizado com sucesso!' };
}

export async function inativarAdminProcedimento(id) {
  await wait(200);
  const p = _procedimentos.find(p => p.id_procedimento === id);
  if (p) p.ativo = 0;
  return { message: 'Procedimento inativado com sucesso!' };
}

export async function ativarAdminProcedimento(id) {
  await wait(200);
  const p = _procedimentos.find(p => p.id_procedimento === id);
  if (p) p.ativo = 1;
  return { message: 'Procedimento ativado com sucesso!' };
}

export async function getAdminHorarios(params = {}) {
  await wait(200);
  let result = [..._horarios];
  if (params.id_barbeiro) result = result.filter(h => h.id_barbeiro === Number(params.id_barbeiro));
  if (params.data) result = result.filter(h => h.dia === params.data);
  return result;
}

export async function createAdminHorario(data) {
  await wait(300);
  const barb = _barbeiros.find(b => b.id_barbeiro === Number(data.id_barbeiro));
  const novo = {
    ...data,
    id_horario: _nextHorId++,
    id_barbeiro: Number(data.id_barbeiro),
    barbeiro: barb?.nome || '',
    disponivel: data.disponivel !== undefined ? Number(data.disponivel) : 1,
  };
  _horarios.push(novo);
  return { message: 'Horário cadastrado com sucesso!', id: novo.id_horario };
}

export async function updateAdminHorario(id, data) {
  await wait(300);
  const idx = _horarios.findIndex(h => h.id_horario === id);
  if (idx >= 0) {
    const barb = _barbeiros.find(b => b.id_barbeiro === Number(data.id_barbeiro));
    Object.assign(_horarios[idx], {
      ...data,
      id_barbeiro: Number(data.id_barbeiro),
      barbeiro: barb?.nome || _horarios[idx].barbeiro,
    });
  }
  return { message: 'Horário atualizado com sucesso!' };
}

export async function bloquearAdminHorario(id) {
  await wait(200);
  const h = _horarios.find(h => h.id_horario === id);
  if (h) h.disponivel = 0;
  return { message: 'Horário bloqueado com sucesso!' };
}

export async function liberarAdminHorario(id) {
  await wait(200);
  const h = _horarios.find(h => h.id_horario === id);
  if (h) h.disponivel = 1;
  return { message: 'Horário liberado com sucesso!' };
}

export async function getAdminAgendamentos(params = {}) {
  await wait(200);
  let result = [..._agendamentos];
  if (params.status) result = result.filter(a => a.status === params.status);
  if (params.id_barbeiro) result = result.filter(a => a.id_barbeiro === Number(params.id_barbeiro));
  if (params.data_inicio) result = result.filter(a => a.data >= params.data_inicio);
  if (params.data_fim) result = result.filter(a => a.data <= params.data_fim);
  return result.sort((a, b) => (b.data + b.hora).localeCompare(a.data + a.hora));
}

export async function updateAdminAgendamentoStatus(id, status) {
  await wait(200);
  const a = _agendamentos.find(a => a.id_agendamento === id);
  if (a) a.status = status;
  return { message: `Status atualizado para '${status}'.` };
}

export async function getAdminBarbeiroProcedimentos(id) {
  await wait(200);
  const ids = _barbeiroProcedimentos[id] || [];
  return _procedimentos
    .filter(p => ids.includes(p.id_procedimento))
    .map(p => ({ ...p, habilitado: 1 }));
}

export async function updateAdminBarbeiroProcedimentos(id, procedimentos) {
  await wait(300);
  _barbeiroProcedimentos[id] = [...procedimentos];
  return { message: 'Procedimentos atualizados com sucesso!' };
}
