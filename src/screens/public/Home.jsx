import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
  Image,
  ScrollView,
  RefreshControl,
  useWindowDimensions,
} from 'react-native';
import { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../../context/userAuth.jsx';
import axios from '../../utils/axios.js';
import { colors } from '../../theme/colors.js';

const EVENTS_CATEGORIES = ['All', 'Tech', 'Cultural', 'Sports', 'Business'];

const getInitials = name => {
  if (!name) {
    return 'CL';
  }
  const parts = name.trim().split(' ').filter(Boolean);
  return parts
    .slice(0, 2)
    .map(part => part[0].toUpperCase())
    .join('');
};

const getDateBadge = badge => {
  if (!badge) {
    return { day: '--', month: 'TBD' };
  }
  
  const date = new Date();
  if (Number.isNaN(date.getTime())) {
    return { day: '--', month: 'TBD' };
  }
  const month = date.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
  return {
    day: String(date.getDate()).padStart(2, '0'),
    month,
  };
};

const eventCategory= event => {
  const possible = [event?.category, event?.type, event?.tag]
    .find(value => typeof value === 'string' && value.trim().length > 0);

  if (possible) {
    const normalized = possible.trim().toLowerCase();
    if (normalized.includes('tech')) return 'Tech';
    if (normalized.includes('culture') || normalized.includes('cultural')) return 'Cultural';
    if (normalized.includes('sport')) return 'Sports';
  }

  return 'Cultural';
};

const getEventId = event => event?.id || event?._id;

const Home = () => {
  const navigation = useNavigation();
  const { width } = useWindowDimensions();
  const { user } = useAuth();

  const [events, setEvents] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [refreshing, setRefreshing] = useState(false);

  const fetchEvents = () => {
    return axios
      .get('/events')
      .then(res => setEvents(res.data))
      .catch(err => {
        console.log(err.res?.data);
      });
  };

  useEffect(() => {
    fetchEvents();
  }, []);
  
  const onRefresh = () => {
    setRefreshing(true);
    fetchEvents().finally(() => setRefreshing(false));
  };

  const isTablet = width >= 768;
  const cardWidth = isTablet ? (width - 64) / 2 : '100%';

  const filteredEvents = events.filter(event => {
    if (selectedCategory === 'All') {
      return true;
    }
    return eventCategory(event) === selectedCategory;
  });

  const featuredEvent = filteredEvents[0] || null;
  const upcomingEvents = featuredEvent ? filteredEvents.slice(1) : filteredEvents;
  const onEventPress = event => {
    const eventId = getEventId(event);
    navigation.navigate('EventDetails', { eventId, event });
  };

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar backgroundColor={colors.background} barStyle="dark-content" />

        <ScrollView
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              refreshing={refreshing}
              onRefresh={onRefresh}
              colors={[colors.primary]}
              tintColor={colors.primary}
            />
          }
        >
          <View style={styles.main}>
            <View style={styles.headerRow}>
              <View>
                <Text style={styles.greeting}>Welcome Back</Text>
                <Text style={styles.brandTitle}>{user.name}</Text>
              </View>

              {user?.profilePhotoUrl ? (
                <Image
                  source={{ uri: user.profilePhotoUrl }}
                  style={styles.avatarImage}
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.avatarFallback}>
                  <Text style={styles.avatarText}>{getInitials(user?.name)}</Text>
                </View>
              )}
            </View>

            <Pressable style={styles.searchBar}>
              <Icon name="search" size={16} color={colors.textSecondary} />
              <Text style={styles.searchPlaceholder}>Search events...</Text>
            </Pressable>

            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Browse</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoryRow}
              >
                {EVENTS_CATEGORIES.map(category => {
                  const isActive = selectedCategory === category;
                  return (
                    <Pressable
                      key={category}
                      onPress={() => setSelectedCategory(category)}
                      style={[styles.categoryChip, isActive && styles.categoryChipActive]}
                    >
                      <Text style={[styles.categoryText, isActive && styles.categoryTextActive]}>
                        {category}
                      </Text>
                    </Pressable>
                  );
                })}
              </ScrollView>
            </View>

            {featuredEvent ? (
              <View style={styles.sectionBlock}>
                <Text style={styles.sectionTitle}>Featured</Text>
                <Pressable
                  style={styles.featuredCard}
                  onPress={() => onEventPress(featuredEvent)}
                >
                  <Text style={styles.featuredCaption}>Today</Text>
                  <Text style={styles.featuredTitle}>{featuredEvent.title}</Text>
                  <Text style={styles.featuredSubtext} numberOfLines={2}>
                    {featuredEvent.desc || featuredEvent.venue || 'New event available now'}
                  </Text>
                  <View style={styles.featuredTag}>
                    <Text style={styles.featuredTagText}>{eventCategory(featuredEvent)}</Text>
                  </View>
                </Pressable>
              </View>
            ) : null}

            <View style={styles.sectionBlock}>
              <Text style={styles.sectionTitle}>Upcoming</Text>
              <View style={[styles.upcomingGrid, isTablet && styles.upcomingGridTablet]}>
                {(upcomingEvents.length > 0 ? upcomingEvents : filteredEvents).map(event => {
                  const badge = getDateBadge(event.eventDate);
                  const eventId = getEventId(event);
                  return (
                    <Pressable
                      key={eventId || event.title}
                      style={[styles.upcomingCard, { width: cardWidth }]}
                      onPress={() => onEventPress(event)}
                    >
                      <View style={styles.dateBadge}>
                        <Text style={styles.dateDay}>{badge.day}</Text>
                        <Text style={styles.dateMonth}>{badge.month}</Text>
                      </View>

                      <View style={styles.upcomingDetails}>
                        <Text style={styles.upcomingTitle} numberOfLines={2}>
                          {event.title}
                        </Text>
                        <Text style={styles.upcomingMeta} numberOfLines={2}>
                          {event.venue || 'Campus venue'} 
                          {event.eventTime ? ` - ${event.eventTime}` : ''}
                        </Text>

                        <View style={styles.categoryPill}>
                          <Text style={styles.categoryPillText}>{eventCategory(event)}</Text>
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>

              {filteredEvents.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>No upcoming events.</Text>
                </View>
              ) : null}
            </View>
          </View>
        </ScrollView>

      </View>
    </SafeAreaProvider>
  );
}; 

export default Home;

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 96,
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: colors.background,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  greeting: {
    color: colors.textSecondary,
    fontSize: 12,
    marginBottom: 2,
  },
  brandTitle: {
    color: colors.textPrimary,
    fontSize: 34,
    lineHeight: 38,
    fontWeight: '800',
  },
  avatarImage: {
    height: 44,
    width: 44,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: colors.border,
  },
  avatarFallback: {
    height: 44,
    width: 44,
    borderRadius: 999,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: colors.background,
    fontSize: 14,
    fontWeight: '700',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
    backgroundColor: colors.surface,
    marginBottom: 14,
  },
  searchPlaceholder: {
    color: colors.textSecondary,
    fontSize: 13,
  },
  sectionBlock: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 13,
    textTransform: 'uppercase',
    color: colors.textSecondary,
    fontWeight: '700',
    letterSpacing: 0.9,
    marginBottom: 10,
  },
  categoryRow: {
    flexDirection: 'row',
    gap: 8,
    paddingBottom: 2,
  },
  categoryChip: {
    backgroundColor: colors.surface,
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: colors.border,
  },
  categoryChipActive: {
    backgroundColor: colors.primary,
    borderColor: colors.primary,
  },
  categoryText: {
    color: colors.textSecondary,
    fontSize: 12,
    fontWeight: '700',
  },
  categoryTextActive: {
    color: colors.background,
  },
  featuredCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 14,
    minHeight: 128,
  },
  featuredCaption: {
    color: colors.background,
    fontSize: 12,
    marginBottom: 6,
    fontWeight: '600',
  },
  featuredTitle: {
    color: colors.background,
    fontSize: 22,
    lineHeight: 26,
    fontWeight: '600',
    marginBottom: 8,
  },
  featuredSubtext: {
    color: colors.background,
    fontSize: 12,
    opacity: 0.95,
    marginBottom: 10,
  },
  featuredTag: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  featuredTagText: {
    color: colors.textPrimary,
    fontSize: 12,
    fontWeight: '700',
  },
  upcomingGrid: {
    gap: 12,
  },
  upcomingGridTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  upcomingCard: {
    flexDirection: 'row',
    backgroundColor: colors.background,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 14,
    padding: 12,
    gap: 12,
  },
  dateBadge: {
    height: 54,
    width: 54,
    borderRadius: 12,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dateDay: {
    color: colors.background,
    fontSize: 20,
    lineHeight: 22,
    fontWeight: '800',
  },
  dateMonth: {
    color: colors.background,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  upcomingDetails: {
    flex: 1,
    justifyContent: 'center',
  },
  upcomingTitle: {
    color: colors.textPrimary,
    fontSize: 16,
    lineHeight: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  upcomingMeta: {
    color: colors.textSecondary,
    fontSize: 12,
    lineHeight: 16,
    marginBottom: 8,
  },
  categoryPill: {
    alignSelf: 'flex-start',
    backgroundColor: colors.secondary,
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  categoryPillText: {
    color: colors.textPrimary,
    fontSize: 11,
    fontWeight: '700',
  },
  emptyState: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: colors.surface,
  },
  emptyStateText: {
    color: colors.textSecondary,
    fontSize: 13,
  },
});
