import React, { useContext, useState } from 'react';
import { useWindowDimensions } from 'react-native';
import {
  NavigationContainer,
  DefaultTheme as NavigationDefaultTheme,
  DarkTheme as NavigationDarkTheme,
} from '@react-navigation/native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from '@expo-google-fonts/poppins';
import { Ionicons } from '@expo/vector-icons';
import { AppContext, AppProvider } from './context/AppContext';

import HomePage from './pages/HomePage';
import PerfilPage from './pages/perfilPage';
import ConfiguracoesPage from './pages/configPage';
import AgendamentoPage from './pages/AgendamentoPage';
import HorariosPage from './pages/HorariosPage';
import ConfirmationPage from './pages/ConfirmationPage';
import LoginPage from './pages/LoginPage';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function getTabIconName(routeName, focused) {
  switch (routeName) {
    case 'Home':
      return focused ? 'home' : 'home-outline';
    case 'Agendar':
      return focused ? 'calendar' : 'calendar-outline';
    case 'Perfil':
      return focused ? 'person' : 'person-outline';
    case 'Configurações':
      return focused ? 'settings' : 'settings-outline';
    default:
      return focused ? 'ellipse' : 'ellipse-outline';
  }
}

function AgendamentoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="AgendamentoPage" component={AgendamentoPage} />
      <Stack.Screen name="Horarios" component={HorariosPage} />
      <Stack.Screen name="Confirmation" component={ConfirmationPage} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  const { width } = useWindowDimensions();
  const { theme } = useContext(AppContext);
  const isMobile = width <= 767;

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarShowLabel: !isMobile,
        tabBarActiveTintColor: theme.primary,
        tabBarInactiveTintColor: theme.textSoft,
        tabBarStyle: {
          backgroundColor: theme.tabBarBackground,
          borderTopWidth: 1,
          borderTopColor: theme.tabBarBorder,
          height: isMobile ? 68 : 74,
          paddingTop: 8,
          paddingBottom: isMobile ? 10 : 8,
        },
        tabBarLabelStyle: {
          fontFamily: 'Poppins_600SemiBold',
          fontSize: 12,
        },
        tabBarIcon: ({ color, focused, size }) => (
          <Ionicons
            name={getTabIconName(route.name, focused)}
            size={isMobile ? 24 : size}
            color={color}
          />
        ),
        sceneStyle: { backgroundColor: theme.background },
      })}
    >
      <Tab.Screen name="Home" component={HomePage} />
      <Tab.Screen name="Agendar" component={AgendamentoStack} />
      <Tab.Screen name="Perfil" component={PerfilPage} />
      <Tab.Screen name="Configurações" component={ConfiguracoesPage} />
    </Tab.Navigator>
  );
}

function AppNavigation() {
  const { width } = useWindowDimensions();
  const { theme } = useContext(AppContext);

  const navigationTheme = theme.isDark
    ? {
        ...NavigationDarkTheme,
        colors: {
          ...NavigationDarkTheme.colors,
          background: theme.background,
          card: theme.surface,
          text: theme.text,
          border: theme.tabBarBorder,
          primary: theme.primary,
        },
      }
    : {
        ...NavigationDefaultTheme,
        colors: {
          ...NavigationDefaultTheme.colors,
          background: theme.background,
          card: theme.surface,
          text: theme.text,
          border: theme.tabBarBorder,
          primary: theme.primary,
        },
      };

  return (
    <NavigationContainer theme={navigationTheme}>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {/* Tela de login — primeira tela ao abrir o app */}
        <Stack.Screen name="Login" component={LoginPage} />

        {/* Após login bem-sucedido, navega para Main (replace) */}
        <Stack.Screen name="Main" component={MainTabs} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaProvider>
      <AppProvider>
        <AppNavigation />
      </AppProvider>
    </SafeAreaProvider>
  );
}
