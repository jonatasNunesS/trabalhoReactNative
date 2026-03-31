import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { Text } from "react-native";

/* Pages */
import AgendamentoPage from "./AgendamentoPage";
import HorariosPage from "./HorariosPage";
import { View } from "react-native-web";

const Stack = createStackNavigator();

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
