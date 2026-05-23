import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet, Text, View } from 'react-native';
import Avatar from '../components/Avatar';
import { useAppTheme } from '../context/AppContext';

export default function PerfilPage() {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />

      <View style={styles.card}>
        <Avatar size={78} name="Cliente" />
        <Text style={styles.title}>Seu perfil</Text>
        <Text style={styles.subtitle}>
          Área preparada para exibir seus dados, histórico de horários e preferências futuras.
        </Text>
      </View>

      <View style={styles.infoCard}>
        <Text style={styles.infoLabel}>Status atual</Text>
        <Text style={styles.infoValue}>Perfil em construção</Text>
        <Text style={styles.infoText}>
          Esta aba pode receber informações pessoais, métodos de contato e histórico de atendimentos.
        </Text>
      </View>
    </SafeAreaView>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.background,
      paddingHorizontal: 20,
      paddingTop: 20,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 22,
      padding: 22,
      alignItems: 'center',
      borderWidth: 1,
      borderColor: theme.border,
      marginBottom: 18,
    },
    title: {
      marginTop: 14,
      color: theme.text,
      fontSize: 24,
      fontWeight: '800',
    },
    subtitle: {
      marginTop: 8,
      color: theme.textMuted,
      textAlign: 'center',
      lineHeight: 22,
    },
    infoCard: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.border,
    },
    infoLabel: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: 6,
    },
    infoValue: {
      color: theme.primary,
      fontSize: 18,
      fontWeight: '800',
      marginBottom: 10,
    },
    infoText: {
      color: theme.textSecondary,
      lineHeight: 22,
    },
  });
}
