/**
 * Dados Fictícios para Página de Data e Hora
 * Importar este arquivo na sua página de agendamento
 */

// Configurações da Barbearia
export const barbearia = {
  horario_abertura: "08:00",
  horario_fechamento: "19:00", // Até 19:00 (7 da noite)
  intervalo_agendamento: 30, // em minutos
  dias_fechados: [],
  cor_principal: "#1E3A8A",
  cor_secundaria: "#0D9488",
  endereco: "Rua das Flores, 123 - Centro, Belo Horizonte - MG",
  telefone: "(11) 98765-4321",
};

// Barbeiros
export const barbeiros = [
  {
    id: 1,
    nome: "Carlos Souza",
    especialidade: "Especialista em Barba",
    diasTrabalho: [1, 2, 3, 4, 6], // seg, ter, qua, qui, sáb
  },
  {
    id: 2,
    nome: "Felipe Martins",
    especialidade: "Especialista em Corte",
    diasTrabalho: [1, 3, 4, 5], // seg, qua, qui, sex
  },
  {
    id: 3,
    nome: "André Lima",
    especialidade: "Especialista em Barba e Corte",
    diasTrabalho: [2, 3, 4, 5, 6], // ter, qua, qui, sex, sáb
  },
];

// Agendamentos já realizados (para bloquear horários)
// Incluindo vários meses: Janeiro, Fevereiro, Março, Abril, Maio
export const agendamentosExistentes = [
  // ===== JANEIRO 2026 =====
  // 5 de janeiro (segunda) - Carlos Souza
  { id_barbeiro: 1, data: "2026-01-05", hora: "09:00" },
  { id_barbeiro: 1, data: "2026-01-05", hora: "10:00" },
  { id_barbeiro: 1, data: "2026-01-05", hora: "14:00" },
  // 6 de janeiro (terça) - Felipe Martins
  { id_barbeiro: 2, data: "2026-01-06", hora: "09:00" },
  { id_barbeiro: 2, data: "2026-01-06", hora: "15:00" },
  // 7 de janeiro (quarta) - André Lima
  { id_barbeiro: 3, data: "2026-01-07", hora: "10:00" },
  { id_barbeiro: 3, data: "2026-01-07", hora: "16:00" },
  // 8 de janeiro (quinta) - Carlos Souza
  { id_barbeiro: 1, data: "2026-01-08", hora: "11:00" },
  { id_barbeiro: 1, data: "2026-01-08", hora: "13:00" },
  // 9 de janeiro (sexta) - Felipe Martins
  { id_barbeiro: 2, data: "2026-01-09", hora: "08:00" },
  { id_barbeiro: 2, data: "2026-01-09", hora: "17:00" },

  // ===== FEVEREIRO 2026 =====
  // 2 de fevereiro (segunda) - Carlos Souza
  { id_barbeiro: 1, data: "2026-02-02", hora: "09:00" },
  { id_barbeiro: 1, data: "2026-02-02", hora: "14:00" },
  // 3 de fevereiro (terça) - Felipe Martins
  { id_barbeiro: 2, data: "2026-02-03", hora: "10:00" },
  { id_barbeiro: 2, data: "2026-02-03", hora: "15:00" },
  // 4 de fevereiro (quarta) - André Lima
  { id_barbeiro: 3, data: "2026-02-04", hora: "11:00" },
  { id_barbeiro: 3, data: "2026-02-04", hora: "16:00" },
  // 5 de fevereiro (quinta) - Carlos Souza
  { id_barbeiro: 1, data: "2026-02-05", hora: "08:30" },
  { id_barbeiro: 1, data: "2026-02-05", hora: "13:00" },
  // 6 de fevereiro (sexta) - Felipe Martins
  { id_barbeiro: 2, data: "2026-02-06", hora: "09:00" },
  { id_barbeiro: 2, data: "2026-02-06", hora: "18:00" },
  // 9 de fevereiro (segunda) - André Lima
  { id_barbeiro: 3, data: "2026-02-09", hora: "10:00" },
  { id_barbeiro: 3, data: "2026-02-09", hora: "14:00" },
  // 10 de fevereiro (terça) - Carlos Souza
  { id_barbeiro: 1, data: "2026-02-10", hora: "11:00" },
  { id_barbeiro: 1, data: "2026-02-10", hora: "15:00" },
  // 11 de fevereiro (quarta) - Felipe Martins
  { id_barbeiro: 2, data: "2026-02-11", hora: "08:00" },
  { id_barbeiro: 2, data: "2026-02-11", hora: "16:00" },
  // 12 de fevereiro (quinta) - André Lima
  { id_barbeiro: 3, data: "2026-02-12", hora: "09:30" },
  { id_barbeiro: 3, data: "2026-02-12", hora: "17:00" },
  // 13 de fevereiro (sexta) - Carlos Souza
  { id_barbeiro: 1, data: "2026-02-13", hora: "10:00" },
  { id_barbeiro: 1, data: "2026-02-13", hora: "14:00" },

  // ===== MARÇO 2026 =====
  // 2 de março (segunda) - Felipe Martins
  { id_barbeiro: 2, data: "2026-03-02", hora: "09:00" },
  { id_barbeiro: 2, data: "2026-03-02", hora: "15:00" },
  // 3 de março (terça) - André Lima
  { id_barbeiro: 3, data: "2026-03-03", hora: "10:00" },
  { id_barbeiro: 3, data: "2026-03-03", hora: "16:00" },
  // 4 de março (quarta) - Carlos Souza
  { id_barbeiro: 1, data: "2026-03-04", hora: "11:00" },
  { id_barbeiro: 1, data: "2026-03-04", hora: "13:00" },
  // 5 de março (quinta) - Felipe Martins
  { id_barbeiro: 2, data: "2026-03-05", hora: "08:00" },
  { id_barbeiro: 2, data: "2026-03-05", hora: "17:00" },
  // 6 de março (sexta) - André Lima
  { id_barbeiro: 3, data: "2026-03-06", hora: "09:00" },
  { id_barbeiro: 3, data: "2026-03-06", hora: "14:00" },
  // 9 de março (segunda) - Carlos Souza
  { id_barbeiro: 1, data: "2026-03-09", hora: "10:00" },
  { id_barbeiro: 1, data: "2026-03-09", hora: "15:00" },
  // 10 de março (terça) - Felipe Martins
  { id_barbeiro: 2, data: "2026-03-10", hora: "11:00" },
  { id_barbeiro: 2, data: "2026-03-10", hora: "16:00" },
  // 11 de março (quarta) - André Lima
  { id_barbeiro: 3, data: "2026-03-11", hora: "08:30" },
  { id_barbeiro: 3, data: "2026-03-11", hora: "13:00" },
  // 12 de março (quinta) - Carlos Souza
  { id_barbeiro: 1, data: "2026-03-12", hora: "09:00" },
  { id_barbeiro: 1, data: "2026-03-12", hora: "18:00" },
  // 13 de março (sexta) - Felipe Martins
  { id_barbeiro: 2, data: "2026-03-13", hora: "10:00" },
  { id_barbeiro: 2, data: "2026-03-13", hora: "14:00" },
  // 16 de março (segunda) - André Lima
  { id_barbeiro: 3, data: "2026-03-16", hora: "11:00" },
  { id_barbeiro: 3, data: "2026-03-16", hora: "15:00" },
  // 17 de março (terça) - Carlos Souza
  { id_barbeiro: 1, data: "2026-03-17", hora: "08:00" },
  { id_barbeiro: 1, data: "2026-03-17", hora: "16:00" },
  // 18 de março (quarta) - Felipe Martins
  { id_barbeiro: 2, data: "2026-03-18", hora: "09:00" },
  { id_barbeiro: 2, data: "2026-03-18", hora: "15:00" },
  // 19 de março (quinta) - André Lima
  { id_barbeiro: 3, data: "2026-03-19", hora: "10:00" },
  { id_barbeiro: 3, data: "2026-03-19", hora: "17:00" },
  // 20 de março (sexta) - Carlos Souza
  { id_barbeiro: 1, data: "2026-03-20", hora: "11:00" },
  { id_barbeiro: 1, data: "2026-03-20", hora: "14:00" },
  // 23 de março (segunda) - Felipe Martins
  { id_barbeiro: 2, data: "2026-03-23", hora: "08:30" },
  { id_barbeiro: 2, data: "2026-03-23", hora: "13:00" },
  // 24 de março (terça) - André Lima
  { id_barbeiro: 3, data: "2026-03-24", hora: "09:00" },
  { id_barbeiro: 3, data: "2026-03-24", hora: "18:00" },
  // 25 de março (quarta) - Carlos Souza
  { id_barbeiro: 1, data: "2026-03-25", hora: "10:00" },
  { id_barbeiro: 1, data: "2026-03-25", hora: "14:00" },
  // 26 de março (quinta) - Felipe Martins
  { id_barbeiro: 2, data: "2026-03-26", hora: "11:00" },
  { id_barbeiro: 2, data: "2026-03-26", hora: "16:00" },
  // 27 de março (sexta) - André Lima
  { id_barbeiro: 3, data: "2026-03-27", hora: "08:00" },
  { id_barbeiro: 3, data: "2026-03-27", hora: "15:00" },
  // 30 de março (segunda) - Carlos Souza
  { id_barbeiro: 1, data: "2026-03-30", hora: "09:00" },
  { id_barbeiro: 1, data: "2026-03-30", hora: "17:00" },
  // 31 de março (terça) - Felipe Martins
  { id_barbeiro: 2, data: "2026-03-31", hora: "10:00" },
  { id_barbeiro: 2, data: "2026-03-31", hora: "14:00" },

  // ===== ABRIL 2026 =====
  // 1 de abril (quarta) - André Lima
  { id_barbeiro: 3, data: "2026-04-01", hora: "11:00" },
  { id_barbeiro: 3, data: "2026-04-01", hora: "16:00" },
  // 2 de abril (quinta) - Carlos Souza
  { id_barbeiro: 1, data: "2026-04-02", hora: "08:30" },
  { id_barbeiro: 1, data: "2026-04-02", hora: "13:00" },
  // 3 de abril (sexta) - Felipe Martins
  { id_barbeiro: 2, data: "2026-04-03", hora: "09:00" },
  { id_barbeiro: 2, data: "2026-04-03", hora: "18:00" },
  // 6 de abril (segunda) - André Lima
  { id_barbeiro: 3, data: "2026-04-06", hora: "10:00" },
  { id_barbeiro: 3, data: "2026-04-06", hora: "14:00" },
  // 7 de abril (terça) - Carlos Souza
  { id_barbeiro: 1, data: "2026-04-07", hora: "11:00" },
  { id_barbeiro: 1, data: "2026-04-07", hora: "15:00" },
  // 8 de abril (quarta) - Felipe Martins
  { id_barbeiro: 2, data: "2026-04-08", hora: "08:00" },
  { id_barbeiro: 2, data: "2026-04-08", hora: "16:00" },
  // 9 de abril (quinta) - André Lima
  { id_barbeiro: 3, data: "2026-04-09", hora: "09:30" },
  { id_barbeiro: 3, data: "2026-04-09", hora: "17:00" },
  // 10 de abril (sexta) - Carlos Souza
  { id_barbeiro: 1, data: "2026-04-10", hora: "10:00" },
  { id_barbeiro: 1, data: "2026-04-10", hora: "14:00" },

  // ===== MAIO 2026 =====
  // 4 de maio (segunda) - Felipe Martins
  { id_barbeiro: 2, data: "2026-05-04", hora: "09:00" },
  { id_barbeiro: 2, data: "2026-05-04", hora: "15:00" },
  // 5 de maio (terça) - André Lima
  { id_barbeiro: 3, data: "2026-05-05", hora: "10:00" },
  { id_barbeiro: 3, data: "2026-05-05", hora: "16:00" },
  // 6 de maio (quarta) - Carlos Souza
  { id_barbeiro: 1, data: "2026-05-06", hora: "11:00" },
  { id_barbeiro: 1, data: "2026-05-06", hora: "13:00" },
  // 7 de maio (quinta) - Felipe Martins
  { id_barbeiro: 2, data: "2026-05-07", hora: "08:00" },
  { id_barbeiro: 2, data: "2026-05-07", hora: "17:00" },
  // 8 de maio (sexta) - André Lima
  { id_barbeiro: 3, data: "2026-05-08", hora: "09:00" },
  { id_barbeiro: 3, data: "2026-05-08", hora: "14:00" },
];

