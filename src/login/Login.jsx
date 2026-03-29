import { StyleSheet, Text, View, Image, TouchableOpacity } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context'

const Login = () => {
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
          {/* <View style={styles.logo}>
            <Image source={require("../../assets/log-transparent.png")} style={styles.logo} />
          </View> */}
          <Text style={styles.appName}>CampLink</Text>
        </View>
        <View style={styles.bottom}>
          <TouchableOpacity style={styles.primary}>
            <Text style={styles.primaryText}>
              Sign in
            </Text>
          </TouchableOpacity>
           <TouchableOpacity style={styles.secondary}>
            <Text>
              Create account
            </Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default Login;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewContainer : {
    flex : 1,
    justifyContent : "space-between"
  },
  logoContainer: {
    flex : 1,
    alignItems : "center",
    justifyContent : "center"
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
  bottom : {
    paddingHorizontal : 28,
    paddingBottom : 36,
    alignItems : "center",
    gap: 16,
  },
  primary : {
    width : "100%",
    height : 50,
    alignItems : "center",
    justifyContent : "center",
    backgroundColor : "blue",
    borderRadius : 50,
  },
  primaryText : {
    color : "white",
    fontSize : 16,
    fontWeight : 600,
    letterSpacing : 0.3
  },
  secondary : {
    width: "100%",
    height : 50,
    alignItems: "center",
    justifyContent : "center",
    backgroundColor : "white",
    borderRadius : 50
  },
});
