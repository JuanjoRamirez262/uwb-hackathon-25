import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import Carousel from 'react-native-reanimated-carousel';

const { width: screenWidth } = Dimensions.get('window');

const data = [
  {
    // Susi
    id: '1',
    image: require('../assets/image1.png'),
    description: 'Hi Dad, this is Sarah, your only daughter',
  },
  {
    // Omar
    id: '2',
    image: require('../assets/image2.png'),
    description: 'Hey Dad, this is David',
  },
  {
    // Quan
    id: '3',
    image: require('../assets/image3.png'),
    description: 'Hey Pops, I\'m John, your son',
  },
  {
    // Juan
    id: '4',
    image: require('../assets/image4.png'),
    description: 'Hey Pa, this is Kevin, your oldest son',
  }
];

export default function CarouselComponent() {
  const renderItem = ({ item }: { item: typeof data[0] }) => (
    <View style={styles.card}>
      <Image source={item.image} style={styles.image} />
      <Text style={styles.description}>{item.description}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Carousel
        width={screenWidth}
        height={450}
        data={data}
        renderItem={renderItem}
        loop={true}
        autoPlay={true}
        autoPlayInterval={3000}
        scrollAnimationDuration={1000}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    marginBottom: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 10,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
    padding: 16,
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: 400,
    borderRadius: 10,
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
    color: '#333',
  },
});