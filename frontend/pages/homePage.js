import React, { useState } from 'react';
import { Text, View, StyleSheet } from 'react-native';


export default function HomePage() {
  return (
      <View style={styles.containerHome}>
        <Text>Página Home</Text>
      </View>
  );
}
 const styles = StyleSheet.create({
    containerHome:{
        display: 'flex',
        flex: 1,
    }
  });
