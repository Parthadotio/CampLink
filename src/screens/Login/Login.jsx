import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import axios from '../../utils/axios.js';
import { useAuth } from '../../context/userAuth.jsx';
import { colors } from '../../theme/colors.js';

const Login = () => {
  const navigation = useNavigation();
  const { login } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  function submitHandler() {
    axios
      .post('/auth/login', {
        email,
        password,
      })
      .then(res => {
        login(res.data?.token, res.data?.user);
        console.log('token:', res.data?.token);
        console.log('user:', res.data?.user);
      })
      .catch(err => {
        console.log(err.response?.data);
      });
  }

  return (
    <View style={styles.gradient}>
      <SafeAreaView style={styles.safe}>
        <KeyboardAvoidingView
          style={styles.flex}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
          <ScrollView
            contentContainerStyle={styles.scroll}
            keyboardShouldPersistTaps="handled"
          >
            <View style={styles.logoContainer}>
              <View style={styles.appImageContainer}>
                <Image
                  source={require('../../../assets/log-transparent.png')}
                  style={styles.appImage}
                  resizeMode="contain"
                />
              </View>
              <Text style={styles.appName}>CampLink</Text>
              <Text style={styles.tagline}>Your campus, connected.</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Welcome Back</Text>
              <View style={styles.inputRow}>
                <View style={styles.iconCircle}>
                  <Icon name="mail" size={18} color={colors.primary} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="e-mail"
                  placeholderTextColor={colors.textSecondary}
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                />
              </View>
              <View style={styles.inputRow}>
                <View style={styles.iconCircle}>
                  <Icon name="lock" size={18} color={colors.primary} />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="password"
                  placeholderTextColor={colors.textSecondary}
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                  autoComplete="password"
                  textContentType="password"
                />
                <TouchableOpacity
                  style={styles.passwordToggle}
                  onPress={() => setShowPassword(prev => !prev)}
                  activeOpacity={0.7}
                >
                  <Icon
                    name={showPassword ? 'eye-off' : 'eye'}
                    size={18}
                    color={colors.textSecondary}
                  />
                </TouchableOpacity>
              </View>
              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.85}
                onPress={submitHandler}
              >
                <Text style={styles.buttonText}>Sign In</Text>
              </TouchableOpacity>
              <View style={styles.redirectRow}>
                <Text style={styles.redirectText}>Don't have an account? </Text>
                <TouchableOpacity
                  onPress={() => navigation.navigate('Register')}
                >
                  <Text style={styles.redirectLink}>Register</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  gradient: { flex: 1, backgroundColor: colors.background },
  safe: { flex: 1 },
  flex: { flex: 1 },

  scroll: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: 24,
    paddingVertical: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 36,
  },
  appImageContainer: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: colors.border,
  },
  appImage: {
    height: 60,
    width: 90,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 13,
    color: colors.textSecondary,
    marginTop: 4,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 24,
    borderWidth: 1,
    borderColor: colors.border,
    padding: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textPrimary,
    marginBottom: 20,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: colors.background,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 6,
    elevation: 4,
  },

  textInput: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    paddingVertical: 0,
  },
  passwordToggle: {
    paddingHorizontal: 4,
    paddingVertical: 2,
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  redirectRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 18,
  },
  redirectText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  redirectLink: {
    color: colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
});
