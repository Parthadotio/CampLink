import React, { useState, useEffect } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  Image,
  ActivityIndicator,
} from 'react-native';
import {
  SafeAreaProvider,
  useSafeAreaInsets,
} from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/userAuth.jsx';
import ImageCropPicker from 'react-native-image-crop-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from '../../utils/axios.js';

const STATS = [
  { label: 'Events', value: 12 },
  { label: 'RSVPs', value: 5 },
  { label: 'Clubs', value: 3 },
];

const Profile = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const { logout, user } = useAuth();

  const MENU_ITEMS = [
    { icon: 'user', label: 'Edit profile', danger: false, onPress: () => navigation.navigate('EditProfile') },
    { icon: 'bell', label: 'Notifications', danger: false },
    {
      icon: 'log-out',
      label: 'Log out',
      danger: true,
      onPress: () => logout(),
    },
  ];

  const imageUploader = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        cropperCircleOverlay: true,
        width: 400,
        height: 400,
        compressImageQuality: 0.8,
      });

      const extension = image.path.split('.').pop() || 'jpg';
      const customName = `${Date.now()}.${extension}`;

      const formData = new FormData();
      formData.append('image', {
        uri: image.path,
        name: customName,
        type: image.mime || 'image/jpeg',
      });

      const token = await AsyncStorage.getItem('token');

      const response = await axios.post('/auth/user/upload-image', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
          Accept: 'application/json',
        },
      });

      if (response.data?.profilePhotoUrl) {
        setProfileImage(response.data.profilePhotoUrl);
      }
      console.log('SUCCESS:', response.data);
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        console.log('UPLOAD ERROR:', error.response?.data || error.message);
      }
    }
  };

  return (
    <SafeAreaProvider
      contentContainerStyle={[
        styles.scrollContent,
        { paddingTop: insets.top + 8, paddingBottom: insets.bottom + 24 },
      ]}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.main}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
        </View>
        <View style={styles.avatarSection}>
          <View style={styles.avatarWrapper}>
            <View style={styles.imageHolder}>
              <Image
                source={
                  user?.profilePhotoUrl
                    ? { uri: user.profilePhotoUrl }
                    : require('../../../assets/logo.png')
                }
                style={styles.appImage}
                resizeMode="cover"
              />
            </View>
            {/* <Pressable style={styles.editAvatarBtn} onPress={imageUploader}>
              <Icon name="camera" size={13} color="#fff" />
            </Pressable> */}
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
          {MENU_ITEMS.map((item, index) => (
            <Pressable
              key={item.label}
              onPress={item.onPress}
              style={({ pressed }) => [
                styles.menuRow,
                index !== MENU_ITEMS.length - 1 && styles.menuRowBorder,
                pressed && styles.menuRowPressed,
              ]}
              android_ripple={{ color: '#f0f0f0' }}
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
                  color={item.danger ? '#c0392b' : '#444'}
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
                  color="#bbb"
                  style={styles.menuChevron}
                />
              )}
            </Pressable>
          ))}
        </View>
        <Text style={styles.versionText}>CampusLink v1.0.0</Text>
      </View>
    </SafeAreaProvider>
  );
};

export default Profile;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    backgroundColor: '#f5f5f5',
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
    color: '#111',
    letterSpacing: -0.5,
  },
  settingsBtn: {
    padding: 8,
  },
  avatarSection: {
    alignItems: 'center',
    marginBottom: 28,
  },
  avatarWrapper: {
    width: 90,
    height: 90,
    position: 'relative',
    marginBottom: 14,
    borderWidth: 2,
    borderColor: 'black',
    borderRadius: 50,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageHolder: {
    width: 90,
    height: 90,
    borderRadius: 45,
    alignItems: 'center',
    justifyContent: 'center',
  },
  appImage: {
    height: 90,
    width: 90,
    borderRadius: 45,
  },
  avatarInitials: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '600',
    letterSpacing: 1,
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#4f46e5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#f5f5f5',
  },
  userName: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111',
    marginBottom: 4,
  },
  userMeta: {
    fontSize: 13,
    color: '#888',
  },
  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  menuCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
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
    borderBottomColor: '#f0f0f0',
  },
  menuRowPressed: {
    backgroundColor: '#f8f8f8',
  },
  menuIconBox: {
    width: 34,
    height: 34,
    borderRadius: 10,
    backgroundColor: '#f3f3f3',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 14,
  },
  menuIconBoxDanger: {
    backgroundColor: '#fff0f0',
  },
  menuLabel: {
    flex: 1,
    fontSize: 15,
    color: '#222',
    fontWeight: '500',
  },
  menuLabelDanger: {
    color: '#c0392b',
  },
  menuChevron: {
    marginLeft: 8,
  },

  statsCard: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 18,
    marginBottom: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: StyleSheet.hairlineWidth,
    backgroundColor: '#e0e0e0',
    marginVertical: 4,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#111',
    marginBottom: 3,
  },
  statLabel: {
    fontSize: 12,
    color: '#999',
    fontWeight: '500',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#ccc',
  },
});