/**
 * Gera array de horários disponíveis
 * @param horaInicio - Hora de abertura (ex: "08:00")
 * @param horaFechamento - Hora de fechamento (ex: "19:00")
 * @param intervalo - Intervalo em minutos (ex: 30)
 * @returns Array de horários em formato "HH:MM"
 */
export function gerarHorarios(horaInicio, horaFechamento, intervalo) {
  const horarios = [];
  const [inicioHora, inicioMin] = horaInicio.split(":").map(Number);
  const [fimHora, fimMin] = horaFechamento.split(":").map(Number);

  let horaAtual = inicioHora * 60 + inicioMin;
  const horaFinal = fimHora * 60 + fimMin;

  while (horaAtual < horaFinal) {
    const hora = Math.floor(horaAtual / 60);
    const minuto = horaAtual % 60;
    horarios.push(
      `${String(hora).padStart(2, "0")}:${String(minuto).padStart(2, "0")}`,
    );
    horaAtual += intervalo;
  }

  return horarios;
}

/**
 * Verifica se uma data é indisponível (domingo ou sábado)
 * @param data - Data em formato YYYY-MM-DD
 * @returns true se indisponível, false se disponível
 */
export function ehDataIndisponivel(data) {
  const date = new Date(data + "T00:00:00");
  const diaSemana = date.getDay();
  return barbearia.dias_fechados.includes(diaSemana);
}

