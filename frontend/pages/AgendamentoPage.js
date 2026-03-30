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

const HORIZONTAL_PADDING = 20;
const GRID_GAP = 12;
const API_BASE_URL = "http://SEU_IP_OU_DOMINIO:3000";

const EXAMPLE_DATA = {
  shop: {
    name: "Barbearia Premium",
    logoUrl: "",
    primaryColor: "#1E40AF",
  },
  upcomingAppointments: [
    {
      id: "example-appointment-1",
      barberName: "Carlos Mendes",
      barberAvatar: "https://randomuser.me/api/portraits/men/32.jpg",
      serviceName: "Corte de Cabelo",
      dateTime: "2026-03-25T14:00:00",
    },
    {
      id: "example-appointment-2",
      barberName: "João Silva",
      barberAvatar: "https://randomuser.me/api/portraits/men/45.jpg",
      serviceName: "Barba Completa",
      dateTime: "2026-03-25T15:30:00",
    },
  ],
  popularServices: [
    {
      id: "example-service-1",
      name: "Corte de Cabelo",
      price: 50,
      image:
        "https://images.unsplash.com/photo-1622286342621-4bd786c2447c?auto=format&fit=crop&w=800&q=80",
      availableBarbers: [
        { id: "b1", name: "Carlos Mendes" },
        { id: "b2", name: "João Silva" },
      ],
    },
    {
      id: "example-service-2",
      name: "Barba Completa",
      price: 40,
      image:
        "https://images.unsplash.com/photo-1517832606299-7ae9b720a186?auto=format&fit=crop&w=800&q=80",
      availableBarbers: [
        { id: "b2", name: "João Silva" },
        { id: "b3", name: "Rafael Costa" },
      ],
    },
  ],
};

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

export default function AgendamentoPage({ navigation, setServicoSelecionado }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const serviceCardWidth = isTablet
    ? (width - HORIZONTAL_PADDING * 2 - GRID_GAP) / 2
    : width - HORIZONTAL_PADDING * 2;

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
    navigation.navigate("AppointmentDetails", { appointmentId: appointment.id });
  };

  const handleScheduleService = (service) => {
    setServicoSelecionado(service);
    navigation.navigate("Horarios");
  };

  const renderServiceCard = (service) => {
    const barberNames = Array.isArray(service.availableBarbers)
      ? service.availableBarbers.map((barber) => barber.name).join(", ")
      : "";

    return (
      <View
        key={service.id}
        style={[styles.serviceCard, { width: serviceCardWidth }]}
      >
        {service.image ? (
          <Image source={{ uri: service.image }} style={styles.serviceImage} />
        ) : (
          <View style={styles.serviceImageFallback}>
            <Text style={styles.serviceImageFallbackText}>
              {getInitials(service.name)}
            </Text>
          </View>
        )}

        <View style={styles.serviceContent}>
          <Text style={styles.serviceTitle} numberOfLines={2}>
            {service.name}
          </Text>
          <Text style={styles.servicePrice}>{formatPrice(service.price)}</Text>
          {!!barberNames && (
            <Text style={styles.availableBarbersText} numberOfLines={2}>
              Barbeiros: {barberNames}
            </Text>
          )}
          <TouchableOpacity
            style={styles.scheduleButton}
            activeOpacity={0.85}
            onPress={() => handleScheduleService(service)}
          >
            <Text style={styles.scheduleButtonText}>Agendar</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
        <ActivityIndicator size="large" color="#1E40AF" />
        <Text style={styles.loadingText}>Carregando agendamentos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
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
        <View style={[styles.header, { backgroundColor: pageData.shop.primaryColor || "#1E40AF" }]}>
          <View style={styles.headerRow}>
            {pageData.shop.logoUrl ? (
              <Image source={{ uri: pageData.shop.logoUrl }} style={styles.headerLogoImage} />
            ) : (
              <View style={styles.headerLogoFallback} />
            )}
            <Text style={styles.headerTitle} numberOfLines={2}>
              {pageData.shop.name}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Próximos Agendamentos</Text>
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

          <View style={styles.sectionDivider} />
          <Text style={styles.sectionTitle}>Serviços Populares</Text>
          <View style={styles.servicesGrid}>
            {pageData.popularServices.map(renderServiceCard)}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F3F4F6",
  },

  loadingContainer: {
    flex: 1,
    backgroundColor: "#F3F4F6",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },

  loadingText: {
    marginTop: 14,
    fontSize: 16,
    color: "#374151",
    fontWeight: "500",
  },

  scrollContent: {
     flexGrow: 1,
  paddingBottom: 30,
  },

  header: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 18,
    paddingBottom: 18,
  },

  headerRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  headerLogoImage: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: "#FFFFFF",
    marginRight: 14,
  },

  headerLogoFallback: {
    width: 52,
    height: 52,
    borderWidth: 3,
    borderColor: "#FFFFFF",
    borderRadius: 10,
    marginRight: 14,
  },

  headerTitle: {
    flex: 1,
    fontSize: 28,
    fontWeight: "800",
    color: "#FFFFFF",
  },

  content: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 22,
  },
  cardAgendamentoContain: {
    width: "100%",

  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 16,
  },

  sectionDivider: {
    height: 1,
    backgroundColor: "#D1D5DB",
    marginVertical: 18,
  },

  servicesGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },

  serviceCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 16,
    overflow: "hidden",
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },

  serviceImage: {
    width: "100%",
    height: 170,
    backgroundColor: "#E5E7EB",
  },

  serviceImageFallback: {
    width: "100%",
    height: 170,
    backgroundColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },

  serviceContent: {
    padding: 14,
  },

  serviceTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 10,
  },

  servicePrice: {
    fontSize: 16,
    fontWeight: "800",
    color: "#1E40AF",
    marginBottom: 8,
  },

  availableBarbersText: {
    fontSize: 12,
    color: "#6B7280",
    lineHeight: 18,
    marginBottom: 14,
  },

  scheduleButton: {
    backgroundColor: "#1E40AF",
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },

  scheduleButtonText: {
    color: "#FFFFFF",
    fontSize: 15,
    fontWeight: "800",
  },
});
