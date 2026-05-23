import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

export default function BrandFooter({ brandName, tagline }) {
  return (
    <View style={styles.container}>
      <Text style={styles.poweredText}>Tecnologia por {brandName}</Text>
      {tagline ? <Text style={styles.tagline}>{tagline}</Text> : null}
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
    color: '#6B7280',
    fontWeight: '700',
  },
  tagline: {
    marginTop: 2,
    fontSize: 11,
    color: '#9CA3AF',
  },
});
