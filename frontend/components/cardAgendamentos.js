import {
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";

import { getInitials, formatDateTime } from "../utils/utilidades";

const cardAgendamento = ({appointment, onViewDetails}) =>  {
    return (
      <View key={appointment.id} style={styles.appointmentCard}>
        <View style={styles.appointmentTop}>
          {appointment.barberAvatar ? (
            <Image
              source={{ uri: appointment.barberAvatar }}
              style={styles.barberAvatar}
            />
          ) : (
            <View style={styles.avatarFallback}>
              <Text style={styles.avatarFallbackText}>
                {getInitials(appointment.barberName)}
              </Text>
            </View>
          )}

          <View style={styles.appointmentInfo}>
            <Text style={styles.barberName} numberOfLines={1}>
              {appointment.barberName}
            </Text>
            <Text style={styles.serviceName} numberOfLines={2}>
              {appointment.serviceName}
            </Text>
          </View>
        </View>

        <View style={styles.divider} />

        <Text style={styles.dateText}>
          {formatDateTime(appointment.dateTime)}
        </Text>

        <TouchableOpacity
          style={styles.detailsButton}
          activeOpacity={0.85}
          onPress={() => onViewDetails(appointment)}
        >
          <Text style={styles.detailsButtonText}>Ver Detalhes</Text>
        </TouchableOpacity>
      </View>
    );
  };
  export default cardAgendamento;

const styles = StyleSheet.create({
  
  appointmentCard: {
    backgroundColor: "#FFFFFF",
    borderWidth: 2,
    borderColor: "#22B8B0",
    borderRadius: 18,
    paddingTop: 18,
    paddingBottom: 18,
    paddingRight: 18,
    paddingLeft: 18,
    maxWidth: "90%",
    marginRight: "15px ",
    marginBottom: 16,
    shadowColor: "#000000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  appointmentTop: {
    flexDirection: "row",
    alignItems: "center",
  },
  barberAvatar: {
    width: 62,
    height: 62,
    borderRadius: 36,
    marginRight: 14,
    backgroundColor: "#E5E7EB",
  },

  avatarFallback: {
    width: 72,
    height: 72,
    borderRadius: 36,
    marginRight: 14,
    backgroundColor: "#D1D5DB",
    alignItems: "center",
    justifyContent: "center",
  },

  avatarFallbackText: {
    fontSize: 18,
    fontWeight: "800",
    color: "#374151",
  },

  appointmentInfo: {
    flex: 1,
  },

  barberName: {
    fontSize: 16,
    fontWeight: "800",
    color: "#111827",
    marginBottom: 6,
  },

  serviceName: {
    fontSize: 15,
    fontWeight: "700",
    color: "#1E40AF",
  },

  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 10,
  },

  dateText: {
    fontSize: 18,
    fontWeight: "500",
    color: "#111827",
    textAlign: "center",
    marginBottom: 16,
  },

  detailsButton: {
    borderWidth: 2,
    borderColor: "#1E40AF",
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
  },

  detailsButtonText: {
    color: "#1E40AF",
    fontSize: 16,
    fontWeight: "800",
  }
});