import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
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

const API_BASE_URL = "http://SEU_IP_OU_DOMINIO:3000";
import { EXAMPLE_DATA } from "../assets/dados/barbeiros";

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

function buildPageData(apiData) {
  return {
    shop: normalizeShop(apiData?.shop),
    upcomingAppointments: Array.isArray(apiData?.upcomingAppointments) && apiData.upcomingAppointments.length > 0
      ? apiData.upcomingAppointments
      : EXAMPLE_DATA.upcomingAppointments,
    popularServices: Array.isArray(apiData?.popularServices) && apiData.popularServices.length > 0
      ? apiData.popularServices
      : EXAMPLE_DATA.popularServices,
  };
}

export default function AgendamentoPage({ navigation }) {
  const { servicoSelecionado, setServicoSelecionado } = useContext(AppContext);
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const serviceCardWidth = isTablet
    ? (width - 20 * 2 - 12) / 2
    : width - 20 * 2;

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
    console.log("Serviço selecionado para agendamento:", service);
    setServicoSelecionado(service);
    navigation.navigate("ProfissionalSelecao");
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
          <Image source={{ uri: service.image }} style={AgendamentoStyle.serviceImage} />
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
            <Text style={AgendamentoStyle.scheduleButtonText}>
              Agendar
            </Text>
          </TouchableOpacity>
        </View>
      </View>
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
      >
        <View style={[AgendamentoStyle.header, { backgroundColor: pageData.shop.primaryColor || "#1E40AF" }]}>
          <View style={AgendamentoStyle.headerRow}>
            {pageData.shop.logoUrl ? (
              <Image source={{ uri: pageData.shop.logoUrl }} style={AgendamentoStyle.headerLogoImage} />
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
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

