import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/AppContext';
import { formatPrice } from '../utils/formatters';
import {
  getAdminDashboard,
  getAdminBarbeiros, createAdminBarbeiro, updateAdminBarbeiro,
  inativarAdminBarbeiro, ativarAdminBarbeiro,
  getAdminProcedimentos, createAdminProcedimento, updateAdminProcedimento,
  inativarAdminProcedimento, ativarAdminProcedimento,
  getAdminHorarios, createAdminHorario, updateAdminHorario,
  bloquearAdminHorario, liberarAdminHorario,
  getAdminAgendamentos, updateAdminAgendamentoStatus,
  getAdminBarbeiroProcedimentos, updateAdminBarbeiroProcedimentos,
} from '../services/api';

// ─── Helpers ─────────────────────────────────────────────────────────────────

function getStatusCfg(status, isDark) {
  const d = {
    pendente:   { bg: 'rgba(251,191,36,0.20)', color: '#FCD34D', label: 'Pendente'   },
    confirmado: { bg: 'rgba(34,197,94,0.20)',  color: '#86EFAC', label: 'Confirmado' },
    concluido:  { bg: 'rgba(45,212,191,0.20)', color: '#5EEAD4', label: 'Concluído'  },
    cancelado:  { bg: 'rgba(239,68,68,0.20)',  color: '#F87171', label: 'Cancelado'  },
  };
  const l = {
    pendente:   { bg: '#FEF3C7', color: '#92400E', label: 'Pendente'   },
    confirmado: { bg: '#D1FAE5', color: '#065F46', label: 'Confirmado' },
    concluido:  { bg: '#CCFBF1', color: '#0F766E', label: 'Concluído'  },
    cancelado:  { bg: '#FEE2E2', color: '#DC2626', label: 'Cancelado'  },
  };
  const map = isDark ? d : l;
  return map[status] || (isDark
    ? { bg: 'rgba(100,116,139,0.20)', color: '#94A3B8', label: status }
    : { bg: '#F1F5F9', color: '#64748B', label: status });
}

function fmtData(s) {
  if (!s || s.length < 10) return s || '';
  const [y, m, dd] = s.substring(0, 10).split('-');
  return `${dd}/${m}/${y}`;
}
function fmtHora(s) { return s ? s.substring(0, 5) : ''; }

// ─── Mini-componentes compartilhados ─────────────────────────────────────────

function StatusBadge({ status }) {
  const { theme } = useAppTheme();
  const c = getStatusCfg(status, theme.isDark);
  return (
    <View style={{ backgroundColor: c.bg, borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}>
      <Text style={{ color: c.color, fontSize: 11, fontWeight: '700' }}>{c.label}</Text>
    </View>
  );
}

function EmptyState({ icon, message }) {
  const { theme } = useAppTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: 48 }}>
      <Ionicons name={icon || 'folder-open-outline'} size={52} color={theme.textSoft} />
      <Text style={{ color: theme.textMuted, marginTop: 14, textAlign: 'center', fontSize: 15, paddingHorizontal: 32 }}>
        {message}
      </Text>
    </View>
  );
}

function ErrorBlock({ message, onRetry }) {
  const { theme } = useAppTheme();
  return (
    <View style={{ alignItems: 'center', paddingVertical: 48 }}>
      <Ionicons name="alert-circle-outline" size={52} color="#EF4444" />
      <Text style={{ color: theme.textSecondary, marginTop: 12, textAlign: 'center', fontSize: 15, paddingHorizontal: 32 }}>
        {message}
      </Text>
      {onRetry && (
        <TouchableOpacity
          onPress={onRetry}
          style={{ marginTop: 16, borderWidth: 1, borderColor: theme.primary, borderRadius: 10, paddingHorizontal: 24, paddingVertical: 8 }}
        >
          <Text style={{ color: theme.primary, fontWeight: '700' }}>Tentar novamente</Text>
        </TouchableOpacity>
      )}
    </View>
  );
}

// ─── Visão Geral ──────────────────────────────────────────────────────────────

