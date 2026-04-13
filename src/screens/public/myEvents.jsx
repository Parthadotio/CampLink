import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  Pressable,
  StatusBar,
} from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';

const DUMMY_EVENTS = [
  {
    id: '1',
    title: 'Annual Tech Fest 2025',
    desc: 'A celebration of innovation, coding challenges, robotics and AI showcases across campus.',
    venue: 'Main Auditorium',
    date: '2025-04-20',
    createdBy: 'CSE Department',
    status: 'upcoming',
  },
  {
    id: '2',
    title: 'Cultural Night',
    desc: 'An evening of music, dance, and drama performances by student clubs.',
    venue: 'Open Air Theatre',
    date: '2025-03-10',
    createdBy: 'Student Council',
    status: 'past',
  },
];

const FILTERS = ['All', 'Upcoming', 'Past'];

const MyEvents = () => {
  const [activeFilter, setActiveFilter] = React.useState('All');

  const filtered = DUMMY_EVENTS.filter(e => {
    if (activeFilter === 'All') return true;
    return e.status === activeFilter.toLowerCase();
  });

  return (
    <SafeAreaProvider>
      <StatusBar backgroundColor="#FFFCF7" barStyle="dark-content" />
      <View style={styles.container}>
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>My Events</Text>
              <Text style={styles.headerSub}>Events you've registered for</Text>
            </View>
          </View>

          {/* Filters */}
          <View style={styles.filterRow}>
            {FILTERS.map(f => (
              <Pressable
                key={f}
                style={[
                  styles.filterBtn,
                  activeFilter === f && styles.filterBtnActive,
                ]}
                onPress={() => setActiveFilter(f)}
              >
                <Text
                  style={[
                    styles.filterText,
                    activeFilter === f && styles.filterTextActive,
                  ]}
                >
                  {f}
                </Text>
              </Pressable>
            ))}
          </View>

          {/* Event Cards */}
          {filtered.map(event => (
            <EventCard key={event.id} event={event} />
          ))}
        </ScrollView>
      </View>
    </SafeAreaProvider>
  );
};

const EventCard = ({ event }) => {
  const isPast = event.status === 'past';

  return (
    <View style={[styles.card, isPast && styles.cardPast]}>
      {/* Top accent bar */}
      <View
        style={[
          styles.cardAccent,
          isPast ? styles.accentPast : styles.accentUpcoming,
        ]}
      />

      <View style={styles.cardInner}>
        {/* Badge */}
        <View
          style={[
            styles.badge,
            isPast ? styles.badgePast : styles.badgeUpcoming,
          ]}
        >
          <Icon
            name={isPast ? 'check-circle' : 'clock'}
            size={11}
            color={isPast ? '#f87171' : '#4ade80'}
          />
          <Text
            style={[
              styles.badgeText,
              isPast ? styles.badgeTextPast : styles.badgeTextUpcoming,
            ]}
          >
            {isPast ? 'Attended' : 'Upcoming'}
          </Text>
        </View>

        {/* Title */}
        <Text style={styles.cardTitle}>{event.title}</Text>
        <Text style={styles.cardDesc} numberOfLines={2}>
          {event.desc}
        </Text>

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Icon name="map-pin" size={12} color="#a78bfa" />
            <Text style={styles.metaText}>{event.venue}</Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="calendar" size={12} color="#a78bfa" />
            <Text style={styles.metaText}>
              {new Date(event.date).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              })}
            </Text>
          </View>
          <View style={styles.metaItem}>
            <Icon name="users" size={12} color="#a78bfa" />
            <Text style={styles.metaText}>{event.createdBy}</Text>
          </View>
        </View>

        {/* Footer */}
        <View style={styles.cardFooter}>
          <Pressable style={styles.detailBtn}>
            <Text style={styles.detailBtnText}>View Details</Text>
            <Icon name="arrow-right" size={13} color="#6366f1" />
          </Pressable>
          {!isPast && (
            <Pressable style={styles.cancelBtn}>
              <Text style={styles.cancelBtnText}>Cancel RSVP</Text>
            </Pressable>
          )}
        </View>
      </View>
    </View>
  );
};

export default MyEvents;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFCF7',
  },
  scroll: {
    paddingHorizontal: 16,
    paddingBottom: 100,
  },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 24,
    paddingBottom: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
  },
  headerSub: {
    fontSize: 13,
    color: '#555',
    marginTop: 2,
  },
  countBadge: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#1a1a2e',
    borderWidth: 1.5,
    borderColor: '#6366f1',
    alignItems: 'center',
    justifyContent: 'center',
  },
  countText: {
    color: '#a5b4fc',
    fontWeight: '700',
    fontSize: 15,
  },

  // Filters
  filterRow: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 20,
  },
  filterBtn: {
    paddingHorizontal: 18,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: '#1a1a1e',
    borderWidth: 1,
    borderColor: '#2a2a2e',
  },
  filterBtnActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
  },
  filterText: { fontSize: 13, fontWeight: '500', color: '#666' },
  filterTextActive: { color: '#fff' },

  // Card
  card: {
    backgroundColor: '#111116',
    borderRadius: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    overflow: 'hidden',
  },
  cardPast: {
    opacity: 0.75,
  },
  cardAccent: {
    height: 3,
  },
  accentUpcoming: {
    backgroundColor: '#6366f1',
  },
  accentPast: {
    backgroundColor: '#374151',
  },
  cardInner: {
    padding: 16,
    gap: 10,
  },
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    borderWidth: 1,
  },
  badgeUpcoming: {
    backgroundColor: 'rgba(74,222,128,0.1)',
    borderColor: 'rgba(74,222,128,0.25)',
  },
  badgePast: {
    backgroundColor: 'rgba(248,113,113,0.1)',
    borderColor: 'rgba(248,113,113,0.25)',
  },
  badgeText: { fontSize: 11, fontWeight: '600' },
  badgeTextUpcoming: { color: '#4ade80' },
  badgeTextPast: { color: '#f87171' },

  cardTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#fff',
    letterSpacing: -0.3,
  },
  cardDesc: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
  },
  metaRow: { gap: 5 },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  metaText: { fontSize: 12, color: '#555' },

  // Footer
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  detailBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
  },
  detailBtnText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#6366f1',
  },
  cancelBtn: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(239,68,68,0.3)',
    backgroundColor: 'rgba(239,68,68,0.08)',
  },
  cancelBtnText: {
    fontSize: 12,
    color: '#f87171',
    fontWeight: '500',
  },
});
