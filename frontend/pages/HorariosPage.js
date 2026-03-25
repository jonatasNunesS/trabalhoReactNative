  import React, { useState, useMemo } from 'react';
  import { View, Text, ScrollView, Pressable, Dimensions } from 'react-native';
  import { SafeAreaView } from 'react-native-safe-area-context';
  import {
    barbearia,
    barbeiros,
    gerarHorarios,
    ehDataIndisponivel,
    obterHorariosDisponiveis,
    obterBarbeiro,
  } from '../assets/dados/horariosExemplo';

  const SCREEN_WIDTH = Dimensions.get('window').width;
  const CALENDAR_ITEM_SIZE = (SCREEN_WIDTH - 80) / 7;

  export default function HorariosPage({ barbeirosId = 1, onSelectDateTime }) {
    const [currentMonth, setCurrentMonth] = useState(new Date(2026, 2, 1)); // Março 2026
    const [selectedDate, setSelectedDate] = useState('2026-03-18');
    const [selectedTime, setSelectedTime] = useState('09:00');

    // Gerar dias do calendário
    const calendarDays = useMemo(() => {
      const year = currentMonth.getFullYear();
      const month = currentMonth.getMonth();

      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);

      const startingDayOfWeek = firstDay.getDay();
      const daysInMonth = lastDay.getDate();

      const days = [];

      for (let i = 0; i < startingDayOfWeek; i++) {
        days.push(null);
      }

      for (let i = 1; i <= daysInMonth; i++) {
        days.push(i);
      }

      return days;
    }, [currentMonth]);

    // Gerar horários disponíveis
    const horariosDisponiveis = useMemo(() => {
      if (!selectedDate) return [];
      return obterHorariosDisponiveis(barbeirosId, selectedDate);
    }, [selectedDate, barbeirosId]);

    // Formatar data para YYYY-MM-DD
    const formatarData = (dia) => {
      const year = currentMonth.getFullYear();
      const month = String(currentMonth.getMonth() + 1).padStart(2, '0');
      const day = String(dia).padStart(2, '0');
      return `${year}-${month}-${day}`;
    };

    const irParaMesAnterior = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const irParaProximoMes = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const selecionarData = (dia) => {
      const dataFormatada = formatarData(dia);
      if (!ehDataIndisponivel(dataFormatada)) {
        setSelectedDate(dataFormatada);
        setSelectedTime(null);
      }
    };

    const irParaProxima = () => {
      if (selectedDate && selectedTime) {
        if (onSelectDateTime) {
          onSelectDateTime(selectedDate, selectedTime);
        }
        console.log('Data:', selectedDate, 'Hora:', selectedTime);
      }
    };

    const nomeMes = currentMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
    const barbeiro = obterBarbeiro(barbeirosId);

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#fff' }}>
        <ScrollView 
          
          alwaysBounceVertical={true} 
        >
        <View style={{ backgroundColor: '#fff' }}>
          {/* Header */}
          <View style={{ backgroundColor: '#1E3A8A', paddingHorizontal: 16, paddingVertical: 16, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Pressable onPress={() => console.log('Voltar')} style={{ padding: 8 }}>
              <Text style={{ color: '#fff', fontSize: 24, fontWeight: 'bold' }}>‹</Text>
            </Pressable>
            <Text style={{ color: '#fff', fontSize: 18, fontWeight: 'bold', flex: 1, textAlign: 'center' }}>Data e Hora</Text>
            <View style={{ width: 32 }} />
          </View>

          {/* Progress Bar */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 12 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <View style={{ flex: 1, height: 4, backgroundColor: '#1E3A8A', borderRadius: 2 }} />
              <View style={{ flex: 1, height: 4, backgroundColor: '#1E3A8A', borderRadius: 2 }} />
              <View style={{ flex: 1, height: 4, backgroundColor: '#1E3A8A', borderRadius: 2 }} />
              <View style={{ flex: 1, height: 4, backgroundColor: '#D3D3D3', borderRadius: 2 }} />
              <Text style={{ color: '#808080', fontSize: 12, marginLeft: 8 }}>3/4</Text>
            </View>
          </View>
            {/* Informações do Barbeiro */}
            {barbeiro && (
              <View style={{ paddingHorizontal: 16, paddingVertical: 12, backgroundColor: '#F5F5F5', marginHorizontal: 16, borderRadius: 8, marginBottom: 16 }}>
                <Text style={{ color: '#808080', fontSize: 12 }}>Profissional Selecionado</Text>
                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16, marginTop: 4 }}>{barbeiro.nome}</Text>
              </View>
            )}

            {/* Calendário */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
              {/* Navegação de Mês */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
                <Pressable onPress={irParaMesAnterior} style={{ padding: 8 }}>
                  <Text style={{ color: '#1E3A8A', fontSize: 24, fontWeight: 'bold' }}>‹</Text>
                </Pressable>
                <Text style={{ color: '#1E3A8A', fontWeight: 'bold', fontSize: 18, textTransform: 'capitalize' }}>{nomeMes}</Text>
                <Pressable onPress={irParaProximoMes} style={{ padding: 8 }}>
                  <Text style={{ color: '#1E3A8A', fontSize: 24, fontWeight: 'bold' }}>›</Text>
                </Pressable>
              </View>

              {/* Dias da Semana */}
              <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((dia) => (
                  <Text key={dia} style={{ color: '#808080', fontWeight: '600', fontSize: 12, textAlign: 'center', width: CALENDAR_ITEM_SIZE }}>
                    {dia}
                  </Text>
                ))}
              </View>

              {/* Grid de Datas */}
              <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                {calendarDays.map((dia, index) => {
                  if (dia === null) {
                    return <View key={`empty-${index}`} style={{ width: CALENDAR_ITEM_SIZE, height: CALENDAR_ITEM_SIZE }} />;
                  }

                  const dataFormatada = formatarData(dia);
                  const ehIndisponivel = ehDataIndisponivel(dataFormatada);
                  const ehSelecionada = selectedDate === dataFormatada;

                  return (
                    <Pressable
                      key={dia}
                      onPress={() => selecionarData(dia)}
                      disabled={ehIndisponivel}
                      style={{
                        width: CALENDAR_ITEM_SIZE,
                        height: CALENDAR_ITEM_SIZE,
                        justifyContent: 'center',
                        alignItems: 'center',
                        marginBottom: 8,
                        borderRadius: 8,
                        borderWidth: 1,
                        backgroundColor: ehSelecionada ? '#1E3A8A' : ehIndisponivel ? '#FEE2E2' : '#fff',
                        borderColor: ehSelecionada ? '#1E3A8A' : ehIndisponivel ? '#FCA5A5' : '#D3D3D3',
                      }}
                    >
                      <Text
                        style={{
                          fontWeight: '600',
                          fontSize: 16,
                          color: ehSelecionada ? '#fff' : ehIndisponivel ? '#DC2626' : '#000',
                        }}
                      >
                        {dia}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </View>

            {/* Horários Disponíveis */}
            <View style={{ paddingHorizontal: 16, paddingVertical: 16 }}>
              <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16, marginBottom: 12 }}>Horários Disponíveis</Text>

              {horariosDisponiveis.length > 0 ? (
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
                  {horariosDisponiveis.map((horario) => {
                    const ehSelecionado = selectedTime === horario;
                    return (
                      <Pressable
                        key={horario}
                        onPress={() => setSelectedTime(horario)}
                        style={{
                          paddingHorizontal: 16,
                          paddingVertical: 12,
                          borderRadius: 8,
                          borderWidth: 2,
                          backgroundColor: ehSelecionado ? '#1E3A8A' : '#fff',
                          borderColor: ehSelecionado ? '#1E3A8A' : '#D3D3D3',
                          minWidth: '30%',
                          alignItems: 'center',
                        }}
                      >
                        <Text
                          style={{
                            fontWeight: '600',
                            fontSize: 16,
                            color: ehSelecionado ? '#fff' : '#000',
                            textAlign: 'center',
                          }}
                        >
                          {horario}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              ) : (
                <View style={{ backgroundColor: '#FEE2E2', borderWidth: 1, borderColor: '#FECACA', borderRadius: 8, padding: 16 }}>
                  <Text style={{ color: '#DC2626', fontWeight: '600' }}>Nenhum horário disponível para esta data</Text>
                  <Text style={{ color: '#EF5350', fontSize: 12, marginTop: 4 }}>Selecione outra data</Text>
                </View>
              )}
            </View>

            {/* Informações Selecionadas */}
            {selectedDate && selectedTime && (
              <View style={{ paddingHorizontal: 16, paddingVertical: 16, backgroundColor: '#F0FDFA', marginHorizontal: 16, borderRadius: 8, borderWidth: 1, borderColor: '#0D9488', marginBottom: 16 }}>
                <Text style={{ color: '#0D7377', fontWeight: '600', fontSize: 12 }}>Resumo da Seleção</Text>
                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16, marginTop: 8 }}>
                  {new Date(selectedDate).toLocaleDateString('pt-BR', {
                    weekday: 'long',
                    day: '2-digit',
                    month: 'long',
                    year: 'numeric',
                  })}
                </Text>
                <Text style={{ color: '#000', fontWeight: 'bold', fontSize: 16, marginTop: 4 }}>{selectedTime}</Text>
              </View>
            )}
        
          {/* Botão Próximo */}
          <View style={{ paddingHorizontal: 16, paddingVertical: 16, borderTopWidth: 1, borderTopColor: '#D3D3D3' }}>
            <Pressable
              onPress={irParaProxima}
              disabled={!selectedDate || !selectedTime}
              style={{
                paddingVertical: 16,
                borderRadius: 8,
                backgroundColor: selectedDate && selectedTime ? '#1E3A8A' : '#D3D3D3',
              }}
            >
              <Text style={{ color: '#fff', fontWeight: 'bold', fontSize: 16, textAlign: 'center' }}>Próximo</Text>
            </Pressable>
          </View>
        </View>
        </ScrollView>
      </SafeAreaView>
    );
  }
