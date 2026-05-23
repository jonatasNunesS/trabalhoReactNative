import React from 'react';
import {
  Alert,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import Avatar from '../components/Avatar';
import { formatPrice } from '../utils/utilidades';

export default function ConfirmationPage({ navigation, route }) {
  const service = route?.params?.service || null;
  const professional = route?.params?.professional || null;
  const selectedDateLabel = route?.params?.selectedDateLabel || route?.params?.selectedDate || '';
  const selectedTime = route?.params?.selectedTime || '';
  const flowMode = route?.params?.flowMode || 'service-first';

  const handleConfirm = () => {
    Alert.alert('Agendamento confirmado', 'Seu horário foi reservado com sucesso.', [
      {
        text: 'OK',
        onPress: () => navigation.popToTop(),
      },
    ]);
  };

  const serviceLabel = service?.name || (flowMode === 'professional-first' ? 'Serviço a definir' : 'Serviço');
  const valueLabel = service?.price ? formatPrice(service.price) : flowMode === 'professional-first' ? 'Valor sob consulta' : formatPrice(0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#1E40AF" />

      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} activeOpacity={0.8} onPress={navigation.goBack}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>

        <Text style={styles.headerTitle}>Confirmação</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.card}>
          <Text style={styles.cardTitle}>Revise seu agendamento</Text>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Serviço</Text>
            <Text style={styles.infoValue}>{serviceLabel}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Valor</Text>
            <Text style={styles.infoValue}>{valueLabel}</Text>
          </View>

          <View style={styles.professionalRow}>
            <Avatar size={68} name={professional?.name} photoUrl={professional?.photoUrl} />
            <View style={styles.professionalInfo}>
              <Text style={styles.professionalName}>{professional?.name || 'Profissional'}</Text>
              <Text style={styles.professionalSpecialty}>{professional?.specialty || 'Atendimento geral'}</Text>
              {!service?.name && professional?.servicesOffered?.length ? (
                <Text style={styles.professionalServices}>
                  Serviços disponíveis: {professional.servicesOffered.join(', ')}
                </Text>
              ) : null}
            </View>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Data</Text>
            <Text style={styles.infoValue}>{selectedDateLabel}</Text>
          </View>

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Horário</Text>
            <Text style={styles.infoValue}>{selectedTime}</Text>
          </View>
        </View>

        <TouchableOpacity style={styles.confirmButton} activeOpacity={0.85} onPress={handleConfirm}>
          <Text style={styles.confirmButtonText}>Confirmar agendamento</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    backgroundColor: '#1E40AF',
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
  content: {
    flex: 1,
    padding: 16,
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 18,
    padding: 18,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  cardTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 18,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 14,
  },
  infoLabel: {
    color: '#64748B',
    fontWeight: '700',
  },
  infoValue: {
    color: '#111827',
    fontWeight: '800',
    flex: 1,
    textAlign: 'right',
    marginLeft: 12,
  },
  professionalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 10,
    paddingVertical: 10,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#E5E7EB',
  },
  professionalInfo: {
    marginLeft: 14,
    flex: 1,
  },
  professionalName: {
    fontSize: 18,
    fontWeight: '800',
    color: '#111827',
  },
  professionalSpecialty: {
    marginTop: 4,
    fontSize: 14,
    color: '#64748B',
  },
  professionalServices: {
    marginTop: 6,
    fontSize: 13,
    color: '#1E40AF',
    fontWeight: '700',
    lineHeight: 18,
  },
  confirmButton: {
    backgroundColor: '#1E40AF',
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '800',
  },
});
