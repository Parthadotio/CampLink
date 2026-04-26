import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Image,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors.js';

const Main = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.viewContainer}>
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
        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.primary}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryText}>Let's Get Started</Text>
          </TouchableOpacity>
          <View style={styles.signInBar}>
            <Text style={styles.signInLabel}>Already have an account?</Text>
            <Pressable onPress={() => navigation.navigate('Login')}>
              <Text style={styles.signInText}>Sign in</Text>
            </Pressable>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Main;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  viewContainer: {
    flex: 1,
  },
  logoContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appName: {
    fontSize: 32,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: 0.5,
  },
  tagline: {
    fontSize: 14,
    marginTop: 6,
    color: colors.textSecondary,
  },
  bottom: {
    paddingHorizontal: 28,
    paddingBottom: 36,
    alignItems: 'center',
    gap: 16,
  },
  primary: {
    width: '100%',
    height: 50,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.primary,
    borderRadius: 50,
  },
  primaryText: {
    color: colors.background,
    fontSize: 16,
    fontWeight: '600',
    letterSpacing: 0.3,
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
    height: 90,
    width: 60,
  },
  signInBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  signInLabel: {
    color: colors.textSecondary,
  },
  signInText: {
    color: colors.primary,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
