import {
  ActivityIndicator,
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  fade,
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Feather';

import { useAuth } from '../../context/userAuth.jsx';

import Main from '../main/Main.jsx';
import Login from '../Login/Login.jsx';
import Register from '../register/Register.jsx';
import Home from '../public/Home.jsx';
import MyEvents from '../public/MyEvents.jsx';
import Profile from '../public/Profile.jsx';
import EditProfile from '../public/EditProfile.jsx';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

function TabBar({ state, navigation }) {
  const tabs = [
    { name: 'Home', icon: 'home' },
    { name: 'Events', icon: 'calendar' },
    { name: 'Me', icon: 'user' },
  ];

  return (
    <View style={styles.wrapper}>
      <View style={styles.bar}>
        {tabs.map((tab, index) => {
          const isFocused = state.index === index;
          return (
            <TouchableOpacity
              key={tab.name}
              onPress={() => navigation.navigate(tab.name)}
              style={[styles.tab, isFocused && styles.activeTab]}
              activeOpacity={0.8}
            >
              <Icon
                name={tab.icon}
                size={20}
                color={isFocused ? '#6366f1' : '#333'}
              />
              {isFocused && <Text style={styles.label}>{tab.name}</Text>}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: 'absolute',
    bottom: 20,
    left: 0,
    right: 0,
    alignItems: 'center',
  },
  bar: {
    flexDirection: 'row',
    backgroundColor: '#FFFCF7',
    borderRadius: 50,
    paddingHorizontal: 10,
    paddingVertical: 8,
    alignItems: 'center',
    gap: 6,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
  },
  tab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 18,
    paddingVertical: 10,
    borderRadius: 50,
    gap: 6,
  },
  activeTab: {
    backgroundColor: '#e0e0fb',
  },
  label: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 14,
  },
});

const AppTabs = () => {
  return (
    <Tab.Navigator
      tabBar={props => <TabBar {...props} />}
      screenOptions={{ headerShown: false }}
    >
      <Tab.Screen name="Home" component={Home} />
      <Tab.Screen name="Events" component={MyEvents} />
      <Tab.Screen name="Me" component={Profile} />
    </Tab.Navigator>
  );
};

const Navigation = () => {
  const { isLoggedIn, loading } = useAuth();

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false, animation: fade }}>
        {isLoggedIn ? (
          <>
            <Stack.Screen name="AppTabs" component={AppTabs} />
            <Stack.Screen name="EditProfile" component={EditProfile} />
          </>
        ) : (
          <>
            <Stack.Screen name="Main" component={Main} />
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Register" component={Register} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default Navigation;