function VisaoGeralTab() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setData(await getAdminDashboard());
    } catch {
      setError('Não foi possível carregar o painel.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  if (loading) return <View style={styles.loadingFull}><ActivityIndicator size="large" color={theme.primary} /></View>;
  if (error) return <ErrorBlock message={error} onRetry={load} />;

  const METRICS = [
    { icon: 'calendar-outline',         label: 'Hoje',          value: String(data.metricas.agendamentosHoje) },
    { icon: 'time-outline',             label: 'Pendentes',     value: String(data.metricas.pendentes) },
    { icon: 'checkmark-circle-outline', label: 'Concluídos/Mês',value: String(data.metricas.concluidosMes) },
    { icon: 'cash-outline',             label: 'Receita/Mês',   value: formatPrice(parseFloat(data.metricas.receitaMes) || 0) },
    { icon: 'people-outline',           label: 'Barbeiros',     value: String(data.metricas.barbeirosAtivos) },
    { icon: 'cut-outline',              label: 'Serviços',      value: String(data.metricas.servicosAtivos) },
  ];

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={theme.primary} />}
    >
      <Text style={styles.eyebrow}>RESUMO</Text>
      <View style={styles.metricGrid}>
        {METRICS.map((m, i) => (
          <View key={i} style={styles.metricCard}>
            <Ionicons name={m.icon} size={22} color={theme.primary} />
            <Text style={styles.metricValue}>{m.value}</Text>
            <Text style={styles.metricLabel}>{m.label}</Text>
          </View>
        ))}
      </View>

      <Text style={styles.sectionTitle}>Próximos Agendamentos</Text>
      {data.proximosAgendamentos.length === 0
        ? <EmptyState icon="calendar-outline" message="Nenhum agendamento próximo." />
        : data.proximosAgendamentos.map(a => (
            <View key={a.id_agendamento} style={styles.card}>
              <View style={styles.cardTop}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.cardTitle}>{a.cliente}</Text>
                  <Text style={styles.cardSub}>{a.procedimento} · {a.barbeiro}</Text>
                  <Text style={styles.cardSub}>{fmtData(a.data)} às {fmtHora(a.hora)}</Text>
                </View>
                <StatusBadge status={a.status} />
              </View>
            </View>
          ))
      }

      <Text style={styles.sectionTitle}>Serviços Mais Vendidos</Text>
      {data.servicosMaisVendidos.length === 0
        ? <EmptyState icon="cut-outline" message="Sem dados de vendas." />
        : data.servicosMaisVendidos.map((s, i) => (
            <View key={i} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={[styles.cardTitle, { flex: 1 }]}>{s.nome}</Text>
                <Text style={{ color: theme.primary, fontWeight: '700' }}>{s.total_vendidos}x</Text>
              </View>
              <Text style={styles.cardSub}>{formatPrice(parseFloat(s.receita) || 0)} em receita</Text>
            </View>
          ))
      }

      <Text style={styles.sectionTitle}>Barbeiros Mais Ativos</Text>
      {data.barbeirosMaisAtivos.length === 0
        ? <EmptyState icon="people-outline" message="Sem dados de atendimentos." />
        : data.barbeirosMaisAtivos.map((b, i) => (
            <View key={i} style={styles.card}>
              <View style={styles.cardTop}>
                <Text style={[styles.cardTitle, { flex: 1 }]}>{b.nome}</Text>
                <Text style={{ color: theme.primary, fontWeight: '700' }}>{b.total_atendimentos} atend.</Text>
              </View>
            </View>
          ))
      }
    </ScrollView>
  );
}

// ─── Barbeiros ────────────────────────────────────────────────────────────────

const BARB_EMPTY = { nome: '', especialidade: '', telefone: '', imagem: '' };

