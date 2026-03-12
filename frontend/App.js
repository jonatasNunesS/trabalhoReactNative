import { StatusBar } from 'expo-status-bar';
import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';

/* Pages */
import HomePage from './pages/homePage';
import PerfilPage from './pages/perfilPage';
import ConfiguracoesPage from './pages/configPage';

/* Componentes */
import MenuMobile from './components/menuMobile';

/* Fontes */
import { useFonts, Poppins_400Regular, Poppins_600SemiBold } from '@expo-google-fonts/poppins';

export default function App() {
  const [selected, setSelected] = useState('home');

  const [fontsLoaded] = useFonts({
      Poppins_400Regular,
      Poppins_600SemiBold,
  });
   if (!fontsLoaded) {
    return null; // ou um SplashScreen
  }

  const renderContent = () => {
    switch (selected) {
      case 'home':
        return <HomePage/>;
      case 'perfil':
        return <PerfilPage/>;
      case 'configuracoes':
        return <ConfiguracoesPage/>;
      default:
        return <HomePage/>;
    }
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.safeArea} edges={['top','bottom']}>
      <View style={{ flex:1 }}>
        <View style={styles.containerGeral}>
          {renderContent()}
        </View>

        <MenuMobile onSelect={setSelected} />
      </View>
      </SafeAreaView>
    </SafeAreaProvider>
  );
 
}
 const styles = StyleSheet.create({
   safeArea: {
    flex: 1,
    backgroundColor: '#fff', // cor de fundo geral
  },
    containerGeral:{
        display: 'flex',
        flex: 1,
    }
  });
