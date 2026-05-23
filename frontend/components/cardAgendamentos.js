import React from 'react';
import { Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getInitials, formatDateTime } from '../utils/utilidades';
import { useAppTheme } from '../context/AppContext';

const CardAgendamento = ({ appointment, onViewDetails }) => {
  const { theme } = useAppTheme();

  return (
    <View
      key={appointment.id}
      style={[
        styles.appointmentCard,
        {
          backgroundColor: theme.surface,
          borderColor: theme.accent,
          shadowColor: theme.shadow,
        },
      ]}
    >
      <View style={styles.appointmentTop}>
        {appointment.barberAvatar ? (
          <Image source={{ uri: appointment.barberAvatar }} style={[styles.barberAvatar, { backgroundColor: theme.border }]} />
        ) : (
          <View style={[styles.avatarFallback, { backgroundColor: theme.surfaceElevated }]}> 
            <Text style={[styles.avatarFallbackText, { color: theme.textSecondary }]}>
              {getInitials(appointment.barberName)}
            </Text>
          </View>
        )}

        <View style={styles.appointmentInfo}>
          <Text style={[styles.barberName, { color: theme.text }]} numberOfLines={1}>
            {appointment.barberName}
          </Text>
          <Text style={[styles.serviceName, { color: theme.primary }]} numberOfLines={2}>
            {appointment.serviceName}
          </Text>
        </View>
      </View>

      <View style={[styles.divider, { backgroundColor: theme.divider }]} />

      <Text style={[styles.dateText, { color: theme.text }]}>{formatDateTime(appointment.dateTime)}</Text>

      <TouchableOpacity
        style={[styles.detailsButton, { borderColor: theme.primary }]}
        activeOpacity={0.85}
        onPress={() => onViewDetails(appointment)}
      >
        <Text style={[styles.detailsButtonText, { color: theme.primary }]}>Ver Detalhes</Text>
      </TouchableOpacity>
    </View>
  );
};
export default CardAgendamento;

const styles = StyleSheet.create({
  appointmentCard: {
    borderWidth: 2,
    borderRadius: 18,
    paddingTop: 18,
    paddingBottom: 18,
    paddingRight: 18,
    paddingLeft: 18,
    maxWidth: '90%',
    marginRight: 15,
    marginBottom: 16,
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
    width: 62,
    height: 62,
    borderRadius: 36,
    marginRight: 14,
  },
  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: {
    fontSize: 18,
    fontWeight: '800',
  },
  appointmentInfo: {
    flex: 1,
  },
  barberName: {
    fontSize: 16,
    fontWeight: '800',
    marginBottom: 6,
  },
  serviceName: {
    fontSize: 15,
    fontWeight: '700',
  },
  divider: {
    height: 1,
    marginVertical: 10,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 16,
  },
  detailsButton: {
    borderWidth: 2,
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailsButtonText: {
    fontSize: 16,
    fontWeight: '800',
  },
});
