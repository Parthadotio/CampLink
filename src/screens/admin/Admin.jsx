import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/Feather';
import { useNavigation } from '@react-navigation/native';
import { colors } from '../../theme/colors.js';

const STATS = [
  { label: 'Live events', value: '24', icon: 'calendar' },
  { label: 'Pending approvals', value: '7', icon: 'clock' },
  { label: 'Reported posts', value: '3', icon: 'flag' },
  { label: 'Active clubs', value: '18', icon: 'users' },
];

const QUICK_ACTIONS = [
  { title: 'Create event', icon: 'plus-circle' },
  { title: 'Review reports', icon: 'shield' },
  { title: 'Invite admins', icon: 'user-plus' },
  { title: 'Export activity', icon: 'download' },
];

const PENDING_ITEMS = [
  {
    title: 'Tech Fest opening keynote',
    meta: 'Awaiting approval · CSE Department',
    status: 'Urgent',
  },
  {
    title: 'Club fair volunteers',
    meta: '2 reports attached · Student Council',
    status: 'Needs review',
  },
  {
    title: 'Hackathon venue update',
    meta: 'Pending schedule change · Campus Hall',
    status: 'Scheduled',
  },
];

const ACTIVITY = [
  { title: 'Approved cultural night banner', time: '10m ago' },
  { title: 'Archived duplicate RSVP form', time: '35m ago' },
  { title: 'Published sports meet announcement', time: '2h ago' },
];

const Admin = () => {
  const navigation = useNavigation();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar backgroundColor={colors.background} barStyle="dark-content" />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <View>
            <Text style={styles.kicker}>Administration</Text>
            <Text style={styles.title}>Control center</Text>
          </View>

          <Pressable style={styles.iconButton} onPress={() => navigation.goBack()}>
            <Icon name="arrow-left" size={18} color={colors.textPrimary} />
          </Pressable>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.heroTopRow}>
            <View style={styles.heroBadge}>
              <Icon name="shield" size={16} color={colors.background} />
            </View>
            <Text style={styles.heroTag}>Protected workspace</Text>
          </View>
          <Text style={styles.heroHeadline}>Manage events, reports, and campus activity from one place.</Text>
          <Text style={styles.heroCopy}>
            Track approvals, respond to reports, and keep the student feed organized without
            leaving the app.
          </Text>
        </View>

        <View style={styles.statsGrid}>
          {STATS.map(stat => (
            <View key={stat.label} style={styles.statCard}>
              <View style={styles.statIconWrap}>
                <Icon name={stat.icon} size={16} color={colors.primary} />
              </View>
              <Text style={styles.statValue}>{stat.value}</Text>
              <Text style={styles.statLabel}>{stat.label}</Text>
            </View>
          ))}
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Quick actions</Text>
            <Text style={styles.sectionMeta}>Most used this week</Text>
          </View>

          <View style={styles.actionGrid}>
            {QUICK_ACTIONS.map(action => (
              <Pressable
                key={action.title}
                style={({ pressed }) => [styles.actionCard, pressed && styles.actionCardPressed]}
                onPress={() => Alert.alert(action.title, 'This action can be connected to your admin workflow.')}
              >
                <View style={styles.actionIconWrap}>
                  <Icon name={action.icon} size={18} color={colors.textPrimary} />
                </View>
                <Text style={styles.actionTitle}>{action.title}</Text>
              </Pressable>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Pending review</Text>
            <Text style={styles.sectionMeta}>Needs your attention</Text>
          </View>

          <View style={styles.queueCard}>
            {PENDING_ITEMS.map((item, index) => (
              <View
                key={item.title}
                style={[styles.queueItem, index !== PENDING_ITEMS.length - 1 && styles.queueDivider]}
              >
                <View style={styles.queueContent}>
                  <Text style={styles.queueTitle}>{item.title}</Text>
                  <Text style={styles.queueMeta}>{item.meta}</Text>
                </View>
                <View style={styles.queueStatus}>
                  <Text style={styles.queueStatusText}>{item.status}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent activity</Text>
            <Text style={styles.sectionMeta}>Latest updates</Text>
          </View>

          <View style={styles.timelineCard}>
            {ACTIVITY.map((item, index) => (
              <View
                key={item.title}
                style={[styles.timelineRow, index !== ACTIVITY.length - 1 && styles.timelineDivider]}
              >
                <View style={styles.timelineDot} />
                <View style={styles.timelineTextWrap}>
                  <Text style={styles.timelineTitle}>{item.title}</Text>
                  <Text style={styles.timelineTime}>{item.time}</Text>
                </View>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

export default Admin;

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingTop: 10,
    paddingBottom: 32,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  kicker: {
    fontSize: 12,
    textTransform: 'uppercase',
    letterSpacing: 1.2,
    color: colors.textSecondary,
    marginBottom: 4,
    fontWeight: '700',
  },
  title: {
    fontSize: 30,
    fontWeight: '800',
    color: colors.textPrimary,
    letterSpacing: -0.6,
  },
  iconButton: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  heroCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 20,
    marginBottom: 18,
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 16,
  },
  heroBadge: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
  },
  heroTag: {
    color: colors.background,
    fontWeight: '700',
    letterSpacing: 0.2,
  },
  heroHeadline: {
    color: colors.background,
    fontSize: 24,
    fontWeight: '800',
    lineHeight: 32,
    marginBottom: 8,
  },
  heroCopy: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    lineHeight: 21,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 18,
  },
  statCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  statIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statValue: {
    fontSize: 28,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: colors.textSecondary,
    fontWeight: '600',
    lineHeight: 18,
  },
  section: {
    marginBottom: 18,
  },
  sectionHeader: {
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  sectionMeta: {
    fontSize: 13,
    color: colors.textSecondary,
  },
  actionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  actionCard: {
    width: '48%',
    backgroundColor: colors.surface,
    borderRadius: 18,
    padding: 16,
    minHeight: 110,
    justifyContent: 'space-between',
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
  },
  actionCardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  actionIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    lineHeight: 20,
  },
  queueCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    overflow: 'hidden',
  },
  queueItem: {
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
  },
  queueDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  queueContent: {
    flex: 1,
  },
  queueTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 4,
  },
  queueMeta: {
    fontSize: 13,
    color: colors.textSecondary,
    lineHeight: 18,
  },
  queueStatus: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 999,
    backgroundColor: colors.background,
  },
  queueStatusText: {
    fontSize: 12,
    fontWeight: '700',
    color: colors.textPrimary,
  },
  timelineCard: {
    backgroundColor: colors.surface,
    borderRadius: 18,
    borderWidth: StyleSheet.hairlineWidth,
    borderColor: colors.border,
    paddingVertical: 8,
  },
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  timelineDivider: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: colors.border,
  },
  timelineDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: colors.primary,
    marginTop: 4,
  },
  timelineTextWrap: {
    flex: 1,
  },
  timelineTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.textPrimary,
    marginBottom: 2,
  },
  timelineTime: {
    fontSize: 12,
    color: colors.textSecondary,
  },
});