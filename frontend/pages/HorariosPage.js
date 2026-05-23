import React, { useMemo, useState, useContext } from "react";
import { View, Text, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { AppContext } from "../context/AppContext";
import Avatar from "../components/Avatar";
import {
  barbearia,
  barbeiros,
  gerarHorarios,
  ehDataIndisponivel,
  ehDataAnteriorHoje,
  ehDiaSemTrabalhoBarbeiro,
  obterHorariosDisponiveis,
} from "../assets/dados/horariosExemplo";
import HorariosStyle from "../assets/styles/HorariosStyle";
import { formatPrice } from "../utils/utilidades";

function formatarDataVisual(dateString) {
  const date = new Date(`${dateString}T00:00:00`);
  return date.toLocaleDateString("pt-BR", {
    weekday: "long",
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function HorariosPage({ navigation, route }) {
  const serviceFromRoute = route.params?.service || null;
  const professionalFromRoute = route.params?.professional || null;
  const flowMode = route.params?.flowMode || "service-first";

  const {
    servicoSelecionado,
    barbeiroSelecionado,
    setBarbeiroSelecionado,
    setDataSelecionada,
    setHoraSelecionada,
  } = useContext(AppContext);

  const service = serviceFromRoute || servicoSelecionado;
  const initialProfessional = professionalFromRoute || barbeiroSelecionado || null;
  const isProfessionalFirst = flowMode === "professional-first" && !!initialProfessional;

  const today = new Date();
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1)
  );
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);
  const [selectedProfessional, setSelectedProfessional] = useState(
    isProfessionalFirst ? initialProfessional : null
  );

  const professionalsForService = useMemo(() => {
    if (isProfessionalFirst) {
      return [
        {
          id: initialProfessional?.id ?? 1,
          name: initialProfessional?.name || "Profissional",
          specialty: initialProfessional?.specialty || "Especialista",
          rating:
            typeof initialProfessional?.rating === "number"
              ? initialProfessional.rating
              : 4.8,
          photoUrl: initialProfessional?.photoUrl || "",
          servicesOffered: Array.isArray(initialProfessional?.servicesOffered)
            ? initialProfessional.servicesOffered
            : [],
        },
      ];
    }

    const routeProfessionals = Array.isArray(service?.availableBarbers)
      ? service.availableBarbers
      : [];

    return routeProfessionals.map((professional, index) => {
      const profissionalAgenda = barbeiros.find(
        (barbeiro) =>
          String(barbeiro.id) === String(professional.id) ||
          barbeiro.nome?.toLowerCase() === professional?.name?.toLowerCase()
      );

      return {
        id: professional?.id ?? index + 1,
        name: professional?.name || profissionalAgenda?.nome || "Profissional",
        specialty:
          professional?.specialty ||
          profissionalAgenda?.especialidade ||
          "Especialista",
        rating:
          typeof professional?.rating === "number" ? professional.rating : 4.8,
        photoUrl: professional?.photoUrl || "",
        servicesOffered: Array.isArray(professional?.servicesOffered)
          ? professional.servicesOffered
          : service?.name
          ? [service.name]
          : [],
      };
    });
  }, [initialProfessional, isProfessionalFirst, service]);

  const fixedProfessional = isProfessionalFirst ? professionalsForService[0] : null;

  const calendarDays = useMemo(() => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startingDayOfWeek = firstDay.getDay();
    const daysInMonth = lastDay.getDate();
    const days = [];

    for (let i = 0; i < startingDayOfWeek; i += 1) {
      days.push(null);
    }

    for (let i = 1; i <= daysInMonth; i += 1) {
      days.push(i);
    }

    return days;
  }, [currentMonth]);

  const formatarData = (dia) => {
    const year = currentMonth.getFullYear();
    const month = String(currentMonth.getMonth() + 1).padStart(2, "0");
    const day = String(dia).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const hasProfessionalsWorkingOnDate = (dateString) => {
    if (!professionalsForService.length) return false;

    if (isProfessionalFirst && fixedProfessional) {
      if (ehDiaSemTrabalhoBarbeiro(fixedProfessional.id, dateString)) {
        return false;
      }
      return obterHorariosDisponiveis(fixedProfessional.id, dateString).length > 0;
    }

    return professionalsForService.some((professional) => {
      if (ehDiaSemTrabalhoBarbeiro(professional.id, dateString)) {
        return false;
      }

      const horariosDoProfissional = obterHorariosDisponiveis(
        professional.id,
        dateString
      );

      return horariosDoProfissional.length > 0;
    });
  };

  const availableTimes = useMemo(() => {
    if (!selectedDate || !professionalsForService.length) return [];

    if (isProfessionalFirst && fixedProfessional) {
      return obterHorariosDisponiveis(fixedProfessional.id, selectedDate);
    }

    const todosHorarios = gerarHorarios(
      barbearia.horario_abertura,
      barbearia.horario_fechamento,
      barbearia.intervalo_agendamento
    );

    return todosHorarios.filter((horario) =>
      professionalsForService.some((professional) => {
        if (ehDiaSemTrabalhoBarbeiro(professional.id, selectedDate)) {
          return false;
        }

        const horariosDoProfissional = obterHorariosDisponiveis(
          professional.id,
          selectedDate
        );

        return horariosDoProfissional.includes(horario);
      })
    );
  }, [fixedProfessional, isProfessionalFirst, selectedDate, professionalsForService]);

  const availableProfessionals = useMemo(() => {
    if (!selectedDate || !selectedTime) return [];

    if (isProfessionalFirst && fixedProfessional) {
      return [fixedProfessional];
    }

    return professionalsForService.filter((professional) => {
      if (ehDiaSemTrabalhoBarbeiro(professional.id, selectedDate)) {
        return false;
      }

      const horariosDoProfissional = obterHorariosDisponiveis(
        professional.id,
        selectedDate
      );

      return horariosDoProfissional.includes(selectedTime);
    });
  }, [fixedProfessional, isProfessionalFirst, selectedDate, selectedTime, professionalsForService]);

  const irParaMesAnterior = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
  };

  const irParaProximoMes = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
  };

  const selecionarData = (dia) => {
    const dataFormatada = formatarData(dia);
    const ehPassada = ehDataAnteriorHoje(dataFormatada);
    const indisponivelBarbearia = ehDataIndisponivel(dataFormatada);
    const semProfissional = !hasProfessionalsWorkingOnDate(dataFormatada);

    if (ehPassada || indisponivelBarbearia || semProfissional) {
      return;
    }

    setSelectedDate(dataFormatada);
    setSelectedTime(null);
    setSelectedProfessional(isProfessionalFirst ? fixedProfessional : null);
  };

  const voltarPage = () => {
    setDataSelecionada(null);
    setHoraSelecionada(null);
    if (!isProfessionalFirst) {
      setBarbeiroSelecionado(null);
    }
    navigation.goBack();
  };

  const continuarAgendamento = () => {
    const finalProfessional = isProfessionalFirst ? fixedProfessional : selectedProfessional;

    if (!selectedDate || !selectedTime || !finalProfessional) {
      return;
    }

    setDataSelecionada(selectedDate);
    setHoraSelecionada(selectedTime);
    setBarbeiroSelecionado(finalProfessional);

    navigation.navigate("Confirmation", {
      service,
      professional: finalProfessional,
      selectedDate,
      selectedDateLabel: formatarDataVisual(selectedDate),
      selectedTime,
      flowMode,
    });
  };

  const nomeMes = currentMonth.toLocaleString("pt-BR", {
    month: "long",
    year: "numeric",
  });

  const canContinue = isProfessionalFirst
    ? !!selectedDate && !!selectedTime && !!fixedProfessional
    : !!selectedDate && !!selectedTime && !!selectedProfessional;

  return (
    <SafeAreaView style={HorariosStyle.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={HorariosStyle.page}>
          <View style={HorariosStyle.header}>
            <Pressable onPress={voltarPage} style={HorariosStyle.headerButton}>
              <Text style={HorariosStyle.headerBack}>‹</Text>
            </Pressable>
            <Text style={HorariosStyle.headerTitle}>
              {isProfessionalFirst ? "Agenda do profissional" : "Agendar horário"}
            </Text>
            <View style={{ width: 32 }} />
          </View>

          <View style={HorariosStyle.progressContainer}>
            <View style={HorariosStyle.progressRow}>
              <View style={HorariosStyle.progressActive} />
              <View style={HorariosStyle.progressActive} />
              <View style={HorariosStyle.progressInactive} />
              <View style={HorariosStyle.progressInactive} />
              <Text style={HorariosStyle.progressText}>2/4</Text>
            </View>
          </View>

          <View style={HorariosStyle.summaryCard}>
            <Text style={HorariosStyle.summaryLabel}>
              {isProfessionalFirst ? "Profissional selecionado" : "Serviço selecionado"}
            </Text>
            <Text style={HorariosStyle.summaryTitle}>
              {isProfessionalFirst ? fixedProfessional?.name || "Profissional" : service?.name || "Serviço"}
            </Text>
            <Text style={HorariosStyle.summarySubtitle}>
              {isProfessionalFirst
                ? `${fixedProfessional?.specialty || "Especialista"}${fixedProfessional?.servicesOffered?.length ? ` • ${fixedProfessional.servicesOffered.join(" • ")}` : ""}`
                : `${formatPrice(service?.price || 0)} • duração média de ${service?.durationMinutes || 30} min`}
            </Text>
          </View>

          <View style={HorariosStyle.calendarContainer}>
            <Text style={HorariosStyle.sectionTitle}>1. Escolha a data</Text>

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
              {["DOM", "SEG", "TER", "QUA", "QUI", "SEX", "SÁB"].map((dia) => (
                <Text key={dia} style={HorariosStyle.weekDay}>
                  {dia}
                </Text>
              ))}
            </View>

            <View style={HorariosStyle.daysGrid}>
              {calendarDays.map((dia, index) => {
                if (dia === null) {
                  return <View key={`empty-${index}`} style={HorariosStyle.emptyDay} />;
                }

                const dataFormatada = formatarData(dia);
                const indisponivelBarbearia = ehDataIndisponivel(dataFormatada);
                const ehPassada = ehDataAnteriorHoje(dataFormatada);
                const semProfissionais = !hasProfessionalsWorkingOnDate(dataFormatada);
                const ehSelecionada = selectedDate === dataFormatada;
                const disabled = indisponivelBarbearia || ehPassada || semProfissionais;

                return (
                  <Pressable
                    key={dataFormatada}
                    onPress={() => selecionarData(dia)}
                    disabled={disabled}
                    style={[
                      HorariosStyle.dayBox,
                      ehSelecionada && HorariosStyle.daySelected,
                      ehPassada && HorariosStyle.dayPast,
                      indisponivelBarbearia && HorariosStyle.dayUnavailable,
                      semProfissionais && !ehPassada && HorariosStyle.dayNoProfessional,
                    ]}
                  >
                    <Text
                      style={[
                        HorariosStyle.dayText,
                        ehSelecionada && HorariosStyle.dayTextSelected,
                        ehPassada && HorariosStyle.dayTextPast,
                        indisponivelBarbearia && HorariosStyle.dayTextUnavailable,
                        semProfissionais && !ehPassada && HorariosStyle.dayTextNoProfessional,
                      ]}
                    >
                      {dia}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={HorariosStyle.horariosContainer}>
            <Text style={HorariosStyle.sectionTitle}>2. Escolha o horário</Text>
            {!selectedDate ? (
              <View style={HorariosStyle.helperCard}>
                <Text style={HorariosStyle.helperText}>
                  Selecione primeiro uma data para visualizar os horários disponíveis.
                </Text>
              </View>
            ) : availableTimes.length > 0 ? (
              <View style={HorariosStyle.horariosGrid}>
                {availableTimes.map((horario) => {
                  const ehSelecionado = selectedTime === horario;
                  return (
                    <Pressable
                      key={horario}
                      onPress={() => {
                        setSelectedTime(horario);
                        if (!isProfessionalFirst) {
                          setSelectedProfessional(null);
                        }
                      }}
                      style={[
                        HorariosStyle.horarioBox,
                        ehSelecionado && HorariosStyle.horarioBoxSelected,
                      ]}
                    >
                      <Text
                        style={[
                          HorariosStyle.horarioText,
                          ehSelecionado && HorariosStyle.horarioTextSelected,
                        ]}
                      >
                        {horario}
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            ) : (
              <View style={HorariosStyle.noHorariosBox}>
                <Text style={HorariosStyle.noHorariosText}>
                  Não há horários livres nesta data.
                </Text>
                <Text style={HorariosStyle.noHorariosSub}>
                  Escolha outra data para ver novas opções.
                </Text>
              </View>
            )}
          </View>

          <View style={HorariosStyle.professionalsContainer}>
            <Text style={HorariosStyle.sectionTitle}>
              {isProfessionalFirst ? "3. Profissional escolhido" : "3. Escolha o profissional disponível"}
            </Text>
            {!selectedTime ? (
              <View style={HorariosStyle.helperCard}>
                <Text style={HorariosStyle.helperText}>
                  {isProfessionalFirst
                    ? "Depois de escolher o horário, você verá o resumo do profissional selecionado."
                    : "Depois de escolher o horário, os barbeiros livres nesse momento aparecerão aqui."}
                </Text>
              </View>
            ) : availableProfessionals.length > 0 ? (
              availableProfessionals.map((professional) => {
                const selecionado =
                  (isProfessionalFirst ? fixedProfessional?.id : selectedProfessional?.id) === professional.id;
                return (
                  <Pressable
                    key={professional.id}
                    onPress={() => {
                      if (!isProfessionalFirst) {
                        setSelectedProfessional(professional);
                      }
                    }}
                    style={[
                      HorariosStyle.professionalCard,
                      selecionado && HorariosStyle.professionalCardSelected,
                    ]}
                  >
                    <View style={HorariosStyle.professionalRow}>
                      <Avatar
                        size={58}
                        name={professional.name}
                        photoUrl={professional.photoUrl}
                      />
                      <View style={HorariosStyle.professionalInfo}>
                        <Text style={HorariosStyle.professionalName}>{professional.name}</Text>
                        <Text style={HorariosStyle.professionalSpecialty}>
                          {professional.specialty}
                        </Text>
                        <Text style={HorariosStyle.professionalMeta}>
                          Nota {professional.rating.toFixed(1)} • disponível às {selectedTime}
                        </Text>
                        {isProfessionalFirst && professional.servicesOffered?.length ? (
                          <Text style={HorariosStyle.professionalServicesText}>
                            Serviços: {professional.servicesOffered.join(", ")}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                  </Pressable>
                );
              })
            ) : (
              <View style={HorariosStyle.noHorariosBox}>
                <Text style={HorariosStyle.noHorariosText}>
                  Nenhum barbeiro está livre neste horário.
                </Text>
                <Text style={HorariosStyle.noHorariosSub}>
                  Escolha outro horário para continuar.
                </Text>
              </View>
            )}
          </View>

          {selectedDate && selectedTime && (isProfessionalFirst ? fixedProfessional : selectedProfessional) ? (
            <View style={HorariosStyle.resumoBox}>
              <Text style={HorariosStyle.resumoLabel}>Resumo da seleção</Text>
              <Text style={HorariosStyle.resumoData}>{formatarDataVisual(selectedDate)}</Text>
              <Text style={HorariosStyle.resumoHora}>{selectedTime}</Text>
              <Text style={HorariosStyle.resumoProfissional}>
                {(isProfessionalFirst ? fixedProfessional : selectedProfessional)?.name}
              </Text>
            </View>
          ) : null}

          <View style={HorariosStyle.nextContainer}>
            <Pressable
              onPress={continuarAgendamento}
              disabled={!canContinue}
              style={[
                HorariosStyle.nextButton,
                !canContinue && HorariosStyle.nextButtonDisabled,
              ]}
            >
              <Text style={HorariosStyle.nextButtonText}>Continuar</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
