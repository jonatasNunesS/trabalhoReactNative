import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';


export default function PerfilPage() {
  return (
      <View style={styles.containerPerfil}>
        <Text>Página de Perfil</Text>
      </View>
  );
}
 const styles = StyleSheet.create({
    containerPerfil:{
        display: 'flex',
        flex: 1,
    }
  });
