import React, { useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";

/* Pages */
import AgendamentoPage from "./AgendamentoPage";
import HorariosPage from "./HorariosPage";

const Stack = createStackNavigator();

export default function HomePage() {
  // estados principais do fluxo
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(null);
  const [dataSelecionada, setDataSelecionada] = useState(null);
  const [horaSelecionada, setHoraSelecionada] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Agendamento">
          {props => (
            <AgendamentoPage
              {...props}
              servicoSelecionado={servicoSelecionado}
              setServicoSelecionado={setServicoSelecionado}
              barbeiroSelecionado={barbeiroSelecionado}
              setBarbeiroSelecionado={setBarbeiroSelecionado}
            />
          )}
        </Stack.Screen>
        <Stack.Screen name="Horarios">
          {props => (
            <HorariosPage
              {...props}
              servicoSelecionado={servicoSelecionado}
              dataSelecionada={dataSelecionada}
              setDataSelecionada={setDataSelecionada}
              horaSelecionada={horaSelecionada}
              setHoraSelecionada={setHoraSelecionada}
              barbeiroSelecionado={barbeiroSelecionado}
            />
          )}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
