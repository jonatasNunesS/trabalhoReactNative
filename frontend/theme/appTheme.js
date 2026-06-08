// ─── Paleta de cores-base ──────────────────────────────────────────────────
export const palette = {
  primary: '#1E40AF',
  primaryDark: '#1E3A8A',
  accent: '#22B8B0',
  white: '#FFFFFF',
  black: '#000000',
};

// ─── Alias estático para componentes que não consomem tema dinâmico ────────
// (usado por FlowHeader, que tem header sempre na cor primária fixa)
export const colors = {
  primary: palette.primary,
  primaryDark: palette.primaryDark,
  accent: palette.accent,
  white: palette.white,
  black: palette.black,
};

// ─── Espaçamentos e raios centralizados ───────────────────────────────────
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  pill: 999,
};

// ─── Tema Claro ────────────────────────────────────────────────────────────
export const lightTheme = {
  isDark: false,
  statusBar: 'dark-content',
  background: '#F8FAFC',
  backgroundSecondary: '#F1F5F9',
  surface: '#FFFFFF',
  surfaceElevated: '#FFFFFF',
  surfaceMuted: '#EFF6FF',
  text: '#0F172A',
  textSecondary: '#334155',
  textMuted: '#64748B',
  textSoft: '#94A3B8',
  primary: palette.primary,
  primaryDark: palette.primaryDark,
  accent: palette.accent,
  accentSurface: '#E6FFFB',
  successSurface: '#DDF5F3',
  successText: '#0F766E',
  border: '#E2E8F0',
  borderStrong: '#CBD5E1',
  divider: '#D1D5DB',
  tabBarBackground: '#FFFFFF',
  tabBarBorder: '#E2E8F0',
  shadow: '#000000',
  overlay: 'rgba(15, 23, 42, 0.08)',
};

// ─── Tema Escuro ───────────────────────────────────────────────────────────
export const darkTheme = {
  isDark: true,
  statusBar: 'light-content',
  background: '#0B1220',
  backgroundSecondary: '#111827',
  surface: '#111827',
  surfaceElevated: '#1F2937',
  surfaceMuted: '#172554',
  text: '#F8FAFC',
  textSecondary: '#E5E7EB',
  textMuted: '#94A3B8',
  textSoft: '#64748B',
  primary: palette.primary,
  primaryDark: palette.primaryDark,
  accent: palette.accent,
  accentSurface: 'rgba(34, 184, 176, 0.16)',
  successSurface: 'rgba(34, 184, 176, 0.18)',
  successText: '#5EEAD4',
  border: '#334155',
  borderStrong: '#475569',
  divider: '#243244',
  tabBarBackground: '#111827',
  tabBarBorder: '#243244',
  shadow: '#000000',
  overlay: 'rgba(15, 23, 42, 0.3)',
};

// ─── Seletor de tema ───────────────────────────────────────────────────────
export function getTheme(darkMode) {
  return darkMode ? darkTheme : lightTheme;
}
