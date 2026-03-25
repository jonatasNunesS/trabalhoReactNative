import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';


const Stack = createStackNavigator();


/* Pages */
import AgendamentoPage from "./AgendamentoPage";
import HorariosPage from './HorariosPage';


export default function HomePage() {
  return (
    <NavigationContainer >
      <Stack.Navigator
        initialRouteName="Agendamento"
        screenOptions={{
          headerShown: false,
          contentStyle: { flex: 1 }, // força a tela ocupar todo espaço
        }}
      > 
        <Stack.Screen name="Agendamento" component={HorariosPage} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

 const styles = StyleSheet.create({
    containerHome:{
        flex: 1,
    }
  });
