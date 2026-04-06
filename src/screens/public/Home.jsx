import { StyleSheet, Text, View } from 'react-native';
import React from 'react';

const Home = () => {
  return (
    <View style={styles.main}>
      <View style={styles.secondMain}>
        <View style={styles.upper}>
          <View>
            <Text>UserName</Text>
          </View>
          <View>
            <View style={styles.user} />
          </View>
        </View>
        <View style={styles.lower}>
          <Text>MAin body</Text>
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
  },
  secondMain: {
    flex: 1,
  },
  upper: {
    backgroundColor: '#dadada',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  user: {
    height: 40,
    width: 40,
    borderRadius: 50,
    backgroundColor: 'red',
  },
  lower: {
    marginTop: 20,
    backgroundColor: '#dadada',
  },
});
