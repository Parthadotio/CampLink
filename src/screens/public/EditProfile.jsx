import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ImageCropPicker from 'react-native-image-crop-picker';
import { useAuth } from '../../context/userAuth.jsx';
import axios from '../../utils/axios.js';

const DEPARTMENTS = [
  'Computer Science Engg.',
  'Electronics Engg.',
  'Mechanical Engg.',
  'Civil Engg.',
  'Electrical Engg.',
  'Agriculture Engg.',
  'Forestry',
  'B. Sc.',
  'B. Com.',
];

const YEARS = ['1st Year', '2nd Year', '3rd Year', '4th Year'];

const EditProfile = () => {
  const navigation = useNavigation();
  const { user, login } = useAuth();

  const [name, setName] = useState(user?.name || '');
  const [department, setDepartment] = useState(user?.department || '');
  const [year, setYear] = useState(user?.year || '');
  const [profilePhoto, setProfilePhoto] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showDeptPicker, setShowDeptPicker] = useState(false);
  const [showYearPicker, setShowYearPicker] = useState(false);

  const pickPhoto = async () => {
    try {
      const image = await ImageCropPicker.openPicker({
        mediaType: 'photo',
        cropping: true,
        cropperCircleOverlay: true,
        width: 400,
        height: 400,
        compressImageQuality: 0.8,
      });
      setProfilePhoto(image);
    } catch (error) {
      if (error.code !== 'E_PICKER_CANCELLED') {
        Alert.alert('Error', 'Could not pick image.');
      }
    }
  };

  const handleSave = async () => {
    if (!name.trim()) {
      Alert.alert('Validation', 'Name cannot be empty.');
      return;
    }
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('token');

      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('department', department);
      formData.append('year', year);

      if (profilePhoto) {
        const extension = profilePhoto.path.split('.').pop() || 'jpg';
        formData.append('image', {
          uri: profilePhoto.path,
          name: `${Date.now()}.${extension}`,
          type: profilePhoto.mime || 'image/jpeg',
        });
      }

      const response = await axios.put('/auth/user/update', formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });

      const updatedUser = {
        ...user,
        name: name.trim(),
        department,
        year,
        profilePhotoUrl:
          response.data?.user?.profilePhotoUrl || user?.profilePhotoUrl,
      };
      await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
      login(token, updatedUser);

      Alert.alert('Success', 'Profile updated!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error) {
      console.log('UPDATE ERROR:', error.response?.data || error.message);
      Alert.alert('Error', 'Failed to update profile. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={styles.header}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}
          >
            <Icon name="arrow-left" size={20} color="#111" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Edit Profile</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Profile Photo */}
          <View style={styles.photoSection}>
            <View style={styles.avatarWrapper}>
              <Image
                source={
                  profilePhoto
                    ? { uri: profilePhoto.path }
                    : user?.profilePhotoUrl
                    ? { uri: user.profilePhotoUrl }
                    : require('../../../assets/logo.png')
                }
                style={styles.avatar}
                resizeMode="cover"
              />
              <TouchableOpacity style={styles.cameraBtn} onPress={pickPhoto}>
                <Icon
                  name={
                    user?.profilePhotoUrl || profilePhoto ? 'camera' : 'plus'
                  }
                  size={14}
                  color="#fff"
                />
              </TouchableOpacity>
            </View>
            <Text style={styles.photoHint}>
              {profilePhoto
                ? 'New photo selected'
                : user?.profilePhotoUrl
                ? 'Tap to change photo'
                : 'Tap to add a profile photo'}
            </Text>
          </View>

          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Full Name</Text>
            <View style={styles.inputRow}>
              <Icon
                name="user"
                size={16}
                color="#6366f1"
                style={styles.inputIcon}
              />
              <TextInput
                style={styles.input}
                value={name}
                onChangeText={setName}
                placeholder="Your name"
                placeholderTextColor="#bbb"
                autoCapitalize="words"
              />
            </View>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Email</Text>
            <View style={[styles.inputRow, styles.inputReadonly]}>
              <Icon
                name="mail"
                size={16}
                color="#bbb"
                style={styles.inputIcon}
              />
              <Text style={styles.readonlyText}>{user?.email}</Text>
            </View>
            <Text style={styles.hintText}>Email cannot be changed</Text>
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Department</Text>
            <TouchableOpacity
              style={styles.inputRow}
              onPress={() => {
                setShowDeptPicker(v => !v);
                setShowYearPicker(false);
              }}
              activeOpacity={0.8}
            >
              <Icon
                name="book"
                size={16}
                color="#6366f1"
                style={styles.inputIcon}
              />
              <Text style={[styles.input, !department && styles.placeholder]}>
                {department || 'Select department'}
              </Text>
              <Icon
                name={showDeptPicker ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#aaa"
              />
            </TouchableOpacity>
            {showDeptPicker && (
              <View style={styles.dropdown}>
                {DEPARTMENTS.map(dept => (
                  <TouchableOpacity
                    key={dept}
                    style={[
                      styles.dropdownItem,
                      department === dept && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setDepartment(dept);
                      setShowDeptPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        department === dept && styles.dropdownTextActive,
                      ]}
                    >
                      {dept}
                    </Text>
                    {department === dept && (
                      <Icon name="check" size={14} color="#6366f1" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <View style={styles.fieldGroup}>
            <Text style={styles.fieldLabel}>Year</Text>
            <TouchableOpacity
              style={styles.inputRow}
              onPress={() => {
                setShowYearPicker(v => !v);
                setShowDeptPicker(false);
              }}
              activeOpacity={0.8}
            >
              <Icon
                name="calendar"
                size={16}
                color="#6366f1"
                style={styles.inputIcon}
              />
              <Text style={[styles.input, !year && styles.placeholder]}>
                {year || 'Select year'}
              </Text>
              <Icon
                name={showYearPicker ? 'chevron-up' : 'chevron-down'}
                size={16}
                color="#aaa"
              />
            </TouchableOpacity>
            {showYearPicker && (
              <View style={styles.dropdown}>
                {YEARS.map(y => (
                  <TouchableOpacity
                    key={y}
                    style={[
                      styles.dropdownItem,
                      year === y && styles.dropdownItemActive,
                    ]}
                    onPress={() => {
                      setYear(y);
                      setShowYearPicker(false);
                    }}
                  >
                    <Text
                      style={[
                        styles.dropdownText,
                        year === y && styles.dropdownTextActive,
                      ]}
                    >
                      {y}
                    </Text>
                    {year === y && (
                      <Icon name="check" size={14} color="#6366f1" />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </View>
          <TouchableOpacity
            style={[styles.saveBtn, loading && styles.saveBtnDisabled]}
            onPress={handleSave}
            activeOpacity={0.85}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <View style={styles.saveBtnInner}>
                <Icon name="check" size={16} color="#fff" />
                <Text style={styles.saveBtnText}>Save Changes</Text>
              </View>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default EditProfile;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  flex: { flex: 1 },
  photoSection: {
    alignItems: 'center',
    paddingVertical: 24,
  },
  avatarWrapper: {
    width: 96,
    height: 96,
    position: 'relative',
    marginBottom: 10,
  },
  avatar: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 3,
    borderColor: '#6366f1',
  },
  cameraBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#f5f5f5',
  },
  photoHint: {
    fontSize: 12,
    color: '#aaa',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#f5f5f5',
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#e0e0e0',
  },
  backBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111',
    letterSpacing: -0.3,
  },
  scroll: {
    padding: 20,
    paddingBottom: 40,
  },
  fieldGroup: {
    marginBottom: 20,
  },
  fieldLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#888',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
    paddingHorizontal: 14,
    paddingVertical: 14,
    gap: 10,
  },
  inputReadonly: {
    backgroundColor: '#fafafa',
  },
  inputIcon: {
    width: 20,
  },
  input: {
    flex: 1,
    fontSize: 15,
    color: '#111',
    padding: 0,
  },
  placeholder: {
    color: '#bbb',
  },
  readonlyText: {
    flex: 1,
    fontSize: 15,
    color: '#aaa',
  },
  hintText: {
    fontSize: 11,
    color: '#bbb',
    marginTop: 5,
    marginLeft: 4,
  },
  dropdown: {
    marginTop: 6,
    backgroundColor: '#fff',
    borderRadius: 14,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: '#e0e0e0',
    overflow: 'hidden',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#f0f0f0',
  },
  dropdownItemActive: {
    backgroundColor: '#f0f0ff',
  },
  dropdownText: {
    fontSize: 14,
    color: '#333',
  },
  dropdownTextActive: {
    color: '#6366f1',
    fontWeight: '600',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#6366f1',
    borderRadius: 16,
    paddingVertical: 16,
    marginTop: 8,
    elevation: 4,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 10,
  },
  saveBtnDisabled: {
    opacity: 0.6,
  },
  saveBtnInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  saveBtnText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: 0.3,
  },
});
