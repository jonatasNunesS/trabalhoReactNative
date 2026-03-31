import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

const menuItems = [
  { id: "1", title: "home" },
  { id: "2", title: "agendamento" },
  { id: "3", title: "perfil" },
  { id: "4", title: "configuracoes" },
];

export default function MenuMobile({ onSelect }) {
  return (
    <View style={styles.menuMobileContain}>
      {menuItems.map((item) => (
        <TouchableOpacity
          key={item.id}
          style={styles.menuButton}
          onPress={() => onSelect(item.title)}
        >
          <Text style={styles.menuText}>{item.title}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  menuMobileContain: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    backgroundColor: "#ffffff",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingVertical: 8,
    paddingHorizontal: 12,
    elevation: 8,
    shadowColor: "# 000",
    shadowOpacity: 0.1,
    shadowRadius: 4,
    shadowOffset: { width: 0, height: -2 },
  },
  menuButton: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 6,
  },
  menuText: {
    fontFamily: "Poppins_600SemiBold",
    fontSize: 12,
    color: "#333",
  },
});
