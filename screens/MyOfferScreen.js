import React, { useState, useContext, useEffect, useRef } from 'react';
import { Image, Dimensions, Animated, ScrollView, StyleSheet, Text, View, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Colors, auth } from '../config';
import { HeaderComponent } from '../components';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthenticatedUserContext } from '../providers';
import { getOffers, getmyOffers, fetchUserDetails, fetchUserOffers } from '../services';

const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
const ITEM_WIDTH = screenWidth * 0.9;
const OVERLAP_RATIO = 0.01;

export const MyOfferScreen = ({ navigation }) => {
  const [loading, setLoading] = useState(true);
  const [ogaloOffers, setOgaloOffers] = useState([]);
  const [myOffers, setMyOffers] = useState([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [activemyOffersIndex, setActivemyOffersIndex] = useState(0);
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const bannerScrollViewRef = useRef(null);
  const myOffersScrollViewRef = useRef(null);
  const [userDetail, setUserDetail] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        const ogaloOffers = await getOffers();
        setOgaloOffers(ogaloOffers);
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setLoading(false);
    };

    fetchData();
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authenticatedUser => {
      setUser(authenticatedUser);
    });

    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    const getUserOffers = async () => {
      if (user && user.uid) {
        try {
          const offers = await fetchUserOffers(user.uid);
          console.log('user offers', offers)
          setMyOffers(offers);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    getUserOffers();
  }, [user]);
  const handleBannerScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / ITEM_WIDTH);
    setActiveBannerIndex(index);
  };

  const handlemyOffersScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / ITEM_WIDTH);
    setActivemyOffersIndex(index);
  };

  const openModal = (item) => {
    setSelectedItem(item);
    setModalVisible(true);
  };

  const closeModal = (event) => {
    // Check if the tap occurred within the modal content
    if (event.target === event.currentTarget) {
      setSelectedItem(null);
      setModalVisible(false);
    }
  };

  return (
    <>
      <HeaderComponent navigation={navigation} />
      {loading && (
        <View style={styles.container}>
          <Text>Loading...</Text>
        </View>
      )}
      <ScrollView>
        <View>
          <View style={styles.featuredContainer}>
            <Text style={styles.title}>Your Offers</Text>
            <Animated.FlatList
              horizontal
              data={myOffers}
              keyExtractor={(item) => item.uid}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => openModal(item)}>
                  <View style={[styles.featuredImageContainer, styles.imageSpacing]}>
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.featuredImage}
                    />
                  </View>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={ITEM_WIDTH + screenWidth * OVERLAP_RATIO}
              decelerationRate="fast"
              onScroll={handlemyOffersScroll}
              scrollEventThrottle={16}
              ref={myOffersScrollViewRef}
            />
            <View style={styles.dotsContainer}>
              {myOffers.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => myOffersScrollViewRef.current.scrollToIndex({ index, animated: true })}
                  style={[styles.dot, activemyOffersIndex === index ? styles.activeDot : null]}
                />
              ))}
            </View>
          </View>
          <View style={styles.featuredContainer}>
            <Text style={styles.title}>Ogalo Offers</Text>
            <Animated.FlatList
              horizontal
              data={ogaloOffers}
              keyExtractor={(item) => item.uid}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => openModal(item)}>
                  <View style={[styles.featuredImageContainer, index !== ogaloOffers.length - 1 && styles.imageSpacing]}>
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.featuredImage}
                    />
                  </View>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={ITEM_WIDTH + screenWidth * OVERLAP_RATIO}
              decelerationRate="fast"
              onScroll={handleBannerScroll}
              scrollEventThrottle={16}
              ref={bannerScrollViewRef}
            />
            <View style={styles.dotsContainer}>
              {ogaloOffers.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => bannerScrollViewRef.current.scrollToIndex({ index, animated: true })}
                  style={[styles.dot, activeBannerIndex === index ? styles.activeDot : null]}
                />
              ))}
            </View>
          </View>
        </View>
      </ScrollView>
      {/* Corrected wrapping of Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={closeModal}>
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedItem && (
                <>
                  <Image source={{ uri: selectedItem.imageUrl }} style={styles.selectedImage} />
                  <Text style={styles.detailsText}>{selectedItem.details}</Text>
                </>
              )}
            </View>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    zIndex: -1,
    backgroundColor: Colors.white,
  },
  featuredContainer: {
    marginTop: 16,
    marginLeft: 0,
    marginRight: 0,
  },
  title: {
    fontSize: 24,
    marginTop: 6,
    marginBottom: 10,
    marginLeft: 8,
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 10,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: Colors.yellow,
    paddingHorizontal: 16,
  },
  featuredImageContainer: {
    width: ITEM_WIDTH,
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginLeft: 2,
  },
  imageSpacing: {
    marginRight: screenWidth * OVERLAP_RATIO,
  },
  featuredImage: {
    flex: 1,
    resizeMode: 'cover',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    paddingTop: 0,

  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 10,
    padding: 2,
    alignItems: 'center',
  },
  selectedImage: {
    width: screenWidth - 10,
    height: screenHeight * 0.46,
    borderRadius: 10,
    resizeMode: 'contain',
  },
  detailsText: {
    fontSize: 16,
    color: Colors.black,
    padding: 16,
    paddingBottom: 20,
  },
});

export default MyOfferScreen;
