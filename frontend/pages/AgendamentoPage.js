import React, { useCallback, useEffect, useMemo, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from "react-native";
import CardAgendamento from "../components/cardAgendamentos";
import { getInitials, formatPrice } from "../utils/utilidades";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import AgendamentoStyle from "../assets/styles/AgendamentoPage";
import { EXAMPLE_DATA } from "../assets/dados/barbeiros";

const API_BASE_URL = "http://SEU_IP_OU_DOMINIO:3000";

function isFilledString(value) {
  return typeof value === "string" && value.trim().length > 0;
}

function normalizeShop(shop) {
  return {
    name: isFilledString(shop?.name) ? shop.name : EXAMPLE_DATA.shop.name,
    logoUrl: isFilledString(shop?.logoUrl)
      ? shop.logoUrl
      : EXAMPLE_DATA.shop.logoUrl,
    primaryColor: isFilledString(shop?.primaryColor)
      ? shop.primaryColor
      : EXAMPLE_DATA.shop.primaryColor,
  };
}

function normalizeBarber(barber, exampleBarber, index) {
  return {
    id: barber?.id ?? exampleBarber?.id ?? index + 1,
    name: isFilledString(barber?.name)
      ? barber.name
      : exampleBarber?.name || "Profissional",
    specialty: isFilledString(barber?.specialty)
      ? barber.specialty
      : exampleBarber?.specialty || "Especialista",
    rating:
      typeof barber?.rating === "number"
        ? barber.rating
        : exampleBarber?.rating || 4.8,
    photoUrl: isFilledString(barber?.photoUrl)
      ? barber.photoUrl
      : exampleBarber?.photoUrl || "",
  };
}

function normalizeService(service, index) {
  const example =
    EXAMPLE_DATA.popularServices[
      index % EXAMPLE_DATA.popularServices.length
    ];

  const rawBarbers = Array.isArray(service?.availableBarbers)
    ? service.availableBarbers
    : [];

  const availableBarbers =
    rawBarbers.length > 0
      ? rawBarbers.map((barber, barberIndex) =>
          normalizeBarber(
            barber,
            example?.availableBarbers?.[
              barberIndex % example.availableBarbers.length
            ],
            barberIndex
          )
        )
      : example.availableBarbers.map((barber, barberIndex) =>
          normalizeBarber(barber, barber, barberIndex)
        );

  return {
    id: service?.id ?? example.id,
    name: isFilledString(service?.name) ? service.name : example.name,
    price:
      typeof service?.price === "number" && !Number.isNaN(service.price)
        ? service.price
        : example.price,
    image: isFilledString(service?.image) ? service.image : example.image,
    durationMinutes:
      typeof service?.durationMinutes === "number" && !Number.isNaN(service.durationMinutes)
        ? service.durationMinutes
        : example.durationMinutes || 30,
    availableBarbers,
  };
}

function buildPageData(apiData) {
  const rawServices = Array.isArray(apiData?.popularServices)
    ? apiData.popularServices
    : [];

  return {
    shop: normalizeShop(apiData?.shop),
    upcomingAppointments:
      Array.isArray(apiData?.upcomingAppointments) &&
      apiData.upcomingAppointments.length > 0
        ? apiData.upcomingAppointments
        : EXAMPLE_DATA.upcomingAppointments,
    popularServices:
      rawServices.length > 0
        ? rawServices.map((service, index) => normalizeService(service, index))
        : EXAMPLE_DATA.popularServices.map((service, index) =>
            normalizeService(service, index)
          ),
  };
}

export default function AgendamentoPage({ navigation }) {
  const {
    setServicoSelecionado,
    setBarbeiroSelecionado,
    setDataSelecionada,
    setHoraSelecionada,
  } = useContext(AppContext);

  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const serviceCardWidth = isTablet ? (width - 20 * 2 - 12) / 2 : width - 20 * 2;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageData, setPageData] = useState(buildPageData({}));

  const fetchAgendamentoData = useCallback(async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/Agendamento-page`);
      if (!response.ok) throw new Error("Falha ao buscar dados da página");
      const data = await response.json();
      setPageData(buildPageData(data));
    } catch (error) {
      console.warn("Erro ao buscar dados. Usando dados de exemplo.", error);
      setPageData(buildPageData({}));
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchAgendamentoData();
  }, [fetchAgendamentoData]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchAgendamentoData();
  };

  const handleViewDetails = (appointment) => {
    console.log("Ver detalhes do agendamento:", appointment);
  };

  const handleScheduleService = (service) => {
    setServicoSelecionado(service);
    setBarbeiroSelecionado(null);
    setDataSelecionada(null);
    setHoraSelecionada(null);
    navigation.navigate("Horarios", { service, flowMode: "service-first" });
  };

  const professionalOptions = useMemo(() => {
    const grouped = new Map();

    pageData.popularServices.forEach((service) => {
      const availableBarbers = Array.isArray(service.availableBarbers)
        ? service.availableBarbers
        : [];

      availableBarbers.forEach((barber) => {
        const key = String(barber.id ?? barber.name);
        const current = grouped.get(key) || {
          id: barber.id ?? key,
          name: barber.name || "Profissional",
          specialty: barber.specialty || "Especialista",
          rating: typeof barber.rating === "number" ? barber.rating : 4.8,
          photoUrl: barber.photoUrl || "",
          servicesOffered: [],
        };

        if (!current.servicesOffered.includes(service.name)) {
          current.servicesOffered.push(service.name);
        }

        grouped.set(key, current);
      });
    });

    return Array.from(grouped.values()).sort((a, b) => {
      if (b.rating !== a.rating) {
        return b.rating - a.rating;
      }
      return a.name.localeCompare(b.name);
    });
  }, [pageData.popularServices]);

  const handleScheduleByProfessional = (professional) => {
    setServicoSelecionado(null);
    setBarbeiroSelecionado(professional);
    setDataSelecionada(null);
    setHoraSelecionada(null);
    navigation.navigate("Horarios", {
      professional,
      flowMode: "professional-first",
    });
  };

  const renderServiceCard = (service) => {
    const barberNames = Array.isArray(service.availableBarbers)
      ? service.availableBarbers.map((barber) => barber.name).join(", ")
      : "";

    return (
      <View
        key={service.id}
        style={[AgendamentoStyle.serviceCard, { width: serviceCardWidth }]}
      >
        {service.image ? (
          <Image
            source={{ uri: service.image }}
            style={AgendamentoStyle.serviceImage}
            resizeMode="cover"
          />
        ) : (
          <View style={AgendamentoStyle.serviceImageFallback}>
            <Text style={AgendamentoStyle.serviceImageFallbackText}>
              {getInitials(service.name)}
            </Text>
          </View>
        )}

        <View style={AgendamentoStyle.serviceContent}>
          <Text style={AgendamentoStyle.serviceTitle} numberOfLines={2}>
            {service.name}
          </Text>
          <Text style={AgendamentoStyle.servicePrice}>{formatPrice(service.price)}</Text>
          {!!barberNames && (
            <Text style={AgendamentoStyle.availableBarbersText} numberOfLines={2}>
              Barbeiros: {barberNames}
            </Text>
          )}
          <TouchableOpacity
            style={AgendamentoStyle.scheduleButton}
            activeOpacity={0.85}
            onPress={() => handleScheduleService(service)}
          >
            <Text style={AgendamentoStyle.scheduleButtonText}>Agendar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const renderProfessionalCard = ({ item: professional }) => {
    const servicesPreview = professional.servicesOffered.slice(0, 2).join(" • ");
    const moreCount = professional.servicesOffered.length - 2;
    const extraLabel = moreCount > 0 ? ` +${moreCount}` : "";

    return (
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => handleScheduleByProfessional(professional)}
        style={AgendamentoStyle.professionalOptionCard}
      >
        <View style={AgendamentoStyle.professionalOptionTop}>
          {professional.photoUrl ? (
            <Image
              source={{ uri: professional.photoUrl }}
              style={AgendamentoStyle.professionalOptionPhoto}
              resizeMode="cover"
            />
          ) : (
            <View style={AgendamentoStyle.professionalOptionPhotoFallback}>
              <Text style={AgendamentoStyle.professionalOptionPhotoFallbackText}>
                {getInitials(professional.name)}
              </Text>
            </View>
          )}

          <View style={AgendamentoStyle.professionalOptionInfo}>
            <Text style={AgendamentoStyle.professionalOptionName} numberOfLines={1}>
              {professional.name}
            </Text>
            <Text style={AgendamentoStyle.professionalOptionSpecialty} numberOfLines={2}>
              {professional.specialty}
            </Text>
            <Text style={AgendamentoStyle.professionalOptionRating}>
              Nota {professional.rating.toFixed(1)}
            </Text>
          </View>
        </View>

        <View style={AgendamentoStyle.professionalChipRow}>
          <View style={AgendamentoStyle.professionalChip}>
            <Text style={AgendamentoStyle.professionalChipText} numberOfLines={1}>
              {servicesPreview}
              {extraLabel}
            </Text>
          </View>
        </View>

        <TouchableOpacity
          style={AgendamentoStyle.professionalOptionButton}
          activeOpacity={0.85}
          onPress={() => handleScheduleByProfessional(professional)}
        >
          <Text style={AgendamentoStyle.professionalOptionButtonText}>Ver agenda</Text>
        </TouchableOpacity>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={AgendamentoStyle.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
        <ActivityIndicator size="large" color="#1E40AF" />
        <Text style={AgendamentoStyle.loadingText}>Carregando agendamentos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={AgendamentoStyle.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={pageData.shop.primaryColor || "#1E40AF"}
      />
      <ScrollView
        contentContainerStyle={{ paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            AgendamentoStyle.header,
            { backgroundColor: pageData.shop.primaryColor || "#1E40AF" },
          ]}
        >
          <View style={AgendamentoStyle.headerRow}>
            {pageData.shop.logoUrl ? (
              <Image
                source={{ uri: pageData.shop.logoUrl }}
                style={AgendamentoStyle.headerLogoImage}
              />
            ) : (
              <View style={AgendamentoStyle.headerLogoFallback} />
            )}
            <Text style={AgendamentoStyle.headerTitle} numberOfLines={2}>
              {pageData.shop.name}
            </Text>
          </View>
        </View>

        <View style={AgendamentoStyle.content}>
          <Text style={AgendamentoStyle.sectionTitle}>Próximos Agendamentos</Text>
          <FlatList
            data={pageData.upcomingAppointments}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ paddingHorizontal: 10 }}
            renderItem={({ item }) => (
              <CardAgendamento
                appointment={item}
                onViewDetails={() => handleViewDetails(item)}
              />
            )}
            ListEmptyComponent={
              <Text style={{ color: "#6B7280", textAlign: "center", marginTop: 20 }}>
                Nenhum agendamento encontrado.
              </Text>
            }
          />

          <View style={AgendamentoStyle.sectionDivider} />
          <Text style={AgendamentoStyle.sectionTitle}>Serviços Populares</Text>
          <View style={AgendamentoStyle.servicesGrid}>
            {pageData.popularServices.map(renderServiceCard)}
          </View>

          <View style={AgendamentoStyle.sectionDivider} />
          <Text style={AgendamentoStyle.sectionSubtitle}>Outra forma de agendar</Text>
          <Text style={AgendamentoStyle.sectionTitle}>Escolha o profissional</Text>
          <Text style={AgendamentoStyle.sectionDescription}>
            Prefere escolher quem vai te atender primeiro? Abra a agenda do profissional e veja as datas e horários livres.
          </Text>

          <FlatList
            data={professionalOptions}
            keyExtractor={(item) => String(item.id)}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={AgendamentoStyle.professionalListContent}
            renderItem={renderProfessionalCard}
            ListEmptyComponent={
              <Text style={{ color: "#6B7280", marginTop: 8 }}>
                Nenhum profissional disponível no momento.
              </Text>
            }
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
