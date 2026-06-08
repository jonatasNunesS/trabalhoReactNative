import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Avatar from '../components/Avatar';
import BrandFooter from '../components/BrandFooter';
import { developerBrand } from '../data/exampleData';
import { getSchedulingPageData } from '../services/api';
import { formatDateTime, formatPrice, getInitials, isFilledString } from '../utils/formatters';
import { useAppTheme } from '../context/AppContext';

const INITIAL_STATE = {
  shop: {
    name: 'Barbearia Reis',
    logoUrl: '',
    primaryColor: '#1E40AF',
    accentColor: '#22B8B0',
  },
  upcomingAppointments: [],
  popularServices: [],
};

export default function HomePage({ navigation }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageData, setPageData] = useState(INITIAL_STATE);

  const loadHomeData = useCallback(async () => {
    try {
      const data = await getSchedulingPageData();
      setPageData({
        shop: {
          name: isFilledString(data?.shop?.name) ? data.shop.name : INITIAL_STATE.shop.name,
          logoUrl: isFilledString(data?.shop?.logoUrl) ? data.shop.logoUrl : '',
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
        popularServices: Array.isArray(data?.popularServices) ? data.popularServices : [],
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
      { label: 'Serviços', value: pageData.popularServices.length },
      { label: 'Profissionais', value: professionals.size },
      { label: 'Agenda', value: nextAppointment ? '1' : '0' },
    ];
  }, [nextAppointment, pageData.popularServices]);

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />
        <ActivityIndicator size="large" color={theme.primary} />
        <Text style={styles.loadingText}>Preparando sua agenda...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={pageData.shop.primaryColor || theme.primary} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.primary}
            colors={[theme.primary]}
            progressBackgroundColor={theme.surface}
          />
        }
      >
        <View style={[styles.hero, { backgroundColor: pageData.shop.primaryColor || theme.primary }]}>
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
            onPress={() => navigation.navigate('Agendar')}
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
            <View style={[styles.nextAppointmentCard, { borderColor: pageData.shop.accentColor || theme.accent }]}>
              <View style={styles.nextAppointmentHeader}>
                <Avatar size={58} name={nextAppointment.barberName} photoUrl={nextAppointment.barberAvatar} />
                <View style={styles.nextAppointmentInfo}>
                  <Text style={styles.nextAppointmentTitle}>{nextAppointment.serviceName}</Text>
                  <Text style={styles.nextAppointmentSubtitle}>{nextAppointment.barberName}</Text>
                </View>
                <View style={styles.statusBadge}>
                  <Text style={styles.statusBadgeText}>{nextAppointment.status || 'Confirmado'}</Text>
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
                onPress={() => navigation.navigate('Agendar')}
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

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    loadingContainer: {
      flex: 1,
      backgroundColor: theme.background,
      justifyContent: 'center',
      alignItems: 'center',
      paddingHorizontal: 24,
    },
    loadingText: {
      marginTop: 14,
      fontSize: 16,
      color: theme.textSecondary,
      fontWeight: '600',
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
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 18,
    },
    logoFallback: {
      width: 58,
      height: 58,
      borderRadius: 18,
      borderWidth: 2,
      borderColor: 'rgba(255,255,255,0.4)',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    logoFallbackText: {
      color: '#FFFFFF',
      fontWeight: '800',
      fontSize: 18,
    },
    heroTextWrap: {
      flex: 1,
    },
    heroEyebrow: {
      color: 'rgba(255,255,255,0.8)',
      fontSize: 11,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      marginBottom: 4,
    },
    heroTitle: {
      color: '#FFFFFF',
      fontSize: 28,
      fontWeight: '800',
    },
    heroSubtitle: {
      color: 'rgba(255,255,255,0.88)',
      fontSize: 14,
      lineHeight: 20,
      marginTop: 4,
    },
    heroButton: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      paddingVertical: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    heroButtonText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: '800',
    },
    content: {
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 12,
      marginBottom: 22,
    },
    statCard: {
      flex: 1,
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 16,
      shadowColor: theme.shadow,
      shadowOpacity: theme.isDark ? 0.16 : 0.05,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
      borderWidth: theme.isDark ? 1 : 0,
      borderColor: theme.border,
    },
    statValue: {
      color: theme.primary,
      fontSize: 24,
      fontWeight: '800',
      marginBottom: 4,
    },
    statLabel: {
      color: theme.textMuted,
      fontSize: 13,
      fontWeight: '600',
    },
    eyebrow: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.5,
      marginBottom: 6,
    },
    sectionTitle: {
      color: theme.text,
      fontSize: 22,
      fontWeight: '800',
      marginBottom: 14,
    },
    nextAppointmentCard: {
      backgroundColor: theme.surface,
      borderWidth: 1.5,
      borderRadius: 20,
      padding: 16,
      marginBottom: 22,
    },
    nextAppointmentHeader: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    nextAppointmentInfo: {
      flex: 1,
      marginLeft: 12,
    },
    nextAppointmentTitle: {
      color: theme.text,
      fontSize: 22,
      fontWeight: '800',
    },
    nextAppointmentSubtitle: {
      color: theme.textMuted,
      fontSize: 16,
      marginTop: 4,
    },
    statusBadge: {
      backgroundColor: theme.successSurface,
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
    },
    statusBadgeText: {
      color: theme.successText,
      fontWeight: '700',
      fontSize: 12,
    },
    nextAppointmentDate: {
      marginTop: 16,
      color: theme.primary,
      fontSize: 18,
      fontWeight: '800',
    },
    emptyCard: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      padding: 18,
      marginBottom: 22,
      borderWidth: 1,
      borderColor: theme.border,
    },
    emptyTitle: {
      color: theme.text,
      fontSize: 18,
      fontWeight: '800',
      marginBottom: 8,
    },
    emptyText: {
      color: theme.textMuted,
      lineHeight: 22,
    },
    highlightList: {
      gap: 12,
    },
    highlightCard: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      marginBottom: 8,
      shadowColor: theme.shadow,
      shadowOpacity: theme.isDark ? 0.12 : 0.04,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.border,
    },
    highlightBadge: {
      width: 48,
      height: 48,
      borderRadius: 16,
      backgroundColor: theme.isDark ? theme.surfaceMuted : '#EEF2FF',
      alignItems: 'center',
      justifyContent: 'center',
      marginRight: 14,
    },
    highlightBadgeText: {
      color: theme.primary,
      fontWeight: '800',
      fontSize: 16,
    },
    highlightInfo: {
      flex: 1,
    },
    highlightTitle: {
      color: theme.text,
      fontSize: 20,
      fontWeight: '800',
      marginBottom: 3,
    },
    highlightMeta: {
      color: theme.textMuted,
      fontSize: 14,
    },
    highlightAction: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: '800',
      marginLeft: 12,
    },
  });
}