/**
 * Obtém horários ocupados para um barbeiro em um dia específico
 * @param idBarbeiro - ID do barbeiro
 * @param data - Data em formato YYYY-MM-DD
 * @returns Array de horários ocupados
 */
export function obterHorariosOcupados(idBarbeiro, data) {
  return agendamentosExistentes
    .filter(
      (agendamento) =>
        agendamento.id_barbeiro === idBarbeiro && agendamento.data === data,
    )
    .map((agendamento) => agendamento.hora);
}

/**
 * Obtém horários disponíveis para um barbeiro em um dia específico
 * @param idBarbeiro - ID do barbeiro
 * @param data - Data em formato YYYY-MM-DD
 * @returns Array de horários disponíveis
 */
export function obterHorariosDisponiveis(idBarbeiro, data) {
  const horariosOcupados = obterHorariosOcupados(idBarbeiro, data);
  const todosHorarios = gerarHorarios(
    barbearia.horario_abertura,
    barbearia.horario_fechamento,
    barbearia.intervalo_agendamento,
  );

  return todosHorarios.filter((horario) => !horariosOcupados.includes(horario));
}

/**
 * Verifica se é dia indisponível do barbeiro (não trabalha nesse dia da semana)
 * @param idBarbeiro - ID do barbeiro
 * @param data - Data em formato YYYY-MM-DD
 * @returns true se barbeiro não trabalha nesse dia
 */
