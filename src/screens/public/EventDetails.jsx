import React, { useEffect, useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  StatusBar,
  Alert,
  Image,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation, useRoute } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/Feather';
import axios from '../../utils/axios.js';
import { colors } from '../../theme/colors.js';
import { useAuth } from '../../context/userAuth.jsx';

const formatDateTime = (eventDate, eventTime) => {
  if (!eventDate && !eventTime) {
    return 'Date and time will be announced soon';
  }

  if (!eventDate) {
    return eventTime;
  }

  const parsed = new Date(eventDate);
  const dateText = Number.isNaN(parsed.getTime())
    ? eventDate
    : parsed.toLocaleDateString('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      });

  return eventTime ? `${dateText} - ${eventTime}` : dateText;
};

const EventDetails = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { user } = useAuth();
  const eventParameter = route.params?.event || null;

  const eventId =
    route.params?.eventId || eventParameter?.id || eventParameter?._id;

  const [event, setEvent] = useState(eventParameter || {});
  const [isLoading, setIsLoading] = useState(false);
  const [isRegistered, setIsRegistered] = useState(
    user?.registeredEvents?.includes(eventId) || false
  );
  const [posterLoadFailed, setPosterLoadFailed] = useState(false);

  const hasAllEventDetails = currentEvent => {
    if (!currentEvent) return false;

    const eventTitle =
      typeof currentEvent.title === 'string' &&
      currentEvent.title.trim().length > 0;
    const eventVenue =
      typeof currentEvent.venue === 'string' &&
      currentEvent.venue.trim().length > 0;
    const eventDate =
      typeof currentEvent.date === 'string' &&
      currentEvent.date.trim().length > 0;

    return eventTitle && eventVenue && eventDate;
  };

  useEffect(() => {
    setIsRegistered(user?.registeredEvents?.includes(eventId) || false);
  }, [user?.registeredEvents, eventId]);

  useEffect(() => {
    if (!eventId) {
      return;
    }

    const fetchDetails = !hasAllEventDetails(eventParameter);
    if (!fetchDetails) {
      setEvent(eventParameter);
      return;
    }

    setIsLoading(true);
    axios
      .get(`/events/${eventId}`)
      .then(res => {
        const eventDetails = res?.data?.event || res?.data || {};
        setEvent(eventDetails);
        console.log(eventDetails);
      })
      .catch(err => {
        console.log(err?.response?.data || err?.message);
      })
      .finally(() => setIsLoading(false));
  }, [eventId, eventParameter]);

  const posterUri =
    event.posterUrl ||
    event.poster ||
    event.imageUrl ||
    event.image ||
    event.bannerImageUrl ||
    event.banner ||
    '';

  const showPoster =
    typeof posterUri === 'string' && posterUri.length > 0 && !posterLoadFailed;

  const handleRegister = async () => {
    if (!eventId) {
      Alert.alert('Error', 'Event ID is missing.');
      return;
    }

    try {
      await axios.post(`/events/register/${eventId}`);
      setIsRegistered(true);
      Alert.alert('Success', 'You have registered for this event.');
    } catch (error) {
      console.log(error?.response?.data || error?.message);
      Alert.alert('Error', 'Could not register for the event.');
    }
  };

  const handleUnRegister = async () => {
    if (!eventId) {
      Alert.alert('Error', 'Event ID is missing.');
      return;
    }

    try {
      await axios.delete(`/events/unregister/${eventId}`);
      setIsRegistered(false);
      Alert.alert('Successfully unregistered for the event')
    } catch (error) {
      console.log(error?.response?.data || error?.message);
      Alert.alert('Error', 'Could not un-register for the event.');
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />

      <View style={styles.header}>
        <Pressable style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Icon name="arrow-left" size={18} color={colors.textPrimary} />
        </Pressable>
        <Text style={styles.headerTitle}>Event Details</Text>
        <View style={styles.headerSpacer} />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.posterCard}>
          {showPoster ? (
            <Image
              source={{ uri: event?.bannerImageUrl }}
              style={styles.posterImage}
              resizeMode="cover"
              onError={() => setPosterLoadFailed(true)}
            />
          ) : (
            <View style={styles.posterFallback}>
              <Icon name="image" size={20} color={colors.textSecondary} />
              <Text style={styles.posterFallbackText}>
                Poster not available
              </Text>
            </View>
          )}
        </View>
        <View style={styles.heroCard}>
          <Text style={styles.title}>{event.title || 'Untitled Event'}</Text>
          <Text style={styles.category}>
            {event.category || event.type || 'Campus Event'}
          </Text>
        </View>
        {isLoading ? (
          <Text style={styles.loadingText}>Loading event details...</Text>
        ) : null}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Icon name="calendar" size={16} color={colors.primary} />
            <Text style={styles.infoText}>
              {formatDateTime(event.eventDate || event.date, event.eventTime)}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="map-pin" size={16} color={colors.primary} />
            <Text style={styles.infoText}>
              {event.venue || 'Venue will be announced'}
            </Text>
          </View>

          <View style={styles.infoRow}>
            <Icon name="user" size={16} color={colors.primary} />
            <Text style={styles.infoText}>
              {event.createdBy || 'Organizer details unavailable'}
            </Text>
          </View>
        </View>

        <View style={styles.descriptionCard}>
          <Text style={styles.sectionTitle}>About Event</Text>
          <Text style={styles.descriptionText}>
            {event.desc || 'No event description provided yet.'}
          </Text>
        </View>

        <Pressable
          style={[styles.registerBtn, isRegistered && styles.registeredBtn]}
          onPress={isRegistered ? handleUnRegister : handleRegister}
        >
          <Text style={styles.registerBtnText}>
            {isRegistered ? 'Unregister' : 'Register for Event'}
          </Text>
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  );
};

export default EventDetails;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  headerSpacer: {
    width: 36,
  },
  content: {
    padding: 16,
    paddingBottom: 36,
    gap: 12,
  },
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 16,
  },
  title: {
    fontSize: 24,
    lineHeight: 30,
    fontWeight: '700',
    color: colors.background,
    marginBottom: 6,
  },
  category: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
    color: colors.textPrimary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
    fontSize: 12,
    fontWeight: '700',
  },
  infoCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
    gap: 12,
  },
  posterCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
  },
  posterImage: {
    width: '100%',
    height: 220,
    borderRadius: 10,
  },
  posterFallback: {
    marginTop: 2,
    height: 150,
    borderRadius: 10,
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  posterFallbackText: {
    color: colors.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  infoText: {
    flex: 1,
    color: colors.textPrimary,
    fontSize: 14,
    lineHeight: 20,
  },
  descriptionCard: {
    backgroundColor: colors.surface,
    borderRadius: 14,
    padding: 14,
  },
  sectionTitle: {
    color: colors.textPrimary,
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: 8,
    textTransform: 'uppercase',
  },
  descriptionText: {
    color: colors.textSecondary,
    fontSize: 14,
    lineHeight: 20,
  },
  loadingText: {
    color: colors.textSecondary,
    fontSize: 13,
    marginTop: -2,
    marginBottom: 2,
  },
  registerBtn: {
    marginTop: 4,
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
  },
  registeredBtn: {
    opacity: 0.75,
  },
  registerBtnText: {
    color: colors.background,
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
});
