import React, { useState, useMemo } from 'react';
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { View, Text, ScrollView, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  barbearia,
  barbeiros,
  gerarHorarios,
  ehDataIndisponivel,
  ehDataAnteriorHoje,
  ehDiaSemTrabalhoBarbeiro,
  obterHorariosDisponiveis,
  obterBarbeiro,
} from '../assets/dados/horariosExemplo';
import HorariosStyle from '../assets/styles/HorariosStyle';

export default function HorariosPage({ navigation, route }) {
  const barbeiroSelecionado = route.params?.barbeiroSelecionado;
  const barbeirosId = barbeiroSelecionado?.id ?? 1;

  const now = new Date();
  const initialMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const [currentMonth, setCurrentMonth] = useState(initialMonth);
  const [selectedDate, setSelectedDate] = useState('2026-03-18');
  const [selectedTime, setSelectedTime] = useState('09:00');
  const { dataSelecionada, setDataSelecionada } = useContext(AppContext);
  const { horaSelecionada, setHoraSelecionada } = useContext(AppContext);

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(i);

    return days;
  }, [currentMonth]);

  const horariosDisponiveis = useMemo(() => {
    if (!selectedDate) return [];
    if (ehDiaSemTrabalhoBarbeiro(barbeirosId, selectedDate)) return [];
    return obterHorariosDisponiveis(barbeirosId, selectedDate);
  }, [selectedDate, barbeirosId]);

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
    const ehPassada = ehDataAnteriorHoje(dataFormatada);
    const naoTrabalhaDia = ehDiaSemTrabalhoBarbeiro(barbeirosId, dataFormatada);
    if (!ehPassada && !naoTrabalhaDia) {
      setSelectedDate(dataFormatada);
      setSelectedTime(null);
    }
  };

  const irParaProxima = () => {
    if (selectedDate && selectedTime) {
      setDataSelecionada(selectedDate);
      setHoraSelecionada(selectedTime);
      console.log('Data:', selectedDate, 'Hora:', selectedTime);
    }
  };
  const voltarPage = () => {
    setDataSelecionada(null);
    setHoraSelecionada(null);
    navigation.goBack();
  }

  const nomeMes = currentMonth.toLocaleString('pt-BR', { month: 'long', year: 'numeric' });
  const barbeiro = obterBarbeiro(barbeirosId);

  return (
    <SafeAreaView style={HorariosStyle.container}>
      <ScrollView alwaysBounceVertical={true}>
        <View style={HorariosStyle.page}>
          {/* Header */}
          <View style={HorariosStyle.header}>
            <Pressable onPress={voltarPage} style={HorariosStyle.headerButton}>
              <Text style={HorariosStyle.headerBack}>‹</Text>
            </Pressable>
            <Text style={HorariosStyle.headerTitle}>Data e Hora</Text>
            <View style={{ width: 32 }} />
          </View>

          {/* Progress Bar */}
          <View style={HorariosStyle.progressContainer}>
            <View style={HorariosStyle.progressRow}>
              <View style={HorariosStyle.progressActive} />
              <View style={HorariosStyle.progressActive} />
              <View style={HorariosStyle.progressActive} />
              <View style={HorariosStyle.progressInactive} />
              <Text style={HorariosStyle.progressText}>3/4</Text>
            </View>
          </View>

          {/* Informações do Barbeiro */}
          {barbeiro && (
            <View style={HorariosStyle.barbeiroBox}>
              <Text style={HorariosStyle.barbeiroLabel}>Profissional Selecionado</Text>
              <Text style={HorariosStyle.barbeiroNome}>{barbeiro.nome}</Text>
            </View>
          )}

          {/* Calendário */}
          <View style={HorariosStyle.calendarContainer}>
            <View style={HorariosStyle.calendarNav}>
              <Pressable onPress={irParaMesAnterior} style={HorariosStyle.navButton}>
                <Text style={HorariosStyle.navText}>‹</Text>
              </Pressable>
              <Text style={HorariosStyle.monthText}>{nomeMes}</Text>
              <Pressable onPress={irParaProximoMes} style={HorariosStyle.navButton}>
                <Text style={HorariosStyle.navText}>›</Text>
              </Pressable>
            </View>

            <View style={HorariosStyle.weekRow}>
              {['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'].map((dia) => (
                <Text key={dia} style={HorariosStyle.weekDay}>{dia}</Text>
              ))}
            </View>

            <View style={HorariosStyle.daysGrid}>
              {calendarDays.map((dia, index) => {
                if (dia === null) {
                  return <View key={`empty-${index}`} style={HorariosStyle.emptyDay} />;
                }
                const dataFormatada = formatarData(dia);
                const ehIndisponivel = ehDataIndisponivel(dataFormatada);
                const ehPassada = ehDataAnteriorHoje(dataFormatada);
                const naoTrabalhaDia = ehDiaSemTrabalhoBarbeiro(barbeirosId, dataFormatada);
                const ehSelecionada = selectedDate === dataFormatada;
                const disabled = ehIndisponivel || ehPassada || naoTrabalhaDia;

                return (
                  <Pressable
                    key={dia}
                    onPress={() => selecionarData(dia)}
                    disabled={disabled}
                    style={[
                      HorariosStyle.dayBox,
                      ehSelecionada && HorariosStyle.daySelected,
                      ehPassada && HorariosStyle.dayPast,
                      naoTrabalhaDia && HorariosStyle.barberOff,
                      !ehPassada && !naoTrabalhaDia && ehIndisponivel && HorariosStyle.dayUnavailable,
                    ]}
                  >
                    <Text style={[
                      HorariosStyle.dayText,
                      ehSelecionada && HorariosStyle.dayTextSelected,
                      ehPassada && HorariosStyle.dayTextPast,
                      naoTrabalhaDia && HorariosStyle.dayTextBarberOff,
                      !ehPassada && !naoTrabalhaDia && ehIndisponivel && HorariosStyle.dayTextUnavailable,
                    ]}>
                      {dia}
                    </Text>
                    {ehPassada && <View style={HorariosStyle.dayPastCrossed} />}
                    {naoTrabalhaDia && <View style={HorariosStyle.barberOffCrossed} />}
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* Horários Disponíveis */}
          <View style={HorariosStyle.horariosContainer}>
            <Text style={HorariosStyle.horariosTitle}>Horários Disponíveis</Text>
            {horariosDisponiveis.length > 0 ? (
              <View style={HorariosStyle.horariosGrid}>
                {horariosDisponiveis.map((horario) => {
                  const ehSelecionado = selectedTime === horario;
                  return (
                    <Pressable
                      key={horario}
                      onPress={() => setSelectedTime(horario)}
                      style={[
                        HorariosStyle.horarioBox,
                        ehSelecionado && HorariosStyle.horarioBoxSelected,
                      ]}
                    >
                      <Text style={[
                        HorariosStyle.horarioText,
                        ehSelecionado && HorariosStyle.horarioTextSelected,
                      ]}>
                        {horario}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <View style={HorariosStyle.noHorariosBox}>
                <Text style={HorariosStyle.noHorariosText}>Nenhum horário disponível para esta data</Text>
                <Text style={HorariosStyle.noHorariosSub}>Selecione outra data</Text>
              </View>
            )}
          </View>

          {/* Resumo da Seleção */}
          {selectedDate && selectedTime && (
            <View style={HorariosStyle.resumoBox}>
              <Text style={HorariosStyle.resumoLabel}>Resumo da Seleção</Text>
              <Text style={HorariosStyle.resumoData}>
                {new Date(selectedDate).toLocaleDateString('pt-BR', {
                  weekday: 'long',
                  day: '2-digit',
                  month: 'long',
                  year: 'numeric',
                })}
              </Text>
              <Text style={HorariosStyle.resumoHora}>{selectedTime}</Text>
            </View>
          )}

          {/* Botão Próximo */}
          <View style={HorariosStyle.nextContainer}>
            <Pressable
              onPress={irParaProxima}
              disabled={!selectedDate || !selectedTime}
              style={[
                HorariosStyle.nextButton,
                !(selectedDate && selectedTime) && HorariosStyle.nextButtonDisabled,
              ]}
            >
              <Text style={HorariosStyle.nextButtonText}>Próximo</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}