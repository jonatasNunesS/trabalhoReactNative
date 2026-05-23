import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { getInitials } from '../utils/formatters';

export default function Avatar({ size = 64, name = '', photoUrl = '', style }) {
  if (photoUrl) {
    return (
      <Image
        source={{ uri: photoUrl }}
        style={[styles.image, { width: size, height: size, borderRadius: size / 2 }, style]}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        { width: size, height: size, borderRadius: size / 2 },
        style,
      ]}
    >
      <Text style={[styles.fallbackText, { fontSize: Math.max(16, size * 0.28) }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#E5E7EB',
  },
  fallback: {
    backgroundColor: '#D1D5DB',
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    color: '#374151',
    fontWeight: '800',
  },
});
