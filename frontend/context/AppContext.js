import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getTheme } from '../theme/appTheme';

const THEME_STORAGE_KEY = 'app_theme';
const AUTH_USER_KEY = 'usuarioLogado';
const AUTH_TOKEN_KEY = 'authToken';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  // ── Agendamento ────────────────────────────────────────────────────────
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horaSelecionada, setHoraSelecionada] = useState(null);

  // ── Tema ───────────────────────────────────────────────────────────────
  const [darkMode, setDarkMode] = useState(false);
  const [themeLoaded, setThemeLoaded] = useState(false);

  // ── Auth ───────────────────────────────────────────────────────────────
  const [usuarioLogado, setUsuarioLogado] = useState(null);
  const [authToken, setAuthToken] = useState(null);
  const [authLoaded, setAuthLoaded] = useState(false);

  // ── Inicialização única: tema + sessão ─────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const [savedTheme, savedUser, savedToken] = await Promise.all([
          AsyncStorage.getItem(THEME_STORAGE_KEY),
          AsyncStorage.getItem(AUTH_USER_KEY),
          AsyncStorage.getItem(AUTH_TOKEN_KEY),
        ]);
        if (savedTheme === 'dark') setDarkMode(true);
        if (savedUser) {
          try { setUsuarioLogado(JSON.parse(savedUser)); } catch {}
        }
        if (savedToken) setAuthToken(savedToken);
      } catch (e) {
        console.warn('[AppContext] Erro ao inicializar:', e);
      } finally {
        setThemeLoaded(true);
        setAuthLoaded(true);
      }
    })();
  }, []);

  // ── Tema ───────────────────────────────────────────────────────────────
  const theme = useMemo(() => getTheme(darkMode), [darkMode]);

  const toggleDarkMode = useCallback(async () => {
    setDarkMode((current) => {
      const next = !current;
      AsyncStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light').catch((e) =>
        console.warn('[AppContext] Erro ao salvar tema:', e)
      );
      return next;
    });
  }, []);

  const setDarkModeWithPersist = useCallback(async (value) => {
    setDarkMode(value);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, value ? 'dark' : 'light');
    } catch (e) {
      console.warn('[AppContext] Erro ao salvar tema:', e);
    }
  }, []);

  // ── Auth ───────────────────────────────────────────────────────────────
  const login = useCallback(async (usuario, token) => {
    setUsuarioLogado(usuario);
    setAuthToken(token || null);
    const ops = [AsyncStorage.setItem(AUTH_USER_KEY, JSON.stringify(usuario))];
    if (token) ops.push(AsyncStorage.setItem(AUTH_TOKEN_KEY, token));
    else ops.push(AsyncStorage.removeItem(AUTH_TOKEN_KEY));
    await Promise.all(ops).catch((e) =>
      console.warn('[AppContext] Erro ao salvar sessão:', e)
    );
  }, []);

  const logout = useCallback(async () => {
    setUsuarioLogado(null);
    setAuthToken(null);
    await AsyncStorage.multiRemove([AUTH_USER_KEY, AUTH_TOKEN_KEY]).catch((e) =>
      console.warn('[AppContext] Erro ao limpar sessão:', e)
    );
  }, []);

  const isAdmin = Boolean(usuarioLogado?.is_admin);

  // ── Valor do contexto ──────────────────────────────────────────────────
  const value = useMemo(
    () => ({
      // Agendamento
      servicoSelecionado, setServicoSelecionado,
      barbeiroSelecionado, setBarbeiroSelecionado,
      dataSelecionada, setDataSelecionada,
      horaSelecionada, setHoraSelecionada,
      // Tema
      darkMode, setDarkMode: setDarkModeWithPersist, toggleDarkMode, theme, themeLoaded,
      // Auth
      usuarioLogado, authToken, authLoaded, isAdmin, login, logout,
    }),
    [
      servicoSelecionado, barbeiroSelecionado, dataSelecionada, horaSelecionada,
      darkMode, theme, themeLoaded, toggleDarkMode, setDarkModeWithPersist,
      usuarioLogado, authToken, authLoaded, isAdmin, login, logout,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ─── Hook de tema ──────────────────────────────────────────────────────────────
export function useAppTheme() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppTheme deve ser usado dentro de AppProvider');
  return {
    theme: context.theme,
    darkMode: context.darkMode,
    isDarkMode: context.darkMode,
    themeLoaded: context.themeLoaded,
    setDarkMode: context.setDarkMode,
    toggleDarkMode: context.toggleDarkMode,
  };
}

// ─── Hook de autenticação ──────────────────────────────────────────────────────
export function useAppAuth() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppAuth deve ser usado dentro de AppProvider');
  return {
    usuarioLogado: context.usuarioLogado,
    isAdmin: context.isAdmin,
    authLoaded: context.authLoaded,
    login: context.login,
    logout: context.logout,
  };
}
