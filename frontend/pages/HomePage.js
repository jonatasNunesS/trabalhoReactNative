import React from "react";
import { Text, View } from "react-native";

export default function HomePage() {
  // estados principais do fluxo


  return (
    <View style={{ flex: 1 }}>
      <Text>Bem-vindo à Barbearia!</Text>
      <Text>Selecione um serviço para começar seu agendamento.</Text>
      {/* Aqui você pode adicionar uma lista de serviços para o usuário escolher */}
    </View>
  );
}
