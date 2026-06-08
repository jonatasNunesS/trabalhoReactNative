import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  useWindowDimensions,
} from 'react-native';
import Avatar from '../components/Avatar';
import BrandFooter from '../components/BrandFooter';
import SectionTitle from '../components/SectionTitle';
import { developerBrand } from '../data/exampleData';
import { getSchedulingPageData } from '../services/api';
import { formatDateTime, formatPrice, getInitials, isFilledString } from '../utils/formatters';

const HORIZONTAL_PADDING = 20;
const GRID_GAP = 12;

const INITIAL_STATE = {
  shop: {
    name: 'Barbearia Reis',
    logoUrl: '',
    primaryColor: '#163B9D',
    accentColor: '#22B8B0',
  },
  upcomingAppointments: [],
  popularServices: [],
};

function normalizeService(service) {
  return {
    id: service?.id ?? `service-${Math.random().toString(36).slice(2, 8)}`,
    name: isFilledString(service?.name) ? service.name : 'Serviço',
    price: typeof service?.price === 'number' ? service.price : 0,
    image: isFilledString(service?.image) ? service.image : '',
    durationMinutes:
      typeof service?.durationMinutes === 'number' ? service.durationMinutes : 30,
    availableBarbers: Array.isArray(service?.availableBarbers)
      ? service.availableBarbers.map((barber, index) => ({
          id: barber?.id ?? `barber-${index}`,
          name: isFilledString(barber?.name) ? barber.name : 'Profissional',
          specialty: isFilledString(barber?.specialty)
            ? barber.specialty
            : 'Atendimento geral',
          rating: typeof barber?.rating === 'number' ? barber.rating : 4.8,
          photoUrl: isFilledString(barber?.photoUrl) ? barber.photoUrl : '',
        }))
      : [],
  };
}

