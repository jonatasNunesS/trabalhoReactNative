import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { StyleSheet } from "react-native";
import { AppProvider } from "./context/AppContext";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
} from "@expo-google-fonts/poppins";

/* Pages */
import HomePage from "./pages/HomePage";
import PerfilPage from "./pages/perfilPage";
<<<<<<< HEAD
import ConfiguracoesPage from "./pages/configPage";
=======
import ConfiguracoesPage from "./pages/ConfigPage";
>>>>>>> bfa9361256feb7f5d6f22778c763b31320327576
import AgendamentoPage from "./pages/AgendamentoPage";
import ProfissionalSelecaoPage from "./pages/ProfissionalSelecaoPage";
import HorariosPage from "./pages/HorariosPage";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

function AgendamentoStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Agendamento" component={AgendamentoPage} />
<<<<<<< HEAD
      
      <Stack.Screen name="Horarios" component={HorariosPage} />
      {/* você pode adicionar ConfirmacaoPage aqui */}
=======
      <Stack.Screen
        name="ProfissionalSelecao"
        component={ProfissionalSelecaoPage}
        options={{ presentation: "modal" }}
      />
      <Stack.Screen
        name="Horarios"
        component={HorariosPage}
        options={{ presentation: "modal" }}
      />
>>>>>>> bfa9361256feb7f5d6f22778c763b31320327576
    </Stack.Navigator>
  );
}

export default function App() {
  /* Fontes */
  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
  });
  if (!fontsLoaded) {
    return null;
  }
  return (
    <SafeAreaProvider>
      <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
        <AppProvider>
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
                  shadowColor: "#000",
                  color: "#333",
                },
              }}
            >
              <Tab.Screen name="Home" component={HomePage} />
              <Tab.Screen name="Perfil" component={PerfilPage} />
              <Tab.Screen name="Configurações" component={ConfiguracoesPage} />
              <Tab.Screen name="Agendamento" component={AgendamentoStack} />
            </Tab.Navigator>
          </NavigationContainer>
        </AppProvider>
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

const styles = StyleSheet.create({
  containerHome: {
    flex: 1,
    display: "flex",
  },
});
