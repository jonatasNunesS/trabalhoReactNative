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

import { useAppTheme } from '../context/AppContext';

export default function CadastroPage({ navigation }) {
  const { theme } = useAppTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const [nome, setNome] = useState('');
  const [email, setEmail] = useState('');
  const [telefone, setTelefone] = useState('');
  const [senha, setSenha] = useState('');
  const [confirmarSenha, setConfirmarSenha] = useState('');
  const [erroCadastro, setErroCadastro] = useState('');
  const [loading, setLoading] = useState(false);

  const validarEmail = (email) => {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
  };

  const formatarTelefone = (texto) => {
    const numeros = texto.replace(/\D/g, '').slice(0, 11);

    if (numeros.length <= 2) {
      return numeros.length ? `(${numeros}` : '';
    }

    if (numeros.length <= 7) {
      return `(${numeros.slice(0, 2)}) ${numeros.slice(2)}`;
    }

    return `(${numeros.slice(0, 2)}) ${numeros.slice(
      2,
      7
    )}-${numeros.slice(7, 11)}`;
  };

  const handleTelefoneChange = (texto) => {
    setTelefone(formatarTelefone(texto));
  };

  const handleCadastro = async () => {
    setErroCadastro('');

    if (!nome || !email || !senha || !confirmarSenha) {
      Alert.alert('Atenção', 'Preencha todos os campos obrigatórios.');
      return;
    }

    if (!validarEmail(email)) {
      setErroCadastro('Digite um e-mail válido.');
      return;
    }

    const telefoneNumerico = telefone.replace(/\D/g, '');

    if (telefone && telefoneNumerico.length < 10) {
      setErroCadastro('Digite um celular válido.');
      return;
    }

    if (senha !== confirmarSenha) {
      setErroCadastro('As senhas não coincidem.');
      return;
    }

    if (senha.length < 6) {
      setErroCadastro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(
        'http://seu ip:3000/clientes',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            nome,
            email,
            senha,
            telefone: telefoneNumerico,
          }),
        }
      );

      const data = await response.json();

      console.log('STATUS:', response.status);
      console.log('DATA:', data);

      if (!response.ok || data?.error) {
        const mensagem =
          data?.error || 'Erro ao criar conta. Tente novamente.';
        setErroCadastro(mensagem);
        return;
      }

      Alert.alert(
        'Conta criada!',
        'Seu cadastro foi realizado com sucesso. Faça login para continuar.',
        [
          {
            text: 'Fazer login',
            onPress: () => navigation.goBack(),
          },
        ]
      );
    } catch (error) {
      console.log(error);
      Alert.alert('Erro', 'Não foi possível conectar ao servidor.');
    } finally {
      setLoading(false);
    }
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
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.backButtonText}>← Voltar</Text>
          </TouchableOpacity>

          <View style={styles.logoArea}>
            <View style={styles.logoIcon}>
              <Text style={styles.logoEmoji}>👽</Text>
            </View>

            <Text style={styles.brandName}>Barbearia Reis</Text>
            <Text style={styles.brandSub}>Criar nova conta</Text>
          </View>

          <View style={styles.divider} />

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>NOME COMPLETO *</Text>
            <TextInput
              style={styles.input}
              value={nome}
              onChangeText={setNome}
              placeholder="Seu nome completo"
              placeholderTextColor={theme.textSoft}
              autoCapitalize="words"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>E-MAIL *</Text>
            <TextInput
              style={styles.input}
              value={email}
              onChangeText={setEmail}
              placeholder="seu@email.com"
              placeholderTextColor={theme.textSoft}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>CELULAR</Text>
            <TextInput
              style={styles.input}
              value={telefone}
              onChangeText={handleTelefoneChange}
              placeholder="(31) 99999-9999"
              placeholderTextColor={theme.textSoft}
              keyboardType="number-pad"
              maxLength={15}
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>SENHA *</Text>
            <TextInput
              style={styles.input}
              value={senha}
              onChangeText={setSenha}
              placeholder="Mínimo 6 caracteres"
              secureTextEntry
              placeholderTextColor={theme.textSoft}
            />
          </View>

          <View style={styles.fieldWrap}>
            <Text style={styles.fieldLabel}>CONFIRMAR SENHA *</Text>
            <TextInput
              style={styles.input}
              value={confirmarSenha}
              onChangeText={setConfirmarSenha}
              placeholder="Repita a senha"
              secureTextEntry
              placeholderTextColor={theme.textSoft}
            />
          </View>

          {erroCadastro ? (
            <Text style={styles.erroTexto}>{erroCadastro}</Text>
          ) : null}

          <TouchableOpacity
            style={[styles.btnCadastro, loading && styles.btnDesabilitado]}
            onPress={handleCadastro}
            disabled={loading}
          >
            <Text style={styles.btnCadastroText}>
              {loading ? 'Criando conta...' : 'Criar conta'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.btnVoltar}
            onPress={() => navigation.goBack()}
          >
            <Text style={styles.btnVoltarText}>Já tenho uma conta</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

function createStyles(theme) {
  return StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.background,
    },

    flex: {
      flex: 1,
    },

    scrollContent: {
      flexGrow: 1,
      justifyContent: 'center',
      padding: 24,
    },

    backButton: {
      position: 'absolute',
      top: 20,
      left: 20,
      zIndex: 10,
    },

    backButtonText: {
      color: theme.primary,
      fontSize: 16,
      fontWeight: '700',
    },

    logoArea: {
      alignItems: 'center',
      marginBottom: 30,
    },

    logoIcon: {
      width: 80,
      height: 80,
      borderRadius: 20,
      backgroundColor: theme.primary,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 10,
    },

    logoEmoji: {
      fontSize: 34,
    },

    brandName: {
      fontSize: 24,
      fontWeight: '800',
      color: theme.text,
    },

    brandSub: {
      fontSize: 12,
      color: theme.accent,
    },

    divider: {
      height: 1,
      backgroundColor: theme.border,
      marginVertical: 20,
    },

    fieldWrap: {
      marginBottom: 16,
    },

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

    erroTexto: {
      marginTop: 4,
      marginBottom: 8,
      textAlign: 'center',
      color: '#ff4d4f',
      fontWeight: '600',
    },

    btnCadastro: {
      backgroundColor: theme.primary,
      padding: 15,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 10,
    },

    btnDesabilitado: {
      opacity: 0.6,
    },

    btnCadastroText: {
      color: '#fff',
      fontWeight: '700',
    },

    btnVoltar: {
      padding: 15,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 10,
      borderWidth: 1,
      borderColor: theme.border,
    },

    btnVoltarText: {
      color: theme.textMuted,
      fontWeight: '700',
    },
  });
}