export default function SchedulingPage({ navigation }) {
  const { width } = useWindowDimensions();
  const isTablet = width >= 768;
  const serviceCardWidth = isTablet
    ? (width - HORIZONTAL_PADDING * 2 - GRID_GAP) / 2
    : width - HORIZONTAL_PADDING * 2;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageData, setPageData] = useState(INITIAL_STATE);

  const loadPageData = useCallback(async () => {
    try {
      const data = await getSchedulingPageData();
      setPageData({
        shop: {
          name: isFilledString(data?.shop?.name) ? data.shop.name : 'Barbearia Premium',
          logoUrl: isFilledString(data?.shop?.logoUrl) ? data.shop.logoUrl : '',
          primaryColor: isFilledString(data?.shop?.primaryColor)
            ? data.shop.primaryColor
            : '#163B9D',
          accentColor: isFilledString(data?.shop?.accentColor)
            ? data.shop.accentColor
            : '#22B8B0',
        },
        upcomingAppointments: Array.isArray(data?.upcomingAppointments)
          ? data.upcomingAppointments
          : [],
        popularServices: Array.isArray(data?.popularServices)
          ? data.popularServices.map(normalizeService)
          : [],
      });
    } catch (error) {
      Alert.alert('Erro', 'Não foi possível carregar os dados da tela inicial.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadPageData();
  }, [loadPageData]);

  const onRefresh = () => {
    setRefreshing(true);
    loadPageData();
  };

  const handleViewDetails = (appointment) => {
    Alert.alert(
      'Detalhes do agendamento',
      `${appointment.barberName}\n${appointment.serviceName}\n${formatDateTime(
        appointment.dateTime
      )}`
    );
  };

  const handleScheduleService = (service) => {
    const availableProfessionals = Array.isArray(service.availableBarbers)
      ? service.availableBarbers
      : [];

    if (availableProfessionals.length === 0) {
      Alert.alert(
        'Indisponível',
        'No momento não há profissionais disponíveis para este serviço.'
      );
      return;
    }

    if (availableProfessionals.length === 1) {
      const professional = availableProfessionals[0];
      navigation.navigate('DateTimePage', {
        service,
        professional,
      });
      return;
    }

    navigation.navigate('ProfissionaisPage', {
      service,
      professionals: availableProfessionals,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#163B9D" />
        <ActivityIndicator size="large" color="#163B9D" />
        <Text style={styles.loadingText}>Carregando agendamentos...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={pageData.shop.primaryColor || '#163B9D'}
      />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        showsVerticalScrollIndicator={false}
      >
        <View
          style={[
            styles.header,
            { backgroundColor: pageData.shop.primaryColor || '#163B9D' },
          ]}
        >
          <View style={styles.headerRow}>
            {pageData.shop.logoUrl ? (
              <Image
                source={{ uri: pageData.shop.logoUrl }}
                style={styles.headerLogoImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.headerLogoFallback}>
                <Text style={styles.headerLogoFallbackText}>
                  {getInitials(pageData.shop.name)}
                </Text>
              </View>
            )}

            <Text style={styles.headerTitle} numberOfLines={2}>
              {pageData.shop.name}
            </Text>
          </View>
        </View>

        <View style={styles.content}>
          <SectionTitle>Próximos Agendamentos</SectionTitle>

          {pageData.upcomingAppointments.map((appointment) => (
            <View
              key={appointment.id}
              style={[
                styles.appointmentCard,
                { borderColor: pageData.shop.accentColor || '#22B8B0' },
              ]}
            >
              <View style={styles.appointmentTop}>
                <Avatar
                  size={72}
                  name={appointment.barberName}
                  photoUrl={appointment.barberAvatar}
                  style={styles.barberAvatar}
                />

                <View style={styles.appointmentInfo}>
                  <Text style={styles.barberName} numberOfLines={1}>
                    {appointment.barberName}
                  </Text>
                  <Text style={styles.serviceName} numberOfLines={2}>
                    {appointment.serviceName}
                  </Text>
                  <Text style={styles.statusText}>{appointment.status || 'Pendente'}</Text>
                </View>
              </View>

              <View style={styles.divider} />

              <Text style={styles.dateText}>{formatDateTime(appointment.dateTime)}</Text>

              <TouchableOpacity
                style={styles.detailsButton}
                activeOpacity={0.85}
                onPress={() => handleViewDetails(appointment)}
              >
                <Text style={styles.detailsButtonText}>Ver Detalhes</Text>
              </TouchableOpacity>
            </View>
          ))}

          <View style={styles.sectionDivider} />

          <SectionTitle>Serviços Populares</SectionTitle>

          <View style={styles.servicesGrid}>
            {pageData.popularServices.map((service) => {
              const barberNames = Array.isArray(service.availableBarbers)
                ? service.availableBarbers.map((barber) => barber.name).join(', ')
                : '';

              return (
                <View
                  key={service.id}
                  style={[
                    styles.serviceCard,
                    { width: serviceCardWidth },
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
                    <Text style={styles.serviceMeta}>
                      Duração estimada: {service.durationMinutes} min
                    </Text>

                    <Text style={styles.availableBarbersText} numberOfLines={2}>
                      Profissionais: {barberNames || 'Nenhum disponível'}
                    </Text>

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
            })}
          </View>

          <BrandFooter
            brandName={developerBrand.name}
            tagline={developerBrand.tagline}
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  loadingText: {
    marginTop: 14,
    fontSize: 16,
    color: '#374151',
    fontWeight: '500',
  },
  scrollContent: {
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 18,
    paddingBottom: 18,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerLogoImage: {
    width: 52,
    height: 52,
    borderRadius: 10,
    backgroundColor: '#FFFFFF',
    marginRight: 14,
  },
  headerLogoFallback: {
    width: 52,
    height: 52,
    borderWidth: 3,
    borderColor: '#FFFFFF',
    borderRadius: 10,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerLogoFallbackText: {
    color: '#FFFFFF',
    fontWeight: '800',
  },
  headerTitle: {
    flex: 1,
    fontSize: 28,
    fontWeight: '800',
    color: '#FFFFFF',
  },
  content: {
    paddingHorizontal: HORIZONTAL_PADDING,
    paddingTop: 22,
  },
  appointmentCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderRadius: 18,
    padding: 18,
    marginBottom: 16,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  appointmentTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  barberAvatar: {
    marginRight: 14,
  },
  appointmentInfo: {
    flex: 1,
  },
  barberName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  serviceName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E40AF',
  },
  statusText: {
    marginTop: 6,
    fontSize: 13,
    fontWeight: '700',
    color: '#6B7280',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 16,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    textAlign: 'center',
    marginBottom: 16,
  },
  detailsButton: {
    borderWidth: 2,
    borderColor: '#1E40AF',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButtonText: {
    color: '#1E40AF',
    fontSize: 16,
    fontWeight: '800',
  },
  sectionDivider: {
    height: 1,
    backgroundColor: '#D1D5DB',
    marginVertical: 18,
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  serviceCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  serviceImage: {
    width: '100%',
    height: 170,
    backgroundColor: '#E5E7EB',
  },
  serviceImageFallback: {
    width: '100%',
    height: 170,
    backgroundColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  serviceImageFallbackText: {
    fontSize: 22,
    fontWeight: '800',
    color: '#374151',
  },
  serviceContent: {
    padding: 14,
  },
  serviceTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 10,
  },
  servicePrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E40AF',
    marginBottom: 6,
  },
  serviceMeta: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  availableBarbersText: {
    fontSize: 12,
    color: '#6B7280',
    lineHeight: 18,
    marginBottom: 14,
  },
  scheduleButton: {
    backgroundColor: '#163B9D',
    borderRadius: 10,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 15,
    fontWeight: '800',
  },
});
