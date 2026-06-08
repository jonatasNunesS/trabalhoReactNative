import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Alert, StatusBar, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Avatar from '../components/Avatar';
import { useAppTheme, useAppAuth } from '../context/AppContext';

export default function PerfilPage() {
  const { theme } = useAppTheme();
  const { usuarioLogado, isAdmin, logout } = useAppAuth();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const nomeDisplay = usuarioLogado?.nome || 'Usuário';
  const emailDisplay = usuarioLogado?.email || '';
  const telefoneDisplay = usuarioLogado?.telefone || '';

  const handleLogout = () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Sair',
          style: 'destructive',
          onPress: async () => {
            await logout();
            // App.js detecta usuarioLogado = null e redireciona para Login automaticamente
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <View style={styles.card}>
        <Avatar size={78} name={nomeDisplay} />
        <Text style={styles.name}>{nomeDisplay}</Text>
        {emailDisplay ? <Text style={styles.detail}>{emailDisplay}</Text> : null}
        {telefoneDisplay ? <Text style={styles.detail}>{telefoneDisplay}</Text> : null}
        <View style={styles.badgeWrap}>
          <Text style={[styles.badge, isAdmin ? styles.badgeAdmin : styles.badgeCliente]}>
            {isAdmin ? 'Administrador' : 'Cliente'}
          </Text>
        </View>
      </View>

      <TouchableOpacity style={styles.btnLogout} onPress={handleLogout} activeOpacity={0.85}>
        <Text style={styles.btnLogoutText}>Sair da conta</Text>
      </TouchableOpacity>
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
    name: {
      marginTop: 14,
      color: theme.text,
      fontSize: 22,
      fontWeight: '800',
    },
    detail: {
      marginTop: 4,
      color: theme.textMuted,
      fontSize: 14,
    },
    badgeWrap: {
      marginTop: 14,
    },
    badge: {
      paddingHorizontal: 16,
      paddingVertical: 5,
      borderRadius: 20,
      fontSize: 12,
      fontWeight: '700',
      overflow: 'hidden',
    },
    badgeAdmin: {
      backgroundColor: theme.primary + '33',
      color: theme.primary,
    },
    badgeCliente: {
      backgroundColor: theme.border,
      color: theme.textMuted,
    },
    btnLogout: {
      marginTop: 'auto',
      marginBottom: 10,
      backgroundColor: '#ef4444',
      borderRadius: 14,
      padding: 16,
      alignItems: 'center',
    },
    btnLogoutText: {
      color: '#fff',
      fontWeight: '700',
      fontSize: 16,
    },
  });
}
