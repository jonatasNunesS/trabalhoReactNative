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

// ─── Chave de persistência ─────────────────────────────────────────────────
const THEME_STORAGE_KEY = 'app_theme';

// ─── Contexto global ───────────────────────────────────────────────────────
export const AppContext = createContext();

// ─── Provider ──────────────────────────────────────────────────────────────
export const AppProvider = ({ children }) => {
  // Estado do fluxo de agendamento
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horaSelecionada, setHoraSelecionada] = useState(null);

  // Estado do tema
  const [darkMode, setDarkMode] = useState(false);
  // themeLoaded impede o flash de tema incorreto ao iniciar o app:
  // a UI só é renderizada após a preferência salva ter sido lida do AsyncStorage.
  const [themeLoaded, setThemeLoaded] = useState(false);

  // ── Restaurar tema salvo no boot ──────────────────────────────────────
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        // Se não houver valor salvo, mantém o padrão claro (false).
        if (saved === 'dark') {
          setDarkMode(true);
        }
      } catch (e) {
        // Em caso de erro de leitura, usa o padrão claro sem travar o app.
        console.warn('[AppContext] Erro ao ler tema salvo:', e);
      } finally {
        setThemeLoaded(true);
      }
    })();
  }, []);

  // ── Objeto de tema derivado ────────────────────────────────────────────
  const theme = useMemo(() => getTheme(darkMode), [darkMode]);

  // ── Alternar tema e persistir a escolha ───────────────────────────────
  const toggleDarkMode = useCallback(async () => {
    setDarkMode((current) => {
      const next = !current;
      // Persiste de forma assíncrona sem bloquear a atualização de estado
      AsyncStorage.setItem(THEME_STORAGE_KEY, next ? 'dark' : 'light').catch((e) =>
        console.warn('[AppContext] Erro ao salvar tema:', e)
      );
      return next;
    });
  }, []);

  // ── setDarkMode com persistência (para uso direto se necessário) ───────
  const setDarkModeWithPersist = useCallback(async (value) => {
    setDarkMode(value);
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, value ? 'dark' : 'light');
    } catch (e) {
      console.warn('[AppContext] Erro ao salvar tema:', e);
    }
  }, []);

  // ── Valor do contexto ──────────────────────────────────────────────────
  const value = useMemo(
    () => ({
      // Agendamento
      servicoSelecionado,
      setServicoSelecionado,
      barbeiroSelecionado,
      setBarbeiroSelecionado,
      dataSelecionada,
      setDataSelecionada,
      horaSelecionada,
      setHoraSelecionada,
      // Tema
      darkMode,
      setDarkMode: setDarkModeWithPersist,
      toggleDarkMode,
      theme,
      themeLoaded,
    }),
    [
      servicoSelecionado,
      barbeiroSelecionado,
      dataSelecionada,
      horaSelecionada,
      darkMode,
      theme,
      themeLoaded,
      toggleDarkMode,
      setDarkModeWithPersist,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

// ─── Hook de tema (usado por componentes e páginas) ────────────────────────
export function useAppTheme() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppTheme deve ser usado dentro de AppProvider');
  }

  return {
    theme: context.theme,
    darkMode: context.darkMode,
    isDarkMode: context.darkMode,
    themeLoaded: context.themeLoaded,
    setDarkMode: context.setDarkMode,
    toggleDarkMode: context.toggleDarkMode,
  };
}
