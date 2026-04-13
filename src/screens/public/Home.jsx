import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
  Image,
  ScrollView,
  useWindowDimensions,
} from 'react-native';
import { useState, useEffect } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { useAuth } from '../../context/userAuth.jsx';
import axios from '../../utils/axios.js';

const EVENTS_CATEGORIES = ['All', 'Tech', 'Business', 'Art', 'Music', 'Sports'];

const Home = () => {
  const { width } = useWindowDimensions();
  const { user } = useAuth();

  const [events, setEvents] = useState([]);

  useEffect(() => {
    axios
      .get('/events')
      .then(res => setEvents(res.data))
      .catch(err => {
        console.log(err.res?.data);
      });
  }, []);

  const isTablet = width >= 768;
  const cardWidth = isTablet ? (width - 60) / 2 : '100%';
  const avatarSize = isTablet ? 72 : 56;
  const nameFontSize = isTablet ? 48 : 36;
  const imageHeight = isTablet ? 240 : 180;
  const filterBtnWidth = isTablet
    ? 100
    : Math.floor((width - 64) / EVENTS_CATEGORIES.length);

  return (
    <SafeAreaProvider>
      <View style={styles.container}>
        <StatusBar backgroundColor="#FFFCF7" barStyle="dark-content" />
        <View style={styles.upper}>
          <View style={styles.upperLeft}>
            <Image
              source={
                user?.profilePhotoUrl
                  ? { uri: user.profilePhotoUrl }
                  : require('../../../assets/logo.png')
              }
              style={[styles.appImage, { height: avatarSize, width: avatarSize }]}
              resizeMode="cover"
            />
            <View>
              <Text style={styles.welcomeText}>Welcome</Text>
              <Text style={[styles.upperUserText, { fontSize: nameFontSize }]}>
                {user.name}
              </Text>
            </View>
          </View>
          <Pressable>
            <Icon name="bell" size={isTablet ? 32 : 26} color="black" />
          </Pressable>
        </View>
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <View style={styles.main}>
            <View style={styles.mid}>
              <Text style={styles.catText}>Categories</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.eventFilterButton}
              >
                {EVENTS_CATEGORIES.map((event, index) => (
                  <Pressable
                    key={index}
                    style={[styles.eventbtn, { width: filterBtnWidth }]}
                  >
                    <Text style={styles.eventText}>{event}</Text>
                  </Pressable>
                ))}
              </ScrollView>
            </View>
            <View style={[styles.lower, isTablet && styles.lowerTablet]}>
              {events.map(event => (
                <View
                  key={event.id}
                  style={[styles.card, { width: cardWidth }]}
                >
                  <View style={[styles.cardImage, { height: imageHeight }]}>
                    <Image
                      source={require('../../../assets/log-transparent.png')}
                      style={styles.cardImageStyle}
                    />
                  </View>
                  <View style={styles.cardDetails}>
                    <View>
                      <Text style={styles.eventName}>{event.title}</Text>
                      <Text style={styles.eventDesc}>{event.desc}</Text>
                    </View>
                    <View style={styles.cardFooter}>
                      <View style={styles.stats}>
                        <Icon name="map-pin" size={14} color="#aaa" />
                        <Text style={styles.statText}>{event.venue}</Text>
                        <Icon name="users" size={14} color="#aaa" />
                        <Text style={styles.statText}>{event.createdBy}</Text>
                      </View>
                      <Pressable style={styles.followBtn}>
                        <Text style={styles.followText}>Follow</Text>
                        <Icon name="plus" size={14} color="#111" />
                      </Pressable>
                    </View>
                  </View>
                </View>
              ))}
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
    paddingBottom: 90,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFFCF7',
  },
  main: {
    flex: 1,
    paddingHorizontal: 20,
    backgroundColor: '#FFFCF7',
  },
  upper: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#FFFCF7',
  },
  upperLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  appImage: {
    borderRadius: 999,
    backgroundColor: '#e0e0e0',
  },
  welcomeText: {
    fontSize: 13,
    color: '#888',
  },
  upperUserText: {
    fontWeight: '400',
    lineHeight: 48,
  },
  mid: {
    marginTop: 16,
  },
  catText: {
    fontSize: 13,
    textTransform: 'uppercase',
    fontWeight: '500',
    letterSpacing: 1,
    color: '#444',
    marginBottom: 8,
  },
  eventFilterButton: {
    flexDirection: 'row',
    gap: 8,
    paddingVertical: 4,
  },
  eventbtn: {
    backgroundColor: '#d5c7c7ff',
    paddingVertical: 10,
    borderRadius: 999,
    alignItems: 'center',
    justifyContent: 'center',
  },
  eventText: {
    fontSize: 13,
    fontWeight: '500',
    color: '#222',
  },
  lower: {
    marginTop: 16,
    gap: 14,
  },
  lowerTablet: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    backgroundColor: '#0c0c0c',
    borderRadius: 20,
    overflow: 'hidden',
  },
  cardImage: {
    width: '100%',
    backgroundColor: '#141414',
  },
  cardImageStyle: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  cardDetails: {
    padding: 14,
    gap: 12,
  },
  eventName: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  eventDesc: {
    color: '#aaa',
    fontSize: 13,
    marginTop: 4,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stats: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#aaa',
    fontSize: 13,
  },
  followBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#ecdbdbff',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
  },
  followText: {
    color: '#111',
    fontSize: 13,
    fontWeight: '500',
  },
});
