import React, { useMemo } from 'react';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar, StyleSheet, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useAppTheme } from '../context/AppContext';

export default function ConfiguracoesPage() {
  const { theme, darkMode, toggleDarkMode } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle={theme.statusBar} backgroundColor={theme.background} />

      <View style={styles.header}>
        <Text style={styles.eyebrow}>Preferências</Text>
        <Text style={styles.title}>Configurações</Text>
        <Text style={styles.subtitle}>
          Ajuste a aparência do aplicativo conforme o ambiente e sua preferência visual.
        </Text>
      </View>

      <View style={styles.card}>
        <View style={styles.settingRow}>
          <View style={styles.iconWrap}>
            <Ionicons name={darkMode ? 'moon' : 'sunny'} size={22} color={theme.primary} />
          </View>

          <View style={styles.settingContent}>
            <Text style={styles.settingTitle}>Tema escuro</Text>
            <Text style={styles.settingDescription}>
              Ative para usar o aplicativo com fundo escuro em todas as telas principais.
            </Text>
          </View>

          <Switch
            value={darkMode}
            onValueChange={toggleDarkMode}
            trackColor={{ false: theme.borderStrong, true: theme.primary }}
            thumbColor="#FFFFFF"
          />
        </View>
      </View>

      <View style={styles.previewCard}>
        <Text style={styles.previewLabel}>Pré-visualização</Text>
        <View style={styles.previewSurface}>
          <View style={styles.previewHeader}>
            <Text style={styles.previewHeaderText}>{darkMode ? 'Tema escuro ativo' : 'Tema claro ativo'}</Text>
          </View>
          <View style={styles.previewBody}>
            <View style={styles.previewChip}>
              <Text style={styles.previewChipText}>Cor principal mantida</Text>
            </View>
            <Text style={styles.previewBodyText}>
              A identidade azul do projeto foi preservada, com adaptação do contraste para o modo escuro.
            </Text>
          </View>
        </View>
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
      paddingTop: 16,
    },
    header: {
      marginBottom: 20,
    },
    eyebrow: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: 0.6,
      marginBottom: 6,
    },
    title: {
      color: theme.text,
      fontSize: 28,
      fontWeight: '800',
      marginBottom: 8,
    },
    subtitle: {
      color: theme.textSecondary,
      lineHeight: 22,
      fontSize: 14,
    },
    card: {
      backgroundColor: theme.surface,
      borderRadius: 18,
      padding: 18,
      borderWidth: 1,
      borderColor: theme.border,
      shadowColor: theme.shadow,
      shadowOpacity: theme.isDark ? 0.16 : 0.05,
      shadowRadius: 6,
      shadowOffset: { width: 0, height: 3 },
      elevation: 2,
    },
    settingRow: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    iconWrap: {
      width: 48,
      height: 48,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.surfaceMuted,
      marginRight: 14,
    },
    settingContent: {
      flex: 1,
      paddingRight: 12,
    },
    settingTitle: {
      color: theme.text,
      fontSize: 17,
      fontWeight: '800',
      marginBottom: 4,
    },
    settingDescription: {
      color: theme.textMuted,
      fontSize: 13,
      lineHeight: 19,
    },
    previewCard: {
      marginTop: 18,
    },
    previewLabel: {
      color: theme.textMuted,
      fontSize: 12,
      fontWeight: '700',
      textTransform: 'uppercase',
      marginBottom: 10,
      letterSpacing: 0.6,
    },
    previewSurface: {
      backgroundColor: theme.surface,
      borderRadius: 20,
      overflow: 'hidden',
      borderWidth: 1,
      borderColor: theme.border,
    },
    previewHeader: {
      backgroundColor: theme.primary,
      paddingHorizontal: 16,
      paddingVertical: 14,
    },
    previewHeaderText: {
      color: '#FFFFFF',
      fontWeight: '800',
      fontSize: 16,
    },
    previewBody: {
      padding: 16,
    },
    previewChip: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      backgroundColor: theme.accentSurface,
      marginBottom: 12,
    },
    previewChipText: {
      color: theme.successText,
      fontWeight: '700',
      fontSize: 12,
    },
    previewBodyText: {
      color: theme.textSecondary,
      lineHeight: 21,
    },
  });
}
