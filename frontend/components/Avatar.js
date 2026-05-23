import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import { getInitials } from '../utils/formatters';
import { useAppTheme } from '../context/AppContext';

export default function Avatar({ size = 64, name = '', photoUrl = '', style }) {
  const { theme } = useAppTheme();

  if (photoUrl) {
    return (
      <Image
        source={{ uri: photoUrl }}
        style={[
          styles.image,
          { width: size, height: size, borderRadius: size / 2, backgroundColor: theme.border },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallback,
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: theme.isDark ? theme.surfaceElevated : '#D1D5DB',
        },
        style,
      ]}
    >
      <Text
        style={[
          styles.fallbackText,
          { fontSize: Math.max(16, size * 0.28), color: theme.textSecondary },
        ]}
      >
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
    alignItems: 'center',
    justifyContent: 'center',
  },
  fallbackText: {
    fontWeight: '800',
  },
});
