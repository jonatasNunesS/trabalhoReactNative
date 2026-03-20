import React from "react";
import {
  Text,
  View,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";

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

const styles = StyleSheet.create({});
