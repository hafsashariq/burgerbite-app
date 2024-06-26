import React, { useState, useContext, useEffect, useRef } from 'react';
import { Image, Dimensions, Animated, ScrollView, StyleSheet, Text, View, TouchableOpacity } from 'react-native';
import { Colors, auth } from '../config';
import { Icon, HeaderComponent, LoginComponent } from '../components';
import QRCode from 'react-native-qrcode-svg';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthenticatedUserContext } from '../providers';
import { fetchUserDetails, getBanners, getWhatsNew } from '../services';

const screenWidth = Dimensions.get('window').width;
const ITEM_WIDTH = screenWidth * 0.9; // Take 80% of the screen width for the item
const ITEM_HEIGHT = 300;
const OVERLAP_RATIO = 0.01; // Adjust overlap ratio as needed

export const HomeScreen = ({ navigation }) => {
  const [userDetail, setUserDetail] = useState({});
  const [loading, setLoading] = useState(true);
  const [banners, setBanners] = useState([]);
  const [whatsNew, setWhatsNew] = useState([]);
  const [activeBannerIndex, setActiveBannerIndex] = useState(0);
  const [activeWhatsNewIndex, setActiveWhatsNewIndex] = useState(0);
  const { user, setUser } = useContext(AuthenticatedUserContext);
  const scrollXBanner = useRef(new Animated.Value(0)).current;
  const scrollXWhatsNew = useRef(new Animated.Value(0)).current;
  const bannerScrollViewRef = useRef(null);
  const whatsNewScrollViewRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const bannerData = await getBanners();
        setBanners(bannerData.sort((a, b) => a.sort - b.sort));

        const whatsNewData = await getWhatsNew();
        setWhatsNew(whatsNewData);
      } catch (error) {
        console.error('Error fetching data:', error);
      }

      setLoading(false);
    };

    fetchData(); // Call fetchData only when component mounts
  }, []); // Empty dependency array to ensure it runs only once on mount

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, authenticatedUser => {
      setUser(authenticatedUser);
    });

    return () => unsubscribe();
  }, [setUser]);

  useEffect(() => {
    const fetchUserData = async () => {
      if (user && user.uid) {
        try {
          const userDetails = await fetchUserDetails(user.uid);
          console.log('userDetails', userDetails)
          setUserDetail(userDetails);
        } catch (error) {
          console.error('Error fetching user details:', error);
        }
      }
    };

    fetchUserData();
  }, [user]);

  // Update the scroll event handlers to set the active index
  const handleBannerScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / ITEM_WIDTH);
    setActiveBannerIndex(index);
  };

  const handleWhatsNewScroll = (event) => {
    const contentOffsetX = event.nativeEvent.contentOffset.x;
    const index = Math.round(contentOffsetX / ITEM_WIDTH);
    setActiveWhatsNewIndex(index);
  };

  const handleImagePress = (item, title) => {
    // Navigate to DetailsScreen and pass item details as params
    navigation.navigate('DetailScreen', { item, title });
  };

  const getCustomerCard = (user) => {
    return (
      <View style={styles.qrSection}>
        <View style={styles.qrCodeContainer}>
          <QRCode value={String(user.memberNumber)} size={135} />
        </View>
        <View style={styles.pointsBalanceContainer}>
          <Text style={styles.customerName}>{user.firstName} {user.lastName}</Text>
          <Text style={styles.titleText}>Member Number</Text>
          <Text style={styles.pointBalance}>{user.memberNumber}</Text>
          <Text style={styles.titleText}>Store Points</Text>
          <Text style={styles.pointBalance}>{user.pointBalance ? user.pointBalance.toLocaleString() : 0}</Text>
        </View>
      </View>
    );
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
        {/* Banners */}
        <View>
          {/* User Details Section */}
          {user ? (
            getCustomerCard(userDetail)
          ) : (
            <LoginComponent navigation={navigation} />
          )}

          {/* What's New section */}
          <View style={styles.featuredContainer}>
            <Text style={styles.title}>What's New</Text>
            <Animated.FlatList
              horizontal
              data={whatsNew}
              keyExtractor={(item) => item.uid}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => handleImagePress(item,"What's New")}>
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
              snapToInterval={ITEM_WIDTH + screenWidth * OVERLAP_RATIO} // Adjusted snap interval
              decelerationRate="fast"
              onScroll={handleWhatsNewScroll} // Update to use handleWhatsNewScroll
              scrollEventThrottle={16}
              ref={whatsNewScrollViewRef}
            />
            {/* Dots for What's New */}
            <View style={styles.dotsContainer}>
              {whatsNew.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => whatsNewScrollViewRef.current.scrollToIndex({ index, animated: true })}
                  style={[styles.dot, activeWhatsNewIndex === index ? styles.activeDot : null]}
                />
              ))}
            </View>
          </View>
          <View style={styles.featuredContainer}>
            <Text style={styles.title}>Featured</Text>
            <Animated.FlatList
              horizontal
              data={banners}
              keyExtractor={(item) => item.uid}
              renderItem={({ item, index }) => (
                <TouchableOpacity onPress={() => handleImagePress(item, "Featured")}>
                  <View style={[styles.featuredImageContainer, index !== banners.length - 1 && styles.imageSpacing]}>
                    <Image
                      source={{ uri: item.imageUrl }}
                      style={styles.featuredImage}
                    />
                  </View>
                </TouchableOpacity>
              )}
              showsHorizontalScrollIndicator={false}
              pagingEnabled
              snapToInterval={ITEM_WIDTH + screenWidth * OVERLAP_RATIO} // Adjusted snap interval
              decelerationRate="fast"
              onScroll={handleBannerScroll} // Update to use handleBannerScroll
              scrollEventThrottle={16}
              ref={bannerScrollViewRef}
            />
            {/* Dots for Banners */}
            <View style={styles.dotsContainer}>
              {banners.map((_, index) => (
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
  titleText: {
    fontSize: 16,
    paddingTop: 10,
    fontWeight: '600'
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
    paddingHorizontal: 16, // Adjust padding as needed
  },
  qrSection: {
    backgroundColor: Colors.yellow,
    borderRadius: 14,
    color: Colors.white,
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginHorizontal: 10,
    marginTop: 20,
  },
  qrCodeContainer: {
    padding: 16,
    paddingRight: 0,
  },
  pointsBalanceContainer: {
    flex: 1,
    alignItems: 'flex-start',
    marginLeft: 20,
    color: Colors.white,
    textTransform: 'uppercase',
  },
  customerName: {
    fontWeight: 'bold',
    color: Colors.black,
    fontSize: 22,
    textTransform: 'uppercase',
    paddingTop: 12,
  },
  pointBalance: {
    fontWeight: 'bold',
    marginBottom: 5,
    color: Colors.darkGrey,
    fontSize: 16,
    marginTop: 5,
    borderRadius: 16,
  },
  featuredImageContainer: {
    width: ITEM_WIDTH, // Take 80% of the screen width for the item
    height: 200,
    borderRadius: 10,
    overflow: 'hidden',
    marginLeft: 2, // Add spacing between images
  },
  imageSpacing: {
    marginRight: screenWidth * OVERLAP_RATIO, // Adjust overlap spacing
  },
  featuredImage: {
    flex: 1,
    resizeMode: 'cover',
  },
});

export default HomeScreen;
