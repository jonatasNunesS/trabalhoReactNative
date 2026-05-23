import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { useAppTheme } from '../context/AppContext';

export default function BrandFooter({ brandName, tagline }) {
  const { theme } = useAppTheme();

  return (
    <View style={styles.container}>
      <Text style={[styles.poweredText, { color: theme.textMuted }]}>Tecnologia por {brandName}</Text>
      {tagline ? <Text style={[styles.tagline, { color: theme.textSoft }]}>{tagline}</Text> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    alignItems: 'center',
    paddingTop: 4,
    paddingBottom: 12,
  },
  poweredText: {
    fontSize: 12,
    fontWeight: '700',
  },
  tagline: {
    marginTop: 2,
    fontSize: 11,
  },
});
