import React, {createContext, useState} from "react";
export const AppContext = createContext();  

export const AppProvider = ({ children }) => {
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horaSelecionada, setHoraSelecionada] = useState(null);

  return (
    <AppContext.Provider
      value={{
        servicoSelecionado,
        setServicoSelecionado,
        barbeiroSelecionado,
        setBarbeiroSelecionado,
        dataSelecionada,
        setDataSelecionada,
        horaSelecionada,
        setHoraSelecionada,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
