import React, { useMemo } from 'react';
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
import { useAppTheme } from '../context/AppContext';

export default function ConfirmationPage({ navigation, route }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
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
  const valueLabel = service?.price
    ? formatPrice(service.price)
    : flowMode === 'professional-first'
    ? 'Valor sob consulta'
    : formatPrice(0);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={theme.primary} />

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

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
    },
    header: {
      backgroundColor: theme.primary,
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
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 18,
      shadowColor: theme.shadow,
      shadowOffset: { width: 0, height: 3 },
      shadowOpacity: theme.isDark ? 0.16 : 0.05,
      shadowRadius: 6,
      elevation: 2,
      borderWidth: 1,
      borderColor: theme.border,
    },
    cardTitle: {
      fontSize: 22,
      fontWeight: '800',
      color: theme.text,
      marginBottom: 18,
    },
    infoRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    infoLabel: {
      color: theme.textMuted,
      fontWeight: '700',
    },
    infoValue: {
      color: theme.text,
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
      borderColor: theme.border,
    },
    professionalInfo: {
      marginLeft: 14,
      flex: 1,
    },
    professionalName: {
      fontSize: 18,
      fontWeight: '800',
      color: theme.text,
    },
    professionalSpecialty: {
      marginTop: 4,
      fontSize: 14,
      color: theme.textMuted,
    },
    professionalServices: {
      marginTop: 6,
      fontSize: 13,
      color: theme.primary,
      fontWeight: '700',
      lineHeight: 18,
    },
    confirmButton: {
      backgroundColor: theme.primary,
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
}
