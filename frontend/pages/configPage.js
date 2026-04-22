import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function ConfiguracoesPage() {
  return (
    <View style={styles.containerHome}>
      <Text>Página de Configurações</Text>
    </View>
  );
}
const styles = StyleSheet.create({
  containerHome: {
    display: "flex",
    flex: 1,
  },
});
