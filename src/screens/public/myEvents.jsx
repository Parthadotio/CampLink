import React, { useEffect, useState, useCallback } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
} from 'react-native';
import { colors } from '../../theme/colors';
import Icon from 'react-native-vector-icons/Feather';
import { useAuth } from '../../context/userAuth.jsx';
import axios from '../../utils/axios';
import { useNavigation } from '@react-navigation/native';

const FILTER_EVENT = ['Past', 'Present', 'Upcoming'];

const MyEvents = () => {
  const [activeFilter, setActiveFilter] = React.useState('Present');
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const navigation = useNavigation();
  const { user } = useAuth();
  const eventIds = user?.registeredEvents;

  const fetchEvents = useCallback(async ids => {
    if (!ids || ids.length === 0) {
      setEvents([]);
      return;
    }
    try {
      const normalizedIds = ids.map(id => String(id));
      const eventPromises = normalizedIds.map(id => axios.get(`/events/${id}`));
      const responses = await Promise.all(eventPromises);
      const eventData = responses.map(res => res.data);
      setEvents(eventData);
    } catch (err) {
      console.log('Failed to fetch registered events', err);
      setEvents([]);
    }
  }, []);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      await fetchEvents(eventIds);
      setLoading(false);
    };
    loadEvents();
  }, [eventIds, fetchEvents]);

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchEvents(eventIds);
    setRefreshing(false);
  }, [eventIds, fetchEvents]);

  return (
    <View style={styles.root}>
      <View style={styles.headerRow}>
        <Text style={styles.header}>My Events</Text>
        {events.length > 0 && (
          <View style={styles.countBadge}>
            <Text style={styles.countText}>{events.length}</Text>
          </View>
        )}
      </View>

      <View style={styles.filter}>
        {FILTER_EVENT.map(category => {
          const isActive = activeFilter === category;
          return (
            <Pressable
              key={category}
              onPress={() => setActiveFilter(category)}
              style={[
                styles.filterBtn,
                {
                  backgroundColor: isActive
                    ? colors.primary
                    : colors.background,
                  borderWidth: 1,
                  borderColor: colors.primary,
                },
              ]}
            >
              <Text
                style={[
                  styles.filterBtnText,
                  { color: isActive ? colors.background : colors.primary },
                ]}
              >
                {category}
              </Text>
            </Pressable>
          );
        })}
      </View>

      {loading ? (
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={colors.primary} />
          <Text style={styles.loadingText}>Loading your events...</Text>
        </View>
      ) : events.length > 0 ? (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={handleRefresh}
              tintColor={colors.primary}
              colors={[colors.primary]}
            />
          }
        >
          {events.map(event => (
            <Pressable
              key={event.id}
              onPress={() => navigation.navigate('EventDetails', { event })}
              style={({ pressed }) => [
                styles.card,
                pressed && styles.cardPressed,
              ]}
            >
              <View style={styles.cardTopRow}>
                <View style={styles.dateChip}>
                  <Icon name="calendar" size={11} color={colors.primary} />
                  <Text style={styles.dateChipText}>{event.eventDate}</Text>
                </View>
                <View style={styles.timeChip}>
                  <Icon name="clock" size={11} color={colors.primary} />
                  <Text style={styles.dateChipText}>{event.eventTime}</Text>
                </View>
              </View>

              <Text style={styles.eventName} numberOfLines={1}>
                {event.title}
              </Text>
              <Text style={styles.eventDesc} numberOfLines={2}>
                {event.desc}
              </Text>

              <View style={styles.divider} />

              <View style={styles.cardFooter}>
                <View style={styles.categoryPill}>
                  <Text style={styles.categoryText}>{event.category}</Text>
                </View>
                <View style={styles.venueRow}>
                  <Icon name="map-pin" size={12} color={colors.primary} />
                  <Text style={styles.venueText} numberOfLines={1}>
                    {event.venue}
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </ScrollView>
      ) : (
        <View style={styles.centered}>
          <View style={styles.emptyIconWrap}>
            <Icon name="calendar" size={28} color={colors.primary} />
          </View>
          <Text style={styles.emptyTitle}>No events found</Text>
          <Text style={styles.emptySubtitle}>
            You have no {activeFilter.toLowerCase()} registered events.
          </Text>
        </View>
      )}
    </View>
  );
};

export default MyEvents;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    paddingTop: 24,
    paddingHorizontal: 20,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  header: {
    fontSize: 26,
    fontWeight: '700',
    color: colors.textPrimary,
    letterSpacing: -0.5,
  },
  countBadge: {
    backgroundColor: colors.primary,
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 2,
    minWidth: 26,
    alignItems: 'center',
  },
  countText: {
    color: colors.background,
    fontSize: 12,
    fontWeight: '700',
  },
  filter: {
    marginTop: 12,
    flexDirection: 'row',
    gap: 6,
    alignItems: 'center',
    marginBottom: 20,
  },
  filterBtn: {
    width: 80,
    backgroundColor: colors.primary,
    padding: 8,
    borderRadius: 50,
  },
  filterBtnText: {
    textAlign: 'center',
    fontSize: 12,
    fontWeight: 700,
    color: colors.background,
  },
  listContent: {
    gap: 14,
    paddingBottom: 32,
  },
  card: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: 0,
  },
  cardPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.985 }],
  },
  cardTopRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  dateChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: colors.background,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  dateChipText: {
    fontSize: 11,
    fontWeight: '600',
    color: colors.textSecondary,
  },
  eventName: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
    letterSpacing: -0.3,
  },
  eventDesc: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 12,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryPill: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 50,
  },
  categoryText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  venueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flex: 1,
    justifyContent: 'flex-end',
  },
  venueText: {
    fontSize: 12,
    color: colors.textSecondary,
    fontWeight: '500',
    maxWidth: 140,
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 60,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 14,
    color: colors.textSecondary,
  },
  emptyIconWrap: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 14,
  },
  emptyTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 13,
    color: colors.textSecondary,
    textAlign: 'center',
    maxWidth: 220,
    lineHeight: 18,
  },
});
