import React, { useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppTheme } from '../context/AppContext';

export default function LoginPage({ navigation }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [identificador, setIdentificador] = useState('');
  const [senha, setSenha] = useState('');
  const [senhaVisivel, setSenhaVisivel] = useState(false);
  const [erroLogin, setErroLogin] = useState('');

  const getIcone = () => {
    if (!identificador) return '✉';
    const isPhone =
      /^[\d\s()+\-]/.test(identificador) && !identificador.includes('@');
    return isPhone ? '📱' : '✉';
  };

  const getKeyboardType = () => {
    if (!identificador) return 'email-address';
    const isPhone =
      /^[\d\s()+\-]/.test(identificador) && !identificador.includes('@');
    return isPhone ? 'phone-pad' : 'email-address';
  };

  const handleLogin = async () => {
    setErroLogin('');

    if (!identificador || !senha) {
      Alert.alert('Atenção', 'Preencha todos os campos antes de continuar.');
      return;
    }

    try {
      const response = await fetch(
        'http://"Digite seu ip aqui":3000/clientes/login',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            identificador,
            senha,
          }),
        }
      );

      const data = await response.json();

      // 🔥 DEBUG (IMPORTANTE)
      console.log('STATUS:', response.status);
      console.log('DATA:', data);

      // 🔴 ERRO GARANTIDO (backend ou HTTP)
      if (!response.ok || data?.error) {
        const mensagem = data?.error || 'Usuário ou senha inválidos';

        setErroLogin(mensagem);

        console.log('ERRO DETECTADO:', mensagem);

        // 🔥 ALERT GARANTIDO
        setTimeout(() => {
          Alert.alert('Falha no login', mensagem);
        }, 100);

        return;
      }

      await AsyncStorage.setItem(
        'usuarioLogado',
        JSON.stringify(data.cliente)
      );

      Alert.alert(
        'Sucesso',
        `Bem-vindo, ${data.cliente.nome}!`
      );

      navigation.replace('Main');

    } catch (error) {
      console.log(error);

      Alert.alert(
        'Erro',
        'Não foi possível conectar ao servidor.'
      );
    }
  };

  const handleCadastro = () => {
    Alert.alert('Cadastro', 'Funcionalidade em breve!');
  };

  const handleEsqueceuSenha = () => {
    Alert.alert('Recuperar senha', 'Funcionalidade em breve!');
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar
        barStyle={theme.isDark ? 'light-content' : 'dark-content'}
        backgroundColor={theme.background}
      />

      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          <View style={styles.logoArea}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoEmoji}>👽</Text>
            </View>
            <Text style={styles.brandName}>Barbearia Reis</Text>
            <Text style={styles.brandSub}>Klayver</Text>
          </View>

          <View style={styles.divider} />

          {/* LOGIN */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>E-MAIL OU CELULAR</Text>
            <TextInput
              style={styles.input}
              value={identificador}
              onChangeText={setIdentificador}
              placeholder="seu@email.com ou (11) 99999-9999"
              placeholderTextColor={theme.textSoft}
              keyboardType={getKeyboardType()}
            />
          </View>

          {/* SENHA */}
          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>SENHA</Text>
            <TextInput
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              placeholder="••••••••"
              secureTextEntry={!senhaVisivel}
              placeholderTextColor={theme.textSoft}
            />
          </View>

          <TouchableOpacity
            style={styles.btnLogin}
            onPress={handleLogin}
          >
            <Text style={styles.btnLoginText}>Entrar</Text>
          </TouchableOpacity>

          {erroLogin ? (
            <Text style={styles.erroTexto}>{erroLogin}</Text>
          ) : null}

        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    safeArea: { flex: 1, backgroundColor: theme.background },
    flex: { flex: 1 },
    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 24,
    },
    logoArea: { alignItems: 'center', marginBottom: 30 },
    logoIcon: {
      width: 80,
      height: 80,
      borderRadius: 20,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },
    logoEmoji: { fontSize: 34 },
    brandName: { fontSize: 24, fontWeight: '800', color: theme.text },
    brandSub: { fontSize: 12, color: theme.accent },

    divider: { height: 1, backgroundColor: theme.border, marginVertical: 20 },

    fieldWrap: { marginBottom: 16 },

    fieldLabel: {
      fontSize: 12,
      fontWeight: '700',
      color: theme.textMuted,
      marginBottom: 6,
    },

    input: {
      height: 50,
      borderWidth: 1,
      borderColor: theme.border,
      borderRadius: 10,
      paddingHorizontal: 12,
      color: theme.text,
    },

    btnLogin: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 10,
    },

    btnLoginText: {
      color: '#fff',
      fontWeight: '700',
    },

    erroTexto: {
      marginTop: 12,
      textAlign: 'center',
      color: '#ff4d4f',
      fontWeight: '600',
    },
  });
}