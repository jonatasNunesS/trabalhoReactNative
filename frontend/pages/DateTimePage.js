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
import { getDateTimePageData } from '../services/api';
import { formatPrice } from '../utils/formatters';

export default function DateTimePage({ navigation, route }) {
  const service = route?.params?.service || null;
  const professional = route?.params?.professional || null;

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dates, setDates] = useState([]);
  const [timeSlotsByDate, setTimeSlotsByDate] = useState({});
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [currentStep, setCurrentStep] = useState(3);
  const [totalSteps, setTotalSteps] = useState(4);

  const loadAvailability = useCallback(async () => {
    try {
      const data = await getDateTimePageData({
        serviceId: service?.id,
        professionalId: professional?.id,
      });

      const normalizedDates = Array.isArray(data?.dates) ? data.dates : [];
      const normalizedSlots = data?.timeSlots && typeof data.timeSlots === 'object' ? data.timeSlots : {};

      setDates(normalizedDates);
      setTimeSlotsByDate(normalizedSlots);
      setCurrentStep(
        typeof data?.currentStep === 'number' && data.currentStep > 0 ? data.currentStep : 3
      );
      setTotalSteps(
        typeof data?.totalSteps === 'number' && data.totalSteps > 0 ? data.totalSteps : 4
      );

      if (normalizedDates.length > 0) {
        const firstDate = normalizedDates[0].id;
        setSelectedDate(firstDate);
        const slots = normalizedSlots[firstDate] || [];
        setSelectedTime(slots[0] || '');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [professional?.id, service?.id]);

  useEffect(() => {
    loadAvailability();
  }, [loadAvailability]);

  const onRefresh = () => {
    setRefreshing(true);
    loadAvailability();
  };

  const progressPercentage = useMemo(() => {
    if (!totalSteps || totalSteps <= 0) return 0;
    return Math.min(100, Math.max(0, (currentStep / totalSteps) * 100));
  }, [currentStep, totalSteps]);

  const currentTimeSlots = selectedDate ? timeSlotsByDate[selectedDate] || [] : [];

  const handleContinue = () => {
    if (!selectedDate || !selectedTime) return;

    navigation.navigate('ConfirmationPage', {
      service,
      professional,
      selectedDate,
      selectedDateLabel: dates.find((item) => item.id === selectedDate)?.label || selectedDate,
      selectedTime,
    });
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <StatusBar barStyle="light-content" backgroundColor="#163B9D" />
        <ActivityIndicator size="large" color="#163B9D" />
        <Text style={styles.loadingText}>Carregando agenda...</Text>
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
          Data e Horário
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
          </View>
          <Text style={styles.progressText}>
            {currentStep} / {totalSteps}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.summaryCard}>
          <View style={styles.summaryRow}>
            <Avatar size={72} name={professional?.name} photoUrl={professional?.photoUrl} />
            <View style={styles.summaryInfo}>
              <Text style={styles.summaryTitle}>{service?.name || 'Serviço'}</Text>
              <Text style={styles.summarySubtitle}>{professional?.name || 'Profissional'}</Text>
              <Text style={styles.summaryPrice}>{formatPrice(service?.price || 0)}</Text>
            </View>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Escolha a data</Text>
        <View style={styles.optionGrid}>
          {dates.map((date) => {
            const isSelected = selectedDate === date.id;
            return (
              <TouchableOpacity
                key={date.id}
                style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                onPress={() => {
                  setSelectedDate(date.id);
                  const slots = timeSlotsByDate[date.id] || [];
                  setSelectedTime(slots[0] || '');
                }}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {date.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Text style={styles.sectionTitle}>Escolha o horário</Text>
        <View style={styles.optionGrid}>
          {currentTimeSlots.map((time) => {
            const isSelected = selectedTime === time;
            return (
              <TouchableOpacity
                key={time}
                style={[styles.optionButton, isSelected && styles.optionButtonSelected]}
                onPress={() => setSelectedTime(time)}
              >
                <Text style={[styles.optionText, isSelected && styles.optionTextSelected]}>
                  {time}
                </Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <TouchableOpacity
          style={[styles.continueButton, (!selectedDate || !selectedTime) && styles.continueButtonDisabled]}
          activeOpacity={0.85}
          disabled={!selectedDate || !selectedTime}
          onPress={handleContinue}
        >
          <Text style={styles.continueButtonText}>Continuar</Text>
        </TouchableOpacity>
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
  summaryCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryInfo: {
    flex: 1,
    marginLeft: 14,
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#111827',
  },
  summarySubtitle: {
    fontSize: 15,
    color: '#4B5563',
    marginTop: 4,
  },
  summaryPrice: {
    fontSize: 16,
    fontWeight: '800',
    color: '#163B9D',
    marginTop: 6,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 12,
  },
  optionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 20,
  },
  optionButton: {
    minWidth: 92,
    backgroundColor: '#FFFFFF',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 14,
    paddingHorizontal: 16,
    marginRight: 10,
    marginBottom: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#163B9D',
    borderColor: '#163B9D',
  },
  optionText: {
    color: '#111827',
    fontWeight: '700',
  },
  optionTextSelected: {
    color: '#FFFFFF',
  },
  continueButton: {
    backgroundColor: '#163B9D',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
  },
  continueButtonDisabled: {
    opacity: 0.5,
  },
  continueButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});
