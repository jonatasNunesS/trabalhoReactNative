import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Avatar from "../components/Avatar";
import BrandFooter from "../components/BrandFooter";
import { developerBrand } from "../data/exampleData";
import { getSchedulingPageData } from "../services/api";
import { formatDateTime, formatPrice, getInitials, isFilledString } from "../utils/formatters";

const INITIAL_STATE = {
  shop: {
    name: "Barbearia Premium",
    logoUrl: "",
    primaryColor: "#1E40AF",
    accentColor: "#22B8B0",
  },
  upcomingAppointments: [],
  popularServices: [],
};

export default function HomePage({ navigation }) {
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageData, setPageData] = useState(INITIAL_STATE);

  const loadHomeData = useCallback(async () => {
    try {
      const data = await getSchedulingPageData();
      setPageData({
        shop: {
          name: isFilledString(data?.shop?.name) ? data.shop.name : INITIAL_STATE.shop.name,
          logoUrl: isFilledString(data?.shop?.logoUrl) ? data.shop.logoUrl : "",
          primaryColor: isFilledString(data?.shop?.primaryColor)
            ? data.shop.primaryColor
            : INITIAL_STATE.shop.primaryColor,
          accentColor: isFilledString(data?.shop?.accentColor)
            ? data.shop.accentColor
            : INITIAL_STATE.shop.accentColor,
        },
        upcomingAppointments: Array.isArray(data?.upcomingAppointments)
          ? data.upcomingAppointments
          : [],
        popularServices: Array.isArray(data?.popularServices)
          ? data.popularServices
          : [],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadHomeData();
  }, [loadHomeData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadHomeData();
  };

  const nextAppointment = pageData.upcomingAppointments[0] || null;

  const stats = useMemo(() => {
    const professionals = new Set(
      pageData.popularServices.flatMap((service) =>
        Array.isArray(service.availableBarbers)
          ? service.availableBarbers.map((barber) => barber.name)
          : []
      )
    );

    return [
      { label: "Serviços", value: pageData.popularServices.length },
      { label: "Profissionais", value: professionals.size },
      { label: "Agenda", value: nextAppointment ? "1" : "0" },
    ];
  }, [nextAppointment, pageData.popularServices]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />
        <ActivityIndicator size="large" color="#1E40AF" />
        <Text style={styles.loadingText}>Preparando sua agenda...</Text>
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
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View
          style={[
            styles.hero,
            { backgroundColor: pageData.shop.primaryColor || "#1E40AF" },
          ]}
        >
          <View style={styles.heroBrandRow}>
            {pageData.shop.logoUrl ? (
              <Avatar size={58} name={pageData.shop.name} photoUrl={pageData.shop.logoUrl} />
            ) : (
              <View style={styles.logoFallback}>
                <Text style={styles.logoFallbackText}>{getInitials(pageData.shop.name)}</Text>
              </View>
            )}

            <View style={styles.heroTextWrap}>
              <Text style={styles.heroEyebrow}>Painel do cliente</Text>
              <Text style={styles.heroTitle} numberOfLines={2}>
                {pageData.shop.name}
              </Text>
              <Text style={styles.heroSubtitle}>
                Agende com poucos toques e acompanhe seus próximos horários.
              </Text>
            </View>
          </View>

          <TouchableOpacity
            style={styles.heroButton}
            activeOpacity={0.88}
            onPress={() => navigation.navigate("Agendar")}
          >
            <Text style={styles.heroButtonText}>Novo agendamento</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          <View style={styles.statsRow}>
            {stats.map((item) => (
              <View key={item.label} style={styles.statCard}>
                <Text style={styles.statValue}>{item.value}</Text>
                <Text style={styles.statLabel}>{item.label}</Text>
              </View>
            ))}
          </View>

          <Text style={styles.eyebrow}>Visão geral</Text>
          <Text style={styles.sectionTitle}>Próximo compromisso</Text>

          {nextAppointment ? (
            <View
              style={[
                styles.nextAppointmentCard,
                { borderColor: pageData.shop.accentColor || "#22B8B0" },
              ]}
            >
              <View style={styles.nextAppointmentHeader}>
                <Avatar
                  size={58}
                  name={nextAppointment.barberName}
                  photoUrl={nextAppointment.barberAvatar}
                />
                <View style={styles.nextAppointmentInfo}>
                  <Text style={styles.nextAppointmentTitle}>{nextAppointment.serviceName}</Text>
                  <Text style={styles.nextAppointmentSubtitle}>{nextAppointment.barberName}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>{nextAppointment.status || "Confirmado"}</Text>
                </View>
              </View>
              <Text style={styles.nextAppointmentDate}>{formatDateTime(nextAppointment.dateTime)}</Text>
            </View>
          ) : (
            <View style={styles.emptyCard}>
              <Text style={styles.emptyTitle}>Nenhum horário reservado</Text>
              <Text style={styles.emptyText}>
                Inicie um novo agendamento para escolher serviço, data, horário e profissional.
              </Text>
            </View>
          )}

          <Text style={styles.eyebrow}>Acesso rápido</Text>
          <Text style={styles.sectionTitle}>Serviços em destaque</Text>
          <View style={styles.highlightList}>
            {pageData.popularServices.slice(0, 3).map((service) => (
              <TouchableOpacity
                key={service.id}
                style={styles.highlightCard}
                activeOpacity={0.86}
                onPress={() => navigation.navigate("Agendar")}
              >
                <View style={styles.highlightBadge}>
                  <Text style={styles.highlightBadgeText}>{getInitials(service.name)}</Text>
                </View>
                <View style={styles.highlightInfo}>
                  <Text style={styles.highlightTitle}>{service.name}</Text>
                  <Text style={styles.highlightMeta}>{formatPrice(service.price || 0)}</Text>
                </View>
                <Text style={styles.highlightAction}>Agendar</Text>
              </TouchableOpacity>
            ))}
          </View>

          <BrandFooter brandName={developerBrand.name} tagline={developerBrand.tagline} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8FAFC",
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: "#F8FAFC",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 16,
    color: "#475569",
    fontWeight: "600",
  },
  scrollContent: {
    paddingBottom: 40,
  },
  hero: {
    paddingHorizontal: 20,
    paddingTop: 22,
    paddingBottom: 22,
    borderBottomLeftRadius: 28,
    borderBottomRightRadius: 28,
  },
  heroBrandRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 18,
  },
  logoFallback: {
    width: 58,
    height: 58,
    borderRadius: 18,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.4)",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 14,
  },
  logoFallbackText: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 18,
  },
  heroTextWrap: {
    flex: 1,
  },
  heroEyebrow: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 11,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  heroTitle: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "800",
  },
  heroSubtitle: {
    color: "rgba(255,255,255,0.88)",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 4,
  },
  heroButton: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    paddingVertical: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  heroButtonText: {
    color: "#1E40AF",
    fontSize: 16,
    fontWeight: "800",
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  statsRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 22,
  },
  statCard: {
    flex: 1,
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
    shadowColor: "#000000",
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 3 },
    elevation: 2,
  },
  statValue: {
    color: "#1E40AF",
    fontSize: 24,
    fontWeight: "800",
    marginBottom: 4,
  },
  statLabel: {
    color: "#64748B",
    fontSize: 13,
    fontWeight: "600",
  },
  eyebrow: {
    color: "#64748B",
    fontSize: 12,
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 6,
  },
  sectionTitle: {
    color: "#0F172A",
    fontSize: 22,
    fontWeight: "800",
    marginBottom: 14,
  },
  nextAppointmentCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 1.5,
    borderRadius: 20,
    padding: 16,
    marginBottom: 22,
  },
  nextAppointmentHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  nextAppointmentInfo: {
    flex: 1,
    marginLeft: 12,
  },
  nextAppointmentTitle: {
    fontSize: 18,
    fontWeight: "800",
    color: "#0F172A",
  },
  nextAppointmentSubtitle: {
    fontSize: 14,
    color: "#64748B",
    marginTop: 4,
  },
  statusBadge: {
    backgroundColor: "#D1FAE5",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  statusBadgeText: {
    color: "#0F766E",
    fontSize: 12,
    fontWeight: "800",
  },
  nextAppointmentDate: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: "800",
    color: "#1E40AF",
  },
  emptyCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 18,
    marginBottom: 22,
  },
  emptyTitle: {
    color: "#0F172A",
    fontSize: 18,
    fontWeight: "800",
  },
  emptyText: {
    color: "#64748B",
    fontSize: 14,
    lineHeight: 20,
    marginTop: 6,
  },
  highlightList: {
    gap: 12,
  },
  highlightCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
    borderRadius: 18,
    padding: 16,
  },
  highlightBadge: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#E0E7FF",
    marginRight: 12,
  },
  highlightBadgeText: {
    color: "#1E40AF",
    fontWeight: "800",
  },
  highlightInfo: {
    flex: 1,
  },
  highlightTitle: {
    color: "#0F172A",
    fontSize: 16,
    fontWeight: "700",
  },
  highlightMeta: {
    color: "#64748B",
    fontSize: 14,
    marginTop: 4,
  },
  highlightAction: {
    color: "#1E40AF",
    fontSize: 15,
    fontWeight: "800",
  },
});