function BarbeirosTab() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(BARB_EMPTY);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const [servVisible, setServVisible] = useState(false);
  const [servBarbeiro, setServBarbeiro] = useState(null);
  const [allProcs, setAllProcs] = useState([]);
  const [selProcs, setSelProcs] = useState([]);
  const [loadingServs, setLoadingServs] = useState(false);
  const [savingServs, setSavingServs] = useState(false);
  const [servError, setServError] = useState(null);

  const load = useCallback(async () => {
    try {
      setError(null);
      setItems(await getAdminBarbeiros());
    } catch {
      setError('Não foi possível carregar os barbeiros.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (filter === 'active') return items.filter(b => b.ativo);
    if (filter === 'inactive') return items.filter(b => !b.ativo);
    return items;
  }, [items, filter]);

  const openModal = (b = null) => {
    setEditingId(b ? b.id_barbeiro : null);
    setForm(b
      ? { nome: b.nome, especialidade: b.especialidade || '', telefone: b.telefone || '', imagem: b.imagem || '' }
      : BARB_EMPTY
    );
    setFormError('');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.nome.trim()) { setFormError('O nome é obrigatório.'); return; }
    setSaving(true);
    try {
      editingId ? await updateAdminBarbeiro(editingId, form) : await createAdminBarbeiro(form);
      setModalVisible(false);
      load();
    } catch { setFormError('Erro ao salvar. Tente novamente.'); }
    finally { setSaving(false); }
  };

  const handleInativar = (b) => {
    Alert.alert('Inativar Barbeiro', `Deseja inativar ${b.nome}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Inativar', style: 'destructive', onPress: async () => {
        try { await inativarAdminBarbeiro(b.id_barbeiro); load(); }
        catch { Alert.alert('Erro', 'Não foi possível inativar.'); }
      }},
    ]);
  };

  const handleAtivar = async (b) => {
    try { await ativarAdminBarbeiro(b.id_barbeiro); load(); }
    catch { Alert.alert('Erro', 'Não foi possível ativar.'); }
  };

  const openServs = async (b) => {
    setServBarbeiro(b);
    setServVisible(true);
    setLoadingServs(true);
    setServError(null);
    try {
      const [procs, barbProcs] = await Promise.all([
        getAdminProcedimentos({ ativo: 1 }),
        getAdminBarbeiroProcedimentos(b.id_barbeiro),
      ]);
      setAllProcs(procs);
      setSelProcs(barbProcs.map(p => p.id_procedimento));
    } catch {
      setServError('Não foi possível carregar os serviços.');
    } finally { setLoadingServs(false); }
  };

  const toggleProc = (id) => setSelProcs(p => p.includes(id) ? p.filter(x => x !== id) : [...p, id]);

  const saveServs = async () => {
    setSavingServs(true);
    try {
      await updateAdminBarbeiroProcedimentos(servBarbeiro.id_barbeiro, selProcs);
      setServVisible(false);
    } catch { Alert.alert('Erro', 'Não foi possível salvar os serviços.'); }
    finally { setSavingServs(false); }
  };

  const FILTERS = [{ key: 'all', label: 'Todos' }, { key: 'active', label: 'Ativos' }, { key: 'inactive', label: 'Inativos' }];

  if (loading) return <View style={styles.loadingFull}><ActivityIndicator size="large" color={theme.primary} /></View>;
  if (error) return <ErrorBlock message={error} onRetry={load} />;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={theme.primary} />}
      >
        <View style={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity key={f.key} style={[styles.chip, filter === f.key && styles.chipActive]} onPress={() => setFilter(f.key)}>
              <Text style={[styles.chipText, filter === f.key && styles.chipTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.chipAdd} onPress={() => openModal()}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.chipAddText}>Novo</Text>
          </TouchableOpacity>
        </View>

        {filtered.length === 0
          ? <EmptyState icon="people-outline" message="Nenhum barbeiro encontrado." />
          : filtered.map(b => (
              <View key={b.id_barbeiro} style={[styles.card, !b.ativo && styles.cardInactive]}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{b.nome}</Text>
                    {!!b.especialidade && <Text style={styles.cardSub}>{b.especialidade}</Text>}
                    {!!b.telefone && <Text style={styles.cardSub}>{b.telefone}</Text>}
                  </View>
                  <View style={{ backgroundColor: b.ativo ? '#D1FAE5' : '#FEE2E2', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}>
                    <Text style={{ fontSize: 11, fontWeight: '700', color: b.ativo ? '#065F46' : '#DC2626' }}>
                      {b.ativo ? 'Ativo' : 'Inativo'}
                    </Text>
                  </View>
                </View>
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.btnSm} onPress={() => openModal(b)}>
                    <Text style={styles.btnSmText}>Editar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnSm} onPress={() => openServs(b)}>
                    <Text style={styles.btnSmText}>Serviços</Text>
                  </TouchableOpacity>
                  {b.ativo
                    ? <TouchableOpacity style={styles.btnSmDanger} onPress={() => handleInativar(b)}>
                        <Text style={styles.btnSmDangerText}>Inativar</Text>
                      </TouchableOpacity>
                    : <TouchableOpacity style={styles.btnSmSuccess} onPress={() => handleAtivar(b)}>
                        <Text style={styles.btnSmSuccessText}>Ativar</Text>
                      </TouchableOpacity>
                  }
                </View>
              </View>
            ))
        }
      </ScrollView>

      {/* Modal: formulário barbeiro */}
      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setModalVisible(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Editar Barbeiro' : 'Novo Barbeiro'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.formLabel}>Nome *</Text>
              <TextInput style={styles.input} value={form.nome} onChangeText={v => setForm(p => ({ ...p, nome: v }))} placeholder="Nome do barbeiro" placeholderTextColor={theme.textSoft} />
              <Text style={styles.formLabel}>Especialidade</Text>
              <TextInput style={styles.input} value={form.especialidade} onChangeText={v => setForm(p => ({ ...p, especialidade: v }))} placeholder="Ex: Fade, Corte clássico" placeholderTextColor={theme.textSoft} />
              <Text style={styles.formLabel}>Telefone</Text>
              <TextInput style={styles.input} value={form.telefone} onChangeText={v => setForm(p => ({ ...p, telefone: v }))} placeholder="11999990000" placeholderTextColor={theme.textSoft} keyboardType="phone-pad" />
              <Text style={styles.formLabel}>URL da Foto</Text>
              <TextInput style={styles.input} value={form.imagem} onChangeText={v => setForm(p => ({ ...p, imagem: v }))} placeholder="https://..." placeholderTextColor={theme.textSoft} autoCapitalize="none" />
              {!!formError && <Text style={styles.formError}>{formError}</Text>}
              <TouchableOpacity style={[styles.btnFull, saving && styles.btnFullDisabled]} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnFullText}>Salvar</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* Modal: serviços do barbeiro */}
      <Modal visible={servVisible} transparent animationType="slide" onRequestClose={() => setServVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setServVisible(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Serviços de {servBarbeiro?.nome}</Text>
              <TouchableOpacity onPress={() => setServVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            {servError
              ? <ErrorBlock message={servError} onRetry={() => openServs(servBarbeiro)} />
              : loadingServs
              ? <View style={{ paddingVertical: 32, alignItems: 'center' }}><ActivityIndicator color={theme.primary} /></View>
              : (
                <ScrollView showsVerticalScrollIndicator={false}>
                  <Text style={[styles.cardSub, { marginBottom: 12 }]}>Marque os serviços que este barbeiro realiza:</Text>
                  {allProcs.map(p => (
                    <TouchableOpacity key={p.id_procedimento} style={styles.procRow} onPress={() => toggleProc(p.id_procedimento)}>
                      <View style={{ flex: 1 }}>
                        <Text style={styles.cardTitle}>{p.nome}</Text>
                        <Text style={styles.cardSub}>{formatPrice(parseFloat(p.preco) || 0)} · {p.duracao} min</Text>
                      </View>
                      <Ionicons
                        name={selProcs.includes(p.id_procedimento) ? 'checkmark-circle' : 'ellipse-outline'}
                        size={24}
                        color={selProcs.includes(p.id_procedimento) ? theme.primary : theme.textSoft}
                      />
                    </TouchableOpacity>
                  ))}
                  {allProcs.length === 0 && <EmptyState icon="cut-outline" message="Nenhum serviço ativo." />}
                  <TouchableOpacity style={[styles.btnFull, savingServs && styles.btnFullDisabled]} onPress={saveServs} disabled={savingServs}>
                    {savingServs ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnFullText}>Salvar</Text>}
                  </TouchableOpacity>
                </ScrollView>
              )
            }
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Serviços ─────────────────────────────────────────────────────────────────

const PROC_EMPTY = { nome: '', preco: '', duracao: '', descricao: '' };

function ServicosTab() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(PROC_EMPTY);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  const load = useCallback(async () => {
    try {
      setError(null);
      setItems(await getAdminProcedimentos());
    } catch {
      setError('Não foi possível carregar os serviços.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => {
    if (filter === 'active') return items.filter(p => p.ativo);
    if (filter === 'inactive') return items.filter(p => !p.ativo);
    return items;
  }, [items, filter]);

  const openModal = (p = null) => {
    setEditingId(p ? p.id_procedimento : null);
    setForm(p
      ? { nome: p.nome, preco: String(p.preco), duracao: String(p.duracao), descricao: p.descricao || '' }
      : PROC_EMPTY
    );
    setFormError('');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.nome.trim()) { setFormError('O nome é obrigatório.'); return; }
    const preco = parseFloat(form.preco);
    if (isNaN(preco) || preco < 0) { setFormError('Informe um preço válido (≥ 0).'); return; }
    const duracao = parseInt(form.duracao, 10);
    if (isNaN(duracao) || duracao <= 0) { setFormError('Informe a duração em minutos (> 0).'); return; }
    setSaving(true);
    try {
      const payload = { nome: form.nome.trim(), preco, duracao, descricao: form.descricao.trim() || null };
      editingId ? await updateAdminProcedimento(editingId, payload) : await createAdminProcedimento(payload);
      setModalVisible(false);
      load();
    } catch { setFormError('Erro ao salvar. Tente novamente.'); }
    finally { setSaving(false); }
  };

  const handleInativar = (p) => {
    Alert.alert('Inativar Serviço', `Deseja inativar "${p.nome}"?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Inativar', style: 'destructive', onPress: async () => {
        try { await inativarAdminProcedimento(p.id_procedimento); load(); }
        catch { Alert.alert('Erro', 'Não foi possível inativar.'); }
      }},
    ]);
  };

  const handleAtivar = async (p) => {
    try { await ativarAdminProcedimento(p.id_procedimento); load(); }
    catch { Alert.alert('Erro', 'Não foi possível ativar.'); }
  };

  const FILTERS = [{ key: 'all', label: 'Todos' }, { key: 'active', label: 'Ativos' }, { key: 'inactive', label: 'Inativos' }];

  if (loading) return <View style={styles.loadingFull}><ActivityIndicator size="large" color={theme.primary} /></View>;
  if (error) return <ErrorBlock message={error} onRetry={load} />;

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); load(); }} tintColor={theme.primary} />}
      >
        <View style={styles.filterRow}>
          {FILTERS.map(f => (
            <TouchableOpacity key={f.key} style={[styles.chip, filter === f.key && styles.chipActive]} onPress={() => setFilter(f.key)}>
              <Text style={[styles.chipText, filter === f.key && styles.chipTextActive]}>{f.label}</Text>
            </TouchableOpacity>
          ))}
          <TouchableOpacity style={styles.chipAdd} onPress={() => openModal()}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.chipAddText}>Novo</Text>
          </TouchableOpacity>
        </View>

        {filtered.length === 0
          ? <EmptyState icon="cut-outline" message="Nenhum serviço encontrado." />
          : filtered.map(p => (
              <View key={p.id_procedimento} style={[styles.card, !p.ativo && styles.cardInactive]}>
                <View style={styles.cardTop}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.cardTitle}>{p.nome}</Text>
                    {!!p.descricao && <Text style={styles.cardSub}>{p.descricao}</Text>}
                    <Text style={styles.cardSub}>{p.duracao} min</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end', gap: 4 }}>
                    <Text style={{ color: theme.primary, fontWeight: '800', fontSize: 16 }}>{formatPrice(parseFloat(p.preco) || 0)}</Text>
                    <View style={{ backgroundColor: p.ativo ? '#D1FAE5' : '#FEE2E2', borderRadius: 20, paddingHorizontal: 8, paddingVertical: 2 }}>
                      <Text style={{ fontSize: 10, fontWeight: '700', color: p.ativo ? '#065F46' : '#DC2626' }}>
                        {p.ativo ? 'Ativo' : 'Inativo'}
                      </Text>
                    </View>
                  </View>
                </View>
                <View style={styles.actionsRow}>
                  <TouchableOpacity style={styles.btnSm} onPress={() => openModal(p)}>
                    <Text style={styles.btnSmText}>Editar</Text>
                  </TouchableOpacity>
                  {p.ativo
                    ? <TouchableOpacity style={styles.btnSmDanger} onPress={() => handleInativar(p)}>
                        <Text style={styles.btnSmDangerText}>Inativar</Text>
                      </TouchableOpacity>
                    : <TouchableOpacity style={styles.btnSmSuccess} onPress={() => handleAtivar(p)}>
                        <Text style={styles.btnSmSuccessText}>Ativar</Text>
                      </TouchableOpacity>
                  }
                </View>
              </View>
            ))
        }
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setModalVisible(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Editar Serviço' : 'Novo Serviço'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.formLabel}>Nome *</Text>
              <TextInput style={styles.input} value={form.nome} onChangeText={v => setForm(p => ({ ...p, nome: v }))} placeholder="Nome do serviço" placeholderTextColor={theme.textSoft} />
              <Text style={styles.formLabel}>Preço (R$) *</Text>
              <TextInput style={styles.input} value={form.preco} onChangeText={v => setForm(p => ({ ...p, preco: v }))} placeholder="0.00" placeholderTextColor={theme.textSoft} keyboardType="decimal-pad" />
              <Text style={styles.formLabel}>Duração (min) *</Text>
              <TextInput style={styles.input} value={form.duracao} onChangeText={v => setForm(p => ({ ...p, duracao: v }))} placeholder="30" placeholderTextColor={theme.textSoft} keyboardType="number-pad" />
              <Text style={styles.formLabel}>Descrição</Text>
              <TextInput style={[styles.input, { height: 80, textAlignVertical: 'top' }]} value={form.descricao} onChangeText={v => setForm(p => ({ ...p, descricao: v }))} placeholder="Descrição opcional" placeholderTextColor={theme.textSoft} multiline />
              {!!formError && <Text style={styles.formError}>{formError}</Text>}
              <TouchableOpacity style={[styles.btnFull, saving && styles.btnFullDisabled]} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnFullText}>Salvar</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Horários ─────────────────────────────────────────────────────────────────

