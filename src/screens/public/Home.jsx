import {
  StyleSheet,
  Text,
  View,
  StatusBar,
  Pressable,
  Image,
} from 'react-native';
import Icon from 'react-native-vector-icons/Feather';

const Home = () => {
  const events = ['All', 'Tech', 'Business', 'Art', 'Music', 'Sports'];

  return (
    <View style={styles.main}>
      <StatusBar backgroundColor="#FFFCF7" barStyle="dark-content" />
      <View style={styles.secondMain}>
        <View style={styles.upper}>
          <View style={styles.upperLeft}>
            <View>
              <View style={styles.user} />
            </View>
            <View>
              <Text>Welcome</Text>
              <Text style={styles.upperUserText}>Partha</Text>
            </View>
          </View>
          <View>
            <Pressable>
              <Icon name="bell" size={28} color="black" />
            </Pressable>
          </View>
        </View>
        <View style={styles.mid}>
          <View>
            <Text style={styles.catText}>Categories</Text>
          </View>
          <View style={styles.eventFilterButton}>
            {events.map((event, index) => (
              <Pressable key={index} style={styles.eventbtn}>
                <Text>{event}</Text>
              </Pressable>
            ))}
          </View>
        </View>
        <View style={styles.lower}>
          <View style={styles.card}>
            <View style={styles.cardImage}>
              <Image
                source={require('../../../assets/log-transparent.png')}
                style={styles.cardImageStyle}
              />
            </View>
            <View style={styles.cardDetails}>
              <View>
                <Text style={styles.eventName}>Event Name</Text>
                <Text style={styles.eventDesc}>
                  Event description goes here
                </Text>
              </View>
              <View style={styles.cardFooter}>
                <View style={styles.stats}>
                  <Icon name="users" size={14} color="#aaa" />
                  <Text style={styles.statText}>312</Text>
                  <Icon name="file-text" size={14} color="#aaa" />
                  <Text style={styles.statText}>48</Text>
                </View>
                <Pressable style={styles.followBtn}>
                  <Text style={styles.followText}>Follow</Text>
                  <Icon name="plus" size={14} color="#111" />
                </Pressable>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardImage}>
              <Image
                source={require('../../../assets/log-transparent.png')}
                style={styles.cardImageStyle}
              />
            </View>
            <View style={styles.cardDetails}>
              <View>
                <Text style={styles.eventName}>Event Name</Text>
                <Text style={styles.eventDesc}>
                  Event description goes here
                </Text>
              </View>
              <View style={styles.cardFooter}>
                <View style={styles.stats}>
                  <Icon name="users" size={14} color="#aaa" />
                  <Text style={styles.statText}>312</Text>
                  <Icon name="file-text" size={14} color="#aaa" />
                  <Text style={styles.statText}>48</Text>
                </View>
                <Pressable style={styles.followBtn}>
                  <Text style={styles.followText}>Follow</Text>
                  <Icon name="plus" size={14} color="#111" />
                </Pressable>
              </View>
            </View>
          </View>
          <View style={styles.card}>
            <View style={styles.cardImage}>
              <Image
                source={require('../../../assets/log-transparent.png')}
                style={styles.cardImageStyle}
              />
            </View>
            <View style={styles.cardDetails}>
              <View>
                <Text style={styles.eventName}>Event Name</Text>
                <Text style={styles.eventDesc}>
                  Event description goes here
                </Text>
              </View>
              <View style={styles.cardFooter}>
                <View style={styles.stats}>
                  <Icon name="users" size={14} color="#aaa" />
                  <Text style={styles.statText}>312</Text>
                  <Icon name="file-text" size={14} color="#aaa" />
                  <Text style={styles.statText}>48</Text>
                </View>
                <Pressable style={styles.followBtn}>
                  <Text style={styles.followText}>Follow</Text>
                  <Icon name="plus" size={14} color="#111" />
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Home;

const styles = StyleSheet.create({
  main: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFFCF7',
  },
  secondMain: {
    flex: 1,
  },
  upper: {
    position: 'fixed',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  user: {
    height: 60,
    width: 60,
    borderRadius: 50,
    backgroundColor: 'red',
  },
  upperUserText: {
    fontSize: 40,
    fontWeight: 400,
  },
  upperLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  mid: {
    height: 70,
    marginTop: 12,
  },
  lower: {
    flex: 1,
    marginTop: 12,
    gap: 12,
  },
  card: {
    backgroundColor: '#0c0c0c',
    borderRadius: 20,
    overflow: 'hidden',
    width: '100%',
  },
  cardImage: {
    width: '100%',
    height: 200,
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
    borderRadius: 50,
  },
  followText: {
    color: '#111',
    fontSize: 13,
    fontWeight: '500',
  },
  eventFilterButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    gap: 4,
    marginLeft: 12,
  },
  eventbtn: {
    backgroundColor: '#d5c7c7ff',
    padding: 12,
    borderRadius: 50,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 6,
  },
  catText: {
    fontSize: 16,
    marginLeft: 12,
    textTransform: 'uppercase',
    fontWeight: '400',
  },
});
