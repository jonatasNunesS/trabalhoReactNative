import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { colors, radius, spacing } from '../theme/appTheme';

export default function FlowHeader({
  title,
  subtitle,
  currentStep,
  totalSteps,
  onBack,
}) {
  const progressPercentage =
    currentStep && totalSteps ? Math.min(100, Math.max(0, (currentStep / totalSteps) * 100)) : 0;

  return (
    <View style={styles.header}>
      {onBack ? (
        <TouchableOpacity style={styles.backButton} activeOpacity={0.85} onPress={onBack}>
          <Text style={styles.backButtonText}>‹</Text>
        </TouchableOpacity>
      ) : null}

      <View style={styles.content}>
        <Text style={styles.title} numberOfLines={1}>
          {title}
        </Text>
        {subtitle ? (
          <Text style={styles.subtitle} numberOfLines={2}>
            {subtitle}
          </Text>
        ) : null}

        {currentStep && totalSteps ? (
          <View style={styles.progressWrap}>
            <View style={styles.progressMetaRow}>
              <Text style={styles.progressLabel}>Etapa do agendamento</Text>
              <Text style={styles.progressValue}>
                {currentStep}/{totalSteps}
              </Text>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: `${progressPercentage}%` }]} />
            </View>
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.lg,
    paddingBottom: spacing.xl,
  },
  backButton: {
    width: 44,
    height: 44,
    borderRadius: radius.pill,
    backgroundColor: 'rgba(255,255,255,0.14)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: spacing.md,
  },
  backButtonText: {
    color: colors.white,
    fontSize: 28,
    lineHeight: 28,
    fontWeight: '700',
    marginTop: -2,
  },
  content: {
    gap: spacing.sm,
  },
  title: {
    color: colors.white,
    fontSize: 28,
    fontWeight: '800',
  },
  subtitle: {
    color: 'rgba(255,255,255,0.84)',
    fontSize: 14,
    lineHeight: 20,
  },
  progressWrap: {
    marginTop: spacing.sm,
  },
  progressMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: {
    color: 'rgba(255,255,255,0.84)',
    fontSize: 12,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  progressValue: {
    color: colors.white,
    fontSize: 13,
    fontWeight: '800',
  },
  progressTrack: {
    height: 10,
    borderRadius: radius.pill,
    backgroundColor: colors.primaryDark,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
  },
});
