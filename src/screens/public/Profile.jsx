import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/userAuth.jsx';
import { colors } from '../../theme/colors.js';
import axios from '../../utils/axios.js';
import AsyncStorage from '@react-native-async-storage/async-storage';

const getInitials = name => {
  if (!name) return 'CL';
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('');
};

const isAdminUser = user => {
  return user?.role === 'admin' || user?.isAdmin === true;
};

const Profile = () => {
  const navigation = useNavigation();
  const { logout, user } = useAuth();

  const eventId = user.registeredEvents;

  const logoutHandler = async () => {
    try {
      const token = await AsyncStorage.getItem('token');

      await axios.post(
        '/auth/logout',
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      await logout();
    } catch (error) {
      console.log(error?.response?.data || error?.message);
    }
  };

  const menuItems = [
    ...(isAdminUser(user)
      ? [
          {
            icon: 'shield',
            label: 'Admin dashboard',
            danger: false,
            onPress: () => navigation.navigate('Admin'),
          },
        ]
      : []),
    {
      icon: 'user',
      label: 'Edit profile',
      danger: false,
      onPress: () => navigation.navigate('EditProfile'),
    },
    {
      icon: 'log-out',
      label: 'Log out',
      danger: true,
      onPress: logoutHandler,
    },
  ];

  const STATS = [
    { label: 'Events', value: 12 },
    { label: 'RSVPs', value: eventId.length },
    { label: 'Clubs', value: 0 },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>

        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            {user?.profilePhotoUrl ? (
              <Image
                source={{ uri: user.profilePhotoUrl }}
                style={styles.appImage}
                resizeMode="cover"
              />
            ) : (
              <View style={styles.avatarFallback}>
                <Text style={styles.avatarFallbackText}>
                  {getInitials(user?.name)}
                </Text>
              </View>
            )}
          </View>
          <Text style={styles.userName}>{user?.name}</Text>
          <Text style={styles.userMeta}>
            {user?.department} - {user?.year}
          </Text>
        </View>

        <View style={styles.statsCard}>
          {STATS.map((stat, index) => (
            <React.Fragment key={stat.label}>
              {index !== 0 && <View style={styles.statDivider} />}
              <View style={styles.statItem}>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </View>
            </React.Fragment>
          ))}
        </View>

        <View style={styles.menuCard}>
          {menuItems.map((item, index) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              style={({ pressed }) => [
                styles.menuRow,
                index !== menuItems.length - 1 && styles.menuRowBorder,
                pressed && styles.menuRowPressed,
              ]}
              android_ripple={{ color: '#C9D7E3' }}
            >
              <View
                style={[
                  styles.menuIconBox,
                  item.danger && styles.menuIconBoxDanger,
                ]}
              >
                <Icon
                  name={item.icon}
                  size={16}
                  color={item.danger ? '#AF3F3F' : colors.textSecondary}
                />
              </View>
              <Text
                style={[
                  styles.menuLabel,
                  item.danger && styles.menuLabelDanger,
                ]}
              >
                {item.label}
              </Text>
              {!item.danger && (
                <Icon
                  name="chevron-right"
                  size={16}
                  color={colors.textSecondary}
                  style={styles.menuChevron}
                />
              )}
            </Pressable>
          ))}
        </View>

        <Text style={styles.versionText}>Made with ❤️ by Team indecisive</Text>
      </View>
    </SafeAreaView>
  );
};

export default Profile;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  main: {
    flex: 1,
    backgroundColor: colors.background,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 28,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    marginBottom: 14,
    borderWidth: 2,
    borderColor: colors.primary,
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  appImage: {
    height: 96,
    width: 96,
    borderRadius: 50,
  },
  avatarFallback: {
    height: 96,
    width: 96,
    borderRadius: 50,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarFallbackText: {
    color: colors.background,
    fontSize: 28,
    fontWeight: '700',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: colors.surface,
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: colors.border,
    marginVertical: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
  },
  menuCard: {
    backgroundColor: colors.surface,
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
    marginBottom: 24,
  },
  menuRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  menuRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  menuRowPressed: {
    backgroundColor: '#EEF2F6',
  },
  menuIconBox: {
    width: 34,
    height: 34,
    borderRadius: 50,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuIconBoxDanger: {
    backgroundColor: '#F9EDED',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: colors.textPrimary,
    fontWeight: '500',
  },
  menuLabelDanger: {
    color: '#AF3F3F',
  },
  menuChevron: {
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: colors.textSecondary,
  },
});
