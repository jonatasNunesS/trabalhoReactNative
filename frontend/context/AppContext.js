import React, { createContext, useContext, useMemo, useState } from 'react';
import { getTheme } from '../theme/appTheme';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horaSelecionada, setHoraSelecionada] = useState(null);
  const [darkMode, setDarkMode] = useState(false);

  const theme = useMemo(() => getTheme(darkMode), [darkMode]);

  const toggleDarkMode = () => {
    setDarkMode((current) => !current);
  };

  const value = useMemo(
    () => ({
      servicoSelecionado,
      setServicoSelecionado,
      barbeiroSelecionado,
      setBarbeiroSelecionado,
      dataSelecionada,
      setDataSelecionada,
      horaSelecionada,
      setHoraSelecionada,
      darkMode,
      setDarkMode,
      toggleDarkMode,
      theme,
    }),
    [
      servicoSelecionado,
      barbeiroSelecionado,
      dataSelecionada,
      horaSelecionada,
      darkMode,
      theme,
    ]
  );

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export function useAppTheme() {
  const context = useContext(AppContext);

  if (!context) {
    throw new Error('useAppTheme deve ser usado dentro de AppProvider');
  }

  return {
    theme: context.theme,
    darkMode: context.darkMode,
    setDarkMode: context.setDarkMode,
    toggleDarkMode: context.toggleDarkMode,
  };
}
