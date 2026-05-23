import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Avatar from '../components/Avatar';
import { getProfessionalsPageData } from '../services/api';
import { isFilledString, renderStars } from '../utils/formatters';

function normalizeProfessional(item, serviceName, index) {
  return {
    id: item?.id ?? `professional-${index}`,
    name: isFilledString(item?.name) ? item.name : 'Profissional',
    photoUrl: isFilledString(item?.photoUrl) ? item.photoUrl : '',
    specialty: isFilledString(item?.specialty)
      ? item.specialty
      : `Especialista em ${serviceName || 'Serviço'}`,
    rating: typeof item?.rating === 'number' ? item.rating : 4.8,
  };
}

export default function ProfissionaisPage({ navigation, route }) {
  const service = route?.params?.service || null;
  const routeProfessionals = Array.isArray(route?.params?.professionals)
    ? route.params.professionals
    : [];

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageData, setPageData] = useState({
    serviceName: service?.name || 'Serviço',
    currentStep: 2,
    totalSteps: 4,
    professionals: routeProfessionals.map((item, index) =>
      normalizeProfessional(item, service?.name, index)
    ),
  });

  const progressPercentage = useMemo(() => {
    if (!pageData.totalSteps || pageData.totalSteps <= 0) return 0;
    return Math.min(100, Math.max(0, (pageData.currentStep / pageData.totalSteps) * 100));
  }, [pageData.currentStep, pageData.totalSteps]);

  const loadProfessionals = useCallback(async () => {
    if (routeProfessionals.length > 0) {
      setLoading(false);
      setRefreshing(false);
      return;
    }

    try {
      const data = await getProfessionalsPageData(service?.id);
      setPageData({
        serviceName: isFilledString(data?.serviceName) ? data.serviceName : service?.name || 'Serviço',
        currentStep:
          typeof data?.currentStep === 'number' && data.currentStep > 0 ? data.currentStep : 2,
        totalSteps:
          typeof data?.totalSteps === 'number' && data.totalSteps > 0 ? data.totalSteps : 4,
        professionals: Array.isArray(data?.professionals)
          ? data.professionals.map((item, index) =>
              normalizeProfessional(item, data?.serviceName || service?.name, index)
            )
          : [],
      });
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [routeProfessionals, service?.id, service?.name]);

  useEffect(() => {
    loadProfessionals();
  }, [loadProfessionals]);

  const onRefresh = () => {
    setRefreshing(true);
    loadProfessionals();
  };

  const handleScheduleProfessional = (professional) => {
    navigation.navigate('DateTimePage', {
      service,
      professional,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#163B9D" />
        <ActivityIndicator size="large" color="#163B9D" />
        <Text style={styles.loadingText}>Carregando profissionais...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#163B9D" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={navigation.goBack}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle} numberOfLines={1}>
          Profissionais - {pageData.serviceName}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {pageData.currentStep} / {pageData.totalSteps}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {pageData.professionals.map((professional) => (
          <View key={professional.id} style={styles.professionalCard}>
            <View style={styles.cardLeft}>
              <Avatar size={96} name={professional.name} photoUrl={professional.photoUrl} style={styles.professionalPhoto} />

              <View style={styles.professionalInfo}>
                <Text style={styles.professionalName} numberOfLines={1}>
                  {professional.name}
                </Text>

                <Text style={styles.professionalSpecialty} numberOfLines={1}>
                  {professional.specialty}
                </Text>

                <View style={styles.ratingRow}>
                  <Text style={styles.starsText}>{renderStars(professional.rating)}</Text>
                  <Text style={styles.ratingValue}>({professional.rating.toFixed(1)})</Text>
                </View>
              </View>
            </View>

            <TouchableOpacity
              style={styles.scheduleButton}
              activeOpacity={0.85}
              onPress={() => handleScheduleProfessional(professional)}
            >
              <Text style={styles.scheduleButtonText}>Agendar</Text>
            </TouchableOpacity>
          </View>
        ))}
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
  header: {
    backgroundColor: '#163B9D',
    paddingTop: 16,
    paddingBottom: 18,
    paddingHorizontal: 18,
  },
  backButton: {
    position: 'absolute',
    left: 18,
    top: 12,
    zIndex: 2,
    width: 52,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  backButtonText: {
    fontSize: 52,
    lineHeight: 52,
    color: '#FFFFFF',
    fontWeight: '400',
  },
  headerTitle: {
    textAlign: 'center',
    color: '#FFFFFF',
    fontSize: 25,
    fontWeight: '800',
    paddingHorizontal: 46,
  },
  progressContainer: {
    marginTop: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    width: '72%',
    height: 10,
    borderRadius: 999,
    backgroundColor: '#0C2B7B',
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
    backgroundColor: '#5D95FF',
  },
  progressText: {
    position: 'absolute',
    backgroundColor: '#163B9D',
    paddingHorizontal: 14,
    color: '#FFFFFF',
    fontSize: 17,
    fontWeight: '800',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 18,
    paddingBottom: 30,
  },
  professionalCard: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#22B8B0',
    borderRadius: 8,
    paddingVertical: 20,
    paddingHorizontal: 16,
    marginBottom: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  cardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  professionalPhoto: {
    marginRight: 16,
  },
  professionalInfo: {
    flex: 1,
    justifyContent: 'center',
  },
  professionalName: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 6,
  },
  professionalSpecialty: {
    fontSize: 16,
    color: '#1F2A44',
    marginBottom: 8,
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  starsText: {
    fontSize: 20,
    color: '#163B9D',
    letterSpacing: 1,
    fontWeight: '800',
  },
  ratingValue: {
    fontSize: 18,
    color: '#163B9D',
    fontWeight: '800',
    marginLeft: 8,
  },
  scheduleButton: {
    backgroundColor: '#163B9D',
    borderRadius: 10,
    paddingVertical: 18,
    paddingHorizontal: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scheduleButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});
