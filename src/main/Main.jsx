import { StyleSheet, Text, View, TouchableOpacity, Image, Pressable } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';

const Main = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#1A3AFF', '#0A1FA8', '#060D5C']}
        style={StyleSheet.absoluteFill}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
      />

      <LinearGradient
        colors={['#6B8FFF', '#3A5FFF', 'transparent']}
        style={[StyleSheet.absoluteFill, styles.glowOverlay]}
        start={{ x: 0.5, y: 0.3 }}
        end={{ x: 0.5, y: 0.8 }}
      />

      <SafeAreaView style={styles.viewContainer}>
        <View style={styles.logoContainer}>
          <View style={styles.appImageContainer}>
            <Image
              source={require('../../assets/log-transparent.png')}
              style={styles.appImage}
              resizeMode="contain"
            />
          </View>
          <Text style={styles.appName}>CampLink</Text>
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity
            style={styles.primary}
            onPress={() => navigation.navigate('Register')}
          >
            <Text style={styles.primaryText}>Let's Get Started</Text>
          </TouchableOpacity>
          <View style={styles.signInBar}>
            <Text style={{color : 'white'}}>Already have an account?</Text>
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
    color: '#FFFFFF',
    letterSpacing: 0.5,
  },
  glowOverlay: {
    opacity: 0.5,
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
    backgroundColor: 'blue',
    borderRadius: 50,
  },
  primaryText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 600,
    letterSpacing: 0.3,
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
    height: 90,
    width: 60,
  },
  signInBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  signInText: {
    color: 'blue',
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