export function ehDiaSemTrabalhoBarbeiro(idBarbeiro, data) {
  return !barbeiroTrabalhaNesseDia(idBarbeiro, data);
}

/**
 * Obtém informações de um barbeiro pelo ID
 * @param idBarbeiro - ID do barbeiro
 * @returns Objeto do barbeiro ou undefined
 */
export function obterBarbeiro(idBarbeiro) {
  return barbeiros.find((barbeiro) => barbeiro.id === idBarbeiro);
}

/**
 * Verifica se uma data é um dia de trabalho do barbeiro
 * @param idBarbeiro - ID do barbeiro
 * @param data - Data em formato YYYY-MM-DD
 * @returns true se o barbeiro trabalha nesse dia, false caso contrário
 */
export function barbeiroTrabalhaNesseDia(idBarbeiro, data) {
  const barbeiro = obterBarbeiro(idBarbeiro);
  if (!barbeiro) return false;

  // Se não tem dias definidos, fallback para dias_fechados da barbearia
  if (
    !Array.isArray(barbeiro.diasTrabalho) ||
    barbeiro.diasTrabalho.length === 0
  ) {
    const date = new Date(data + "T00:00:00");
    return !barbearia.dias_fechados.includes(date.getDay());
  }

  const date = new Date(data + "T00:00:00");
  const diaSemana = date.getDay();
  return barbeiro.diasTrabalho.includes(diaSemana);
}

/**
 * Verifica se uma data é anterior a hoje
 * @param data - Data em formato YYYY-MM-DD
 * @returns true se anterior a hoje, false se hoje ou futuro
 */
export function ehDataAnteriorHoje(data) {
  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const dataComparacao = new Date(data + "T00:00:00");
  return dataComparacao < hoje;
}
