import React, { useState, useEffect, useRef } from 'react';
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
  Alert,
  Modal,
  FlatList,
  Animated,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import LinearGradient from 'react-native-linear-gradient';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import axios from '../../utils/axios.js';

const DEPARTMENTS = [
  'Computer Science',
  'Electronics',
  'Mechanical',
  'Civil',
  'Information Technology',
  'Electrical',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const DropdownModal = ({ visible, onClose, data, onSelect, title }) => (
  <Modal
    visible={visible}
    transparent
    animationType="fade"
    onRequestClose={onClose}
  >
    <TouchableOpacity
      style={styles.modalOverlay}
      activeOpacity={1}
      onPress={onClose}
    >
      <View style={styles.modalContent}>
        <Text style={styles.modalTitle}>{title}</Text>
        <FlatList
          data={data}
          keyExtractor={item => item}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.modalItem}
              activeOpacity={0.7}
              onPress={() => {
                onSelect(item);
                onClose();
              }}
            >
              <Text style={styles.modalItemText}>{item}</Text>
            </TouchableOpacity>
          )}
          ItemSeparatorComponent={() => <View style={styles.modalSeparator} />}
        />
      </View>
    </TouchableOpacity>
  </Modal>
);

const Register = () => {
  const navigation = useNavigation();

  const [userName, setUserName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [department, setDepartment] = useState('');
  const [year, setYear] = useState('');
  const [showDeptModal, setShowDeptModal] = useState(false);
  const [showYearModal, setShowYearModal] = useState(false);
  const [error, setError] = useState('');
  const errorAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    if (error) {
      Animated.spring(errorAnim, {
        toValue: 1,
        useNativeDriver: true,
        tension: 80,
        friction: 10,
      }).start();
      const timer = setTimeout(() => dismissError(), 4000);
      return () => clearTimeout(timer);
    }
  }, [error]);

  function dismissError() {
    Animated.timing(errorAnim, {
      toValue: 0,
      duration: 250,
      useNativeDriver: true,
    }).start(() => setError(''));
  }

  function submitHandler() {
    if (!userName.trim()) return setError('Please enter your name.');
    if (!email.trim()) return setError('Please enter your email.');
    if (!password.trim()) return setError('Please enter a password.');
    if (!department) return setError('Please select your department.');
    if (!year) return setError('Please select your year.');

    setError('');
    axios
      .post('/auth/register', {
        userName,
        email,
        password,
        department,
        year,
      })
      .then(res => {
        console.log(res.data);
        Alert.alert('Success', 'Registration successful!', [
          { text: 'OK', onPress: () => navigation.navigate('Login') },
        ]);
      })
      .catch(err => {
        const msg =
          err.response?.data?.error ||
          err.response?.data?.message ||
          'Something went wrong. Please try again.';
        setError(msg);
      });
  }

  return (
    <LinearGradient
      colors={['#0f2027', '#203a43', '#2c5364']}
      style={styles.gradient}
    >
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
              <Text style={styles.cardTitle}>Create Account</Text>
              {error !== '' && (
                <Animated.View
                  style={[
                    styles.errorBanner,
                    {
                      opacity: errorAnim,
                      transform: [
                        {
                          translateY: errorAnim.interpolate({
                            inputRange: [0, 1],
                            outputRange: [-10, 0],
                          }),
                        },
                      ],
                    },
                  ]}
                >
                  <View style={styles.errorIconCircle}>
                    <Icon name="alert-circle" size={18} color="#ff6b6b" />
                  </View>
                  <Text style={styles.errorText}>{error}</Text>
                  <TouchableOpacity onPress={dismissError} hitSlop={8}>
                    <Icon name="x" size={16} color="rgba(255,255,255,0.5)" />
                  </TouchableOpacity>
                </Animated.View>
              )}

              <View style={styles.inputRow}>
                <View style={styles.iconCircle}>
                  <Icon name="user" size={18} color="#203a43" />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="User Name"
                  placeholderTextColor="rgba(255,255,255,0.45)"
                  value={userName}
                  onChangeText={setUserName}
                  autoCapitalize="none"
                />
              </View>

              <View style={styles.inputRow}>
                <View style={styles.iconCircle}>
                  <Icon name="mail" size={18} color="#203a43" />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="e-mail"
                  placeholderTextColor="rgba(255,255,255,0.45)"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                  autoComplete="email"
                  textContentType="emailAddress"
                />
              </View>

              <TouchableOpacity
                style={styles.inputRow}
                activeOpacity={0.7}
                onPress={() => setShowDeptModal(true)}
              >
                <View style={styles.iconCircle}>
                  <Icon name="briefcase" size={18} color="#203a43" />
                </View>
                <Text
                  style={[
                    styles.dropdownText,
                    !department && styles.dropdownPlaceholder,
                  ]}
                >
                  {department || 'Department'}
                </Text>
                <Icon
                  name="chevron-down"
                  size={18}
                  color="rgba(255,255,255,0.45)"
                />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.inputRow}
                activeOpacity={0.7}
                onPress={() => setShowYearModal(true)}
              >
                <View style={styles.iconCircle}>
                  <Icon name="calendar" size={18} color="#203a43" />
                </View>
                <Text
                  style={[
                    styles.dropdownText,
                    !year && styles.dropdownPlaceholder,
                  ]}
                >
                  {year || 'Year'}
                </Text>
                <Icon
                  name="chevron-down"
                  size={18}
                  color="rgba(255,255,255,0.45)"
                />
              </TouchableOpacity>

              <View style={styles.inputRow}>
                <View style={styles.iconCircle}>
                  <Icon name="lock" size={18} color="#203a43" />
                </View>
                <TextInput
                  style={styles.textInput}
                  placeholder="password"
                  placeholderTextColor="rgba(255,255,255,0.45)"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry
                  autoCapitalize="none"
                  autoComplete="password"
                  textContentType="password"
                />
              </View>

              <TouchableOpacity
                style={styles.button}
                activeOpacity={0.85}
                onPress={submitHandler}
              >
                <Text style={styles.buttonText}>Register</Text>
              </TouchableOpacity>
              <View style={styles.redirectRow}>
                <Text style={styles.redirectText}>
                  Already have an account?{' '}
                </Text>
                <TouchableOpacity onPress={() => navigation.navigate('Login')}>
                  <Text style={styles.redirectLink}>Log in</Text>
                </TouchableOpacity>
              </View>
            </View>
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>

      <DropdownModal
        visible={showDeptModal}
        onClose={() => setShowDeptModal(false)}
        data={DEPARTMENTS}
        onSelect={setDepartment}
        title="Select Department"
      />
      <DropdownModal
        visible={showYearModal}
        onClose={() => setShowYearModal(false)}
        data={YEARS}
        onSelect={setYear}
        title="Select Year"
      />
    </LinearGradient>
  );
};

