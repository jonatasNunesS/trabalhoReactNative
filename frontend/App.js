import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import { useFonts,Poppins_400Regular,Poppins_600SemiBold, } from "@expo-google-fonts/poppins";
/* Pages */
import HomePage from "./pages/HomePage";
import PerfilPage from "./pages/PerfilPage";
import ConfiguracoesPage from "./pages/ConfigPage";
import AgendamentoPage from "./pages/AgendamentoPage";
import HorariosPage from "./pages/HorariosPage";


const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AgendamentoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Agendamento" component={AgendamentoPage} />
      <Stack.Screen name="Horarios" component={HorariosPage} />
      {/* você pode adicionar ConfirmacaoPage aqui */}
    </Stack.Navigator>
  );
}

export default function App() {
  const [servicoSelecionado, setServicoSelecionado] = useState(null);
  const [barbeiroSelecionado, setBarbeiroSelecionado] = useState(null);

  /* Fontes */
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={{
          headerShown: false,
          tabBarStyle: {
            backgroundColor: "#ffffff",
            borderTopWidth: 1,
            borderTopColor: "#e0e0e0",
            paddingVertical: 8,
            paddingHorizontal: 12,
          },
          tabBarActiveTintColor: "#fff",
          tabBarInactiveTintColor: "#aaa",
          tabBarLabelStyle: {
            fontFamily: "Poppins_600SemiBold",
            fontSize: 12,
            shadowColor: "# 000",
            color: "#333",
          },
        }}
      >
        <Tab.Screen name="Home">
          {(props) => (
            <HomePage
              {...props}
              servicoSelecionado={servicoSelecionado}
              setServicoSelecionado={setServicoSelecionado}
              barbeiroSelecionado={barbeiroSelecionado}
              setBarbeiroSelecionado={setBarbeiroSelecionado}
            />
          )}

        </Tab.Screen>
        <Tab.Screen name="Perfil" component={PerfilPage} />
        <Tab.Screen name="Configurações" component={ConfiguracoesPage} />
        <Tab.Screen name="Agendamento" component={AgendamentoStack} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  containerHome: {
    flex: 1,
    display: "flex",
  },
});