const HOR_EMPTY = { id_barbeiro: null, dia: '', hora_inicio: '', hora_fim: '', disponivel: 1, observacao: '' };

function HorariosTab() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [barbeiros, setBarbeiros] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [buscado, setBuscado] = useState(false);
  const [filtBarbId, setFiltBarbId] = useState(null);
  const [filtData, setFiltData] = useState('');

  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(HOR_EMPTY);
  const [formError, setFormError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { getAdminBarbeiros({ ativo: 1 }).then(setBarbeiros).catch(() => {}); }, []);

  const buscar = useCallback(async () => {
    setLoading(true);
    setBuscado(true);
    try {
      setError(null);
      const params = {};
      if (filtBarbId) params.id_barbeiro = filtBarbId;
      if (filtData) params.data = filtData;
      setItems(await getAdminHorarios(params));
    } catch {
      setError('Não foi possível carregar os horários.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filtBarbId, filtData]);

  const openModal = (h = null) => {
    setEditingId(h ? h.id_horario : null);
    setForm(h
      ? { id_barbeiro: h.id_barbeiro, dia: h.dia, hora_inicio: h.hora_inicio, hora_fim: h.hora_fim, disponivel: h.disponivel, observacao: h.observacao || '' }
      : HOR_EMPTY
    );
    setFormError('');
    setModalVisible(true);
  };

  const handleSave = async () => {
    if (!form.id_barbeiro) { setFormError('Selecione um barbeiro.'); return; }
    if (!form.dia.trim()) { setFormError('Informe a data.'); return; }
    if (!form.hora_inicio.trim() || !form.hora_fim.trim()) { setFormError('Informe hora de início e fim.'); return; }
    setSaving(true);
    try {
      editingId ? await updateAdminHorario(editingId, form) : await createAdminHorario(form);
      setModalVisible(false);
      buscar();
    } catch { setFormError('Erro ao salvar. Tente novamente.'); }
    finally { setSaving(false); }
  };

  const handleBloquear = (h) => {
    Alert.alert('Bloquear Horário', `Bloquear ${fmtData(h.dia)} ${fmtHora(h.hora_inicio)}?`, [
      { text: 'Cancelar', style: 'cancel' },
      { text: 'Bloquear', style: 'destructive', onPress: async () => {
        try { await bloquearAdminHorario(h.id_horario); buscar(); }
        catch { Alert.alert('Erro', 'Não foi possível bloquear.'); }
      }},
    ]);
  };

  const handleLiberar = async (h) => {
    try { await liberarAdminHorario(h.id_horario); buscar(); }
    catch { Alert.alert('Erro', 'Não foi possível liberar.'); }
  };

  return (
    <View style={{ flex: 1 }}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); buscar(); }} tintColor={theme.primary} />}
      >
        <Text style={styles.eyebrow}>BARBEIRO</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
          <TouchableOpacity style={[styles.chip, !filtBarbId && styles.chipActive]} onPress={() => setFiltBarbId(null)}>
            <Text style={[styles.chipText, !filtBarbId && styles.chipTextActive]}>Todos</Text>
          </TouchableOpacity>
          {barbeiros.map(b => (
            <TouchableOpacity
              key={b.id_barbeiro}
              style={[styles.chip, filtBarbId === b.id_barbeiro && styles.chipActive]}
              onPress={() => setFiltBarbId(b.id_barbeiro)}
            >
              <Text style={[styles.chipText, filtBarbId === b.id_barbeiro && styles.chipTextActive]}>{b.nome}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        <Text style={styles.formLabel}>Data (AAAA-MM-DD)</Text>
        <View style={{ flexDirection: 'row', gap: 10, marginBottom: 16 }}>
          <TextInput
            style={[styles.input, { flex: 1 }]}
            value={filtData}
            onChangeText={setFiltData}
            placeholder="2026-06-08"
            placeholderTextColor={theme.textSoft}
          />
          <TouchableOpacity style={styles.btnSearch} onPress={buscar}>
            <Ionicons name="search" size={18} color="#fff" />
            <Text style={styles.btnSearchText}>Buscar</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.filterRow, { marginBottom: 8 }]}>
          <TouchableOpacity style={styles.chipAdd} onPress={() => openModal()}>
            <Ionicons name="add" size={16} color="#fff" />
            <Text style={styles.chipAddText}>Novo Horário</Text>
          </TouchableOpacity>
        </View>

        {loading && <View style={styles.loadingContainer}><ActivityIndicator color={theme.primary} /></View>}
        {!!error && <ErrorBlock message={error} onRetry={buscar} />}
        {!loading && !error && !buscado && <EmptyState icon="time-outline" message="Selecione os filtros e pressione Buscar." />}
        {!loading && !error && buscado && items.length === 0 && <EmptyState icon="time-outline" message="Nenhum horário encontrado." />}

        {!loading && items.map(h => (
          <View key={h.id_horario} style={styles.card}>
            <View style={styles.cardTop}>
              <View style={{ flex: 1 }}>
                <Text style={styles.cardTitle}>{h.barbeiro}</Text>
                <Text style={styles.cardSub}>{fmtData(h.dia)} · {fmtHora(h.hora_inicio)} – {fmtHora(h.hora_fim)}</Text>
                {!!h.observacao && <Text style={styles.cardSub}>{h.observacao}</Text>}
              </View>
              <View style={{ backgroundColor: h.disponivel ? '#D1FAE5' : '#FEE2E2', borderRadius: 20, paddingHorizontal: 10, paddingVertical: 3 }}>
                <Text style={{ fontSize: 11, fontWeight: '700', color: h.disponivel ? '#065F46' : '#DC2626' }}>
                  {h.disponivel ? 'Disponível' : 'Bloqueado'}
                </Text>
              </View>
            </View>
            <View style={styles.actionsRow}>
              <TouchableOpacity style={styles.btnSm} onPress={() => openModal(h)}>
                <Text style={styles.btnSmText}>Editar</Text>
              </TouchableOpacity>
              {h.disponivel
                ? <TouchableOpacity style={styles.btnSmDanger} onPress={() => handleBloquear(h)}>
                    <Text style={styles.btnSmDangerText}>Bloquear</Text>
                  </TouchableOpacity>
                : <TouchableOpacity style={styles.btnSmSuccess} onPress={() => handleLiberar(h)}>
                    <Text style={styles.btnSmSuccessText}>Liberar</Text>
                  </TouchableOpacity>
              }
            </View>
          </View>
        ))}
      </ScrollView>

      <Modal visible={modalVisible} transparent animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <TouchableOpacity style={styles.modalBackdrop} activeOpacity={1} onPress={() => setModalVisible(false)} />
          <View style={styles.modalSheet}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{editingId ? 'Editar Horário' : 'Novo Horário'}</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Ionicons name="close" size={24} color={theme.textSecondary} />
              </TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.formLabel}>Barbeiro *</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 8 }}>
                {barbeiros.map(b => (
                  <TouchableOpacity
                    key={b.id_barbeiro}
                    style={[styles.chip, form.id_barbeiro === b.id_barbeiro && styles.chipActive]}
                    onPress={() => setForm(p => ({ ...p, id_barbeiro: b.id_barbeiro }))}
                  >
                    <Text style={[styles.chipText, form.id_barbeiro === b.id_barbeiro && styles.chipTextActive]}>{b.nome}</Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
              <Text style={styles.formLabel}>Data * (AAAA-MM-DD)</Text>
              <TextInput style={styles.input} value={form.dia} onChangeText={v => setForm(p => ({ ...p, dia: v }))} placeholder="2026-06-08" placeholderTextColor={theme.textSoft} />
              <Text style={styles.formLabel}>Hora Início * (HH:MM)</Text>
              <TextInput style={styles.input} value={form.hora_inicio} onChangeText={v => setForm(p => ({ ...p, hora_inicio: v }))} placeholder="08:00" placeholderTextColor={theme.textSoft} />
              <Text style={styles.formLabel}>Hora Fim * (HH:MM)</Text>
              <TextInput style={styles.input} value={form.hora_fim} onChangeText={v => setForm(p => ({ ...p, hora_fim: v }))} placeholder="09:00" placeholderTextColor={theme.textSoft} />
              <Text style={styles.formLabel}>Disponibilidade</Text>
              <TouchableOpacity
                style={[styles.toggleBtn, form.disponivel ? styles.toggleBtnOn : styles.toggleBtnOff]}
                onPress={() => setForm(p => ({ ...p, disponivel: p.disponivel ? 0 : 1 }))}
              >
                <Text style={{ fontWeight: '700', fontSize: 14, color: form.disponivel ? '#065F46' : '#DC2626' }}>
                  {form.disponivel ? 'Disponível' : 'Bloqueado'}
                </Text>
              </TouchableOpacity>
              <Text style={styles.formLabel}>Observação</Text>
              <TextInput style={styles.input} value={form.observacao} onChangeText={v => setForm(p => ({ ...p, observacao: v }))} placeholder="Opcional" placeholderTextColor={theme.textSoft} />
              {!!formError && <Text style={styles.formError}>{formError}</Text>}
              <TouchableOpacity style={[styles.btnFull, saving && styles.btnFullDisabled]} onPress={handleSave} disabled={saving}>
                {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.btnFullText}>Salvar</Text>}
              </TouchableOpacity>
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

// ─── Agenda ───────────────────────────────────────────────────────────────────

const STATUS_OPTS = [
  { key: '', label: 'Todos' },
  { key: 'pendente', label: 'Pendentes' },
  { key: 'confirmado', label: 'Confirmados' },
  { key: 'concluido', label: 'Concluídos' },
  { key: 'cancelado', label: 'Cancelados' },
];

function AgendaTab() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState(null);
  const [filtStatus, setFiltStatus] = useState('');
  const [filtDataIni, setFiltDataIni] = useState('');
  const [filtDataFim, setFiltDataFim] = useState('');

  const load = useCallback(async (params = {}) => {
    try {
      setError(null);
      setItems(await getAdminAgendamentos(params));
    } catch {
      setError('Não foi possível carregar a agenda.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const aplicarFiltros = () => {
    setLoading(true);
    const params = {};
    if (filtStatus) params.status = filtStatus;
    if (filtDataIni) params.data_inicio = filtDataIni;
    if (filtDataFim) params.data_fim = filtDataFim;
    load(params);
  };

  const updateStatus = (a, novoStatus) => {
    const LABEL = { confirmado: 'Confirmar', concluido: 'Concluir', cancelado: 'Cancelar' };
    Alert.alert(
      `${LABEL[novoStatus]} Agendamento`,
      `${LABEL[novoStatus]} o agendamento de ${a.cliente}?`,
      [
        { text: 'Voltar', style: 'cancel' },
        { text: 'Confirmar', onPress: async () => {
          try { await updateAdminAgendamentoStatus(a.id_agendamento, novoStatus); aplicarFiltros(); }
          catch { Alert.alert('Erro', 'Não foi possível atualizar o status.'); }
        }},
      ]
    );
  };

  return (
    <ScrollView
      contentContainerStyle={styles.scrollContent}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); aplicarFiltros(); }} tintColor={theme.primary} />}
    >
      <Text style={styles.eyebrow}>STATUS</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 12 }}>
        {STATUS_OPTS.map(s => (
          <TouchableOpacity
            key={s.key}
            style={[styles.chip, filtStatus === s.key && styles.chipActive]}
            onPress={() => setFiltStatus(s.key)}
          >
            <Text style={[styles.chipText, filtStatus === s.key && styles.chipTextActive]}>{s.label}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <Text style={styles.eyebrow}>PERÍODO</Text>
      <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
        <TextInput style={[styles.input, { flex: 1 }]} value={filtDataIni} onChangeText={setFiltDataIni} placeholder="De: AAAA-MM-DD" placeholderTextColor={theme.textSoft} />
        <TextInput style={[styles.input, { flex: 1 }]} value={filtDataFim} onChangeText={setFiltDataFim} placeholder="Até: AAAA-MM-DD" placeholderTextColor={theme.textSoft} />
      </View>
      <TouchableOpacity style={[styles.btnSearch, { marginBottom: 16, alignSelf: 'flex-start' }]} onPress={aplicarFiltros}>
        <Ionicons name="filter-outline" size={18} color="#fff" />
        <Text style={styles.btnSearchText}>Filtrar</Text>
      </TouchableOpacity>

      {loading && <View style={styles.loadingContainer}><ActivityIndicator color={theme.primary} /></View>}
      {!!error && <ErrorBlock message={error} onRetry={aplicarFiltros} />}
      {!loading && !error && items.length === 0 && <EmptyState icon="calendar-outline" message="Nenhum agendamento encontrado." />}

      {!loading && items.map(a => (
        <View key={a.id_agendamento} style={styles.card}>
          <View style={styles.cardTop}>
            <View style={{ flex: 1 }}>
              <Text style={styles.cardTitle}>{a.cliente}</Text>
              <Text style={styles.cardSub}>{a.procedimento} · {a.barbeiro}</Text>
              <Text style={styles.cardSub}>{fmtData(a.data)} às {fmtHora(a.hora)} · {a.duracao} min</Text>
              {a.valor_total != null && (
                <Text style={[styles.cardSub, { color: theme.primary, fontWeight: '700' }]}>{formatPrice(parseFloat(a.valor_total) || 0)}</Text>
              )}
            </View>
            <StatusBadge status={a.status} />
          </View>
          {(a.status === 'pendente' || a.status === 'confirmado') && (
            <View style={styles.actionsRow}>
              {a.status === 'pendente' && (
                <TouchableOpacity style={styles.btnSmSuccess} onPress={() => updateStatus(a, 'confirmado')}>
                  <Text style={styles.btnSmSuccessText}>Confirmar</Text>
                </TouchableOpacity>
              )}
              {a.status === 'confirmado' && (
                <TouchableOpacity style={styles.btnSmSuccess} onPress={() => updateStatus(a, 'concluido')}>
                  <Text style={styles.btnSmSuccessText}>Concluir</Text>
                </TouchableOpacity>
              )}
              <TouchableOpacity style={styles.btnSmDanger} onPress={() => updateStatus(a, 'cancelado')}>
                <Text style={styles.btnSmDangerText}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      ))}
    </ScrollView>
  );
}

// ─── Tela principal ───────────────────────────────────────────────────────────

const TABS = [
  { key: 'visao',     label: 'Visão Geral', icon: 'grid',     iconOff: 'grid-outline'     },
  { key: 'barbeiros', label: 'Barbeiros',   icon: 'people',   iconOff: 'people-outline'   },
  { key: 'servicos',  label: 'Serviços',    icon: 'cut',      iconOff: 'cut-outline'      },
  { key: 'horarios',  label: 'Horários',    icon: 'time',     iconOff: 'time-outline'     },
  { key: 'agenda',    label: 'Agenda',      icon: 'calendar', iconOff: 'calendar-outline' },
];

export default function AdminPage() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [activeTab, setActiveTab] = useState('visao');

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.isDark ? 'light-content' : 'dark-content'} backgroundColor={theme.background} />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>PAINEL ADMIN</Text>
        <Text style={styles.title}>Administração</Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBarScroll} contentContainerStyle={styles.tabBar}>
        {TABS.map(t => {
          const active = activeTab === t.key;
          return (
            <TouchableOpacity
              key={t.key}
              style={[styles.tabBtn, active && styles.tabBtnActive]}
              onPress={() => setActiveTab(t.key)}
            >
              <Ionicons name={active ? t.icon : t.iconOff} size={17} color={active ? '#fff' : theme.textSecondary} />
              <Text style={[styles.tabBtnText, active && styles.tabBtnTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      <View style={{ flex: 1 }}>
        {activeTab === 'visao'     && <VisaoGeralTab />}
        {activeTab === 'barbeiros' && <BarbeirosTab />}
        {activeTab === 'servicos'  && <ServicosTab />}
        {activeTab === 'horarios'  && <HorariosTab />}
        {activeTab === 'agenda'    && <AgendaTab />}
      </View>
    </SafeAreaView>
  );
}

// ─── Estilos ──────────────────────────────────────────────────────────────────

function createStyles(theme) {
  return StyleSheet.create({
    container:        { flex: 1, backgroundColor: theme.background },
    header:           { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 4 },
    eyebrow:          { fontSize: 12, fontWeight: '700', color: theme.primary, letterSpacing: 0.8, textTransform: 'uppercase' },
    title:            { fontSize: 26, fontWeight: '800', color: theme.text, marginTop: 2 },
    tabBarScroll:     { maxHeight: 52, marginBottom: 4 },
    tabBar:           { paddingHorizontal: 16, paddingVertical: 8, gap: 8, alignItems: 'center' },
    tabBtn:           { flexDirection: 'row', alignItems: 'center', gap: 6, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: theme.surfaceMuted },
    tabBtnActive:     { backgroundColor: theme.primary },
    tabBtnText:       { fontSize: 13, fontWeight: '600', color: theme.textSecondary },
    tabBtnTextActive: { color: '#fff' },
    scrollContent:    { padding: 16, paddingBottom: 32 },
    sectionTitle:     { fontSize: 18, fontWeight: '800', color: theme.text, marginTop: 24, marginBottom: 10 },
    metricGrid:       { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 4 },
    metricCard: {
      flex: 1, minWidth: '44%', backgroundColor: theme.surface, borderRadius: 18,
      borderWidth: 1, borderColor: theme.border, padding: 16,
      shadowColor: theme.shadow, shadowOpacity: theme.isDark ? 0.16 : 0.05,
      shadowOffset: { width: 0, height: 2 }, shadowRadius: 8, elevation: 2,
    },
    metricValue:      { fontSize: 22, fontWeight: '800', color: theme.text, marginTop: 8 },
    metricLabel:      { fontSize: 12, fontWeight: '600', color: theme.textMuted, marginTop: 2 },
    card: {
      backgroundColor: theme.surface, borderRadius: 16, borderWidth: 1,
      borderColor: theme.border, padding: 14, marginBottom: 10,
      shadowColor: theme.shadow, shadowOpacity: theme.isDark ? 0.16 : 0.05,
      shadowOffset: { width: 0, height: 2 }, shadowRadius: 6, elevation: 2,
    },
    cardInactive:     { opacity: 0.6 },
    cardTop:          { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 8 },
    cardTitle:        { fontSize: 15, fontWeight: '700', color: theme.text, marginBottom: 2 },
    cardSub:          { fontSize: 13, color: theme.textSecondary, marginBottom: 1 },
    actionsRow:       { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginTop: 4 },
    btnSm:            { borderWidth: 1, borderColor: theme.primary, borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
    btnSmText:        { fontSize: 13, fontWeight: '600', color: theme.primary },
    btnSmDanger:      { borderWidth: 1, borderColor: '#EF4444', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
    btnSmDangerText:  { fontSize: 13, fontWeight: '600', color: '#EF4444' },
    btnSmSuccess:     { borderWidth: 1, borderColor: '#22C55E', borderRadius: 8, paddingHorizontal: 12, paddingVertical: 5 },
    btnSmSuccessText: { fontSize: 13, fontWeight: '600', color: '#22C55E' },
    filterRow:        { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 14 },
    chip:             { paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: theme.surfaceMuted, borderWidth: 1, borderColor: theme.border },
    chipActive:       { backgroundColor: theme.primary, borderColor: theme.primary },
    chipText:         { fontSize: 13, fontWeight: '600', color: theme.textSecondary },
    chipTextActive:   { color: '#fff' },
    chipAdd:          { flexDirection: 'row', alignItems: 'center', gap: 4, paddingHorizontal: 14, paddingVertical: 7, borderRadius: 20, backgroundColor: theme.primary },
    chipAddText:      { fontSize: 13, fontWeight: '700', color: '#fff' },
    loadingFull:      { flex: 1, alignItems: 'center', justifyContent: 'center' },
    loadingContainer: { paddingVertical: 48, alignItems: 'center' },
    btnSearch:        { flexDirection: 'row', alignItems: 'center', gap: 6, backgroundColor: theme.primary, borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10 },
    btnSearchText:    { color: '#fff', fontWeight: '700', fontSize: 14 },
    modalOverlay:     { flex: 1, justifyContent: 'flex-end' },
    modalBackdrop:    { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.5)' },
    modalSheet:       { backgroundColor: theme.surface, borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 24, paddingBottom: 32, maxHeight: '90%' },
    modalHeader:      { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 },
    modalTitle:       { fontSize: 18, fontWeight: '800', color: theme.text },
    formLabel:        { fontSize: 13, fontWeight: '600', color: theme.textSecondary, marginBottom: 6, marginTop: 12 },
    input:            { backgroundColor: theme.backgroundSecondary, borderWidth: 1, borderColor: theme.border, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 15, color: theme.text },
    formError:        { color: '#EF4444', fontSize: 13, marginTop: 8 },
    btnFull:          { backgroundColor: theme.primary, borderRadius: 14, paddingVertical: 14, alignItems: 'center', marginTop: 20, marginBottom: 8 },
    btnFullDisabled:  { opacity: 0.6 },
    btnFullText:      { color: '#fff', fontSize: 16, fontWeight: '700' },
    toggleBtn:        { borderRadius: 10, paddingHorizontal: 16, paddingVertical: 10, alignItems: 'center', marginBottom: 4 },
    toggleBtnOn:      { backgroundColor: '#D1FAE5' },
    toggleBtnOff:     { backgroundColor: '#FEE2E2' },
    procRow:          { flexDirection: 'row', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: theme.divider },
  });
}