export default Register;

const styles = StyleSheet.create({
  gradient: { flex: 1 },
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
    backgroundColor: 'rgba(255,255,255,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  appImage: {
    height: 60,
    width: 90,
  },
  appName: {
    fontSize: 28,
    fontWeight: '700',
    color: '#ffffff',
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.5)',
    marginTop: 4,
  },
  card: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    padding: 24,
  },
  cardTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 20,
  },
  errorBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,70,70,0.12)',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: 'rgba(255,100,100,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    gap: 10,
  },
  errorIconCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255,70,70,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    flex: 1,
    fontSize: 13,
    color: '#ff9b9b',
    fontWeight: '500',
    lineHeight: 18,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    marginBottom: 14,
    gap: 12,
  },
  iconCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.88)',
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
    color: '#ffffff',
    paddingVertical: 0,
  },

  dropdownText: {
    flex: 1,
    fontSize: 15,
    color: '#ffffff',
  },
  dropdownPlaceholder: {
    color: 'rgba(255,255,255,0.45)',
  },

  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  modalContent: {
    backgroundColor: '#1a2f38',
    borderRadius: 20,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.12)',
    paddingVertical: 20,
    paddingHorizontal: 8,
    maxHeight: 380,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '600',
    color: '#ffffff',
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  modalItem: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 10,
  },
  modalItemText: {
    fontSize: 15,
    color: 'rgba(255,255,255,0.85)',
  },
  modalSeparator: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    marginHorizontal: 16,
  },

  button: {
    backgroundColor: '#6366f1',
    borderRadius: 14,
    paddingVertical: 15,
    alignItems: 'center',
    marginTop: 6,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 10,
    elevation: 6,
  },
  buttonText: {
    color: '#fff',
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
    color: 'rgba(255,255,255,0.5)',
    fontSize: 13,
  },
  redirectLink: {
    color: '#818cf8',
    fontSize: 13,
    fontWeight: '600',
  },
});
