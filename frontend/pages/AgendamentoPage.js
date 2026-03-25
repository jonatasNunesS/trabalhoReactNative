import React, { useCallback, useEffect, useState } from "react";
import { SafeAreaView } from 'react-native-safe-area-context';
import {
  ActivityIndicator,
  Dimensions,
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

import { Card } from "react-native-paper";
import CardAgendamento from "../components/cardAgendamentos";

import { getInitials, formatPrice } from "../utils/utilidades";

const HORIZONTAL_PADDING = 20;
const GRID_GAP = 12;

// Troque pela URL real da sua API
const API_BASE_URL = "http://SEU_IP_OU_DOMINIO:3000";

/**
 * DADOS DE EXEMPLO
 * Serão usados quando:
 * - a API retornar arrays vazios
 * - algum campo vier vazio/null
 * - a API falhar
 */
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
    {
      id: "example-service-3",
      name: "Corte + Barba",
      price: 80,
      image:
        "https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=800&q=80",
      availableBarbers: [
        { id: "b1", name: "Carlos Mendes" },
        { id: "b3", name: "Rafael Costa" },
      ],
    },
    {
      id: "example-service-4",
      name: "Sobrancelha",
      price: 30,
      image:
        "https://images.unsplash.com/photo-1512690459411-b0fd1c86b8b8?auto=format&fit=crop&w=800&q=80",
      availableBarbers: [{ id: "b4", name: "Lucas Ferreira" }],
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

function normalizeAppointment(item, index) {
  const example =
    EXAMPLE_DATA.upcomingAppointments[
      index % EXAMPLE_DATA.upcomingAppointments.length
    ];

  return {
    id: item?.id ?? example.id,
    barberName: isFilledString(item?.barberName)
      ? item.barberName
      : example.barberName,
    barberAvatar: isFilledString(item?.barberAvatar)
      ? item.barberAvatar
      : example.barberAvatar,
    serviceName: isFilledString(item?.serviceName)
      ? item.serviceName
      : example.serviceName,
    dateTime: isFilledString(item?.dateTime) ? item.dateTime : example.dateTime,
  };
}

function normalizeService(item, index) {
  const example =
    EXAMPLE_DATA.popularServices[index % EXAMPLE_DATA.popularServices.length];

  const validPrice =
    typeof item?.price === "number" && !Number.isNaN(item.price)
      ? item.price
      : example.price;

  const availableBarbers =
    Array.isArray(item?.availableBarbers) && item.availableBarbers.length > 0
      ? item.availableBarbers.map((barber, barberIndex) => {
          const exampleBarber =
            example.availableBarbers[
              barberIndex % example.availableBarbers.length
            ] || example.availableBarbers[0];

          return {
            id: barber?.id ?? exampleBarber.id,
            name: isFilledString(barber?.name)
              ? barber.name
              : exampleBarber.name,
          };
        })
      : example.availableBarbers;

  return {
    id: item?.id ?? example.id,
    name: isFilledString(item?.name) ? item.name : example.name,
    price: validPrice,
    image: isFilledString(item?.image) ? item.image : example.image,
    availableBarbers,
  };
}

function buildPageData(apiData) {
  const rawAppointments = Array.isArray(apiData?.upcomingAppointments)
    ? apiData.upcomingAppointments
    : [];

  const rawServices = Array.isArray(apiData?.popularServices)
    ? apiData.popularServices
    : [];

  const normalizedAppointments =
    rawAppointments.length > 0
      ? rawAppointments.map((item, index) => normalizeAppointment(item, index))
      : EXAMPLE_DATA.upcomingAppointments.map((item, index) =>
          normalizeAppointment(item, index),
        );

  const normalizedServices =
    rawServices.length > 0
      ? rawServices.map((item, index) => normalizeService(item, index))
      : EXAMPLE_DATA.popularServices.map((item, index) =>
          normalizeService(item, index),
        );

  return {
    shop: normalizeShop(apiData?.shop),
    upcomingAppointments: normalizedAppointments,
    popularServices: normalizedServices,
  };
}

export default function AgendamentoPage({ navigation }) {
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

      if (!response.ok) {
        throw new Error("Falha ao buscar dados da página");
      }
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
    if (navigation?.navigate) {
      navigation.navigate("AppointmentDetails", {
        appointmentId: appointment.id,
      });
    }
  };

  const handleScheduleService = (service) => {
    if (navigation?.navigate) {
      navigation.navigate("CreateAppointment", {
        serviceId: service.id,
      });
    }
  };

  const renderHeaderLogo = () => {
    if (pageData.shop.logoUrl) {
      return (
        <Image
          source={{ uri: pageData.shop.logoUrl }}
          style={styles.headerLogoImage}
          resizeMode="cover"
        />
      );
    }

    return <View style={styles.headerLogoFallback} />;
  };


  const renderServiceCard = (service) => {
    const barberNames = Array.isArray(service.availableBarbers)
      ? service.availableBarbers.map((barber) => barber.name).join(", ")
      : "";

    return (
      <View
        key={service.id}
        style={[
          styles.serviceCard,
          {
            width: serviceCardWidth,
            marginRight: isTablet ? 0 : 0,
          },
        ]}
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
      
        contentContainerStyle={{paddingBottom: 30 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={true}
        alwaysBounceVertical={true} 
      >
        <View
          style={[
            styles.header,
            { backgroundColor: pageData.shop.primaryColor || "#1E40AF" },
          ]}
        >
          <View style={styles.headerRow}>
            {renderHeaderLogo()}
            <Text style={styles.headerTitle} numberOfLines={2}>
              {pageData.shop.name}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <Text style={styles.sectionTitle}>Próximos Agendamentos</Text>

          <View style={styles.cardAgendamentoContain}>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 10 }}
            >
              {pageData.upcomingAppointments.length > 0 ? (
                pageData.upcomingAppointments.map((appointment) => (
                  <CardAgendamento
                    key={appointment.id}
                    appointment={appointment}
                    onViewDetails={() => handleViewDetails(appointment)}
                  />
                ))
              ) : (
                <Text style={{ color: "#6B7280", textAlign: "center", marginTop: 20 }}>
                  Nenhum agendamento encontrado.
                </Text>
              )}
            </ScrollView>
          </View>


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
