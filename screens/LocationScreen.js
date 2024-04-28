import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, FlatList, Linking, Platform, Image } from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import { Colors, db, Images } from '../config';
import { HeaderComponent, Logo } from '../components';
import * as Location from 'expo-location';
import { collection, getDocs } from 'firebase/firestore';

export const LocationScreen = ({ route, user, navigation }) => {
    const navigationTo = route?.params?.navigationTo;
    const [currentRegion, setCurrentRegion] = useState(null);
    const [selectedLocation, setSelectedLocation] = useState(null);
    const [allLocations, setAllLocations] = useState([]);

    useEffect(() => {
        fetchBannersFromFirestore();
    }, []);

    const fetchBannersFromFirestore = async () => {
        try {
            const locationColl = collection(db, 'locations');
            const locSnapshot = await getDocs(locationColl);
            const locations = locSnapshot.docs.map(doc => doc.data());
            setAllLocations(locations);
        } catch (error) {
            console.error('Error fetching banners:', error);
        }
    };

    useEffect(() => {
        // Get the current location
        (async () => {
            let { status } = await Location.requestForegroundPermissionsAsync();
            if (status !== 'granted') {
                console.error('Permission to access location was denied');
                return;
            }

            let location = await Location.getCurrentPositionAsync({});
            setCurrentRegion({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
                latitudeDelta: 0.0922,
                longitudeDelta: 0.0421,
            });
        })();
    }, []);

    const handleAddressPress = (location) => {
        console.log(location);
        setSelectedLocation(location);
    };

    const handleGetDirections = (location) => {
        const { coordinates } = location;
        const lat = coordinates.latitude;
        const lng = coordinates.longitude;

        // Construct the URL for the mapping application with the destination coordinates
        const url = Platform.select({
            ios: `maps://app?saddr=Current+Location&daddr=${lat},${lng}`,
            android: `google.navigation:q=${lat},${lng}`,
        });

        console.log("Directions URL:", url);

        // Open the mapping application
        Linking.canOpenURL(url)
            .then((supported) => {
                if (!supported) {
                    console.log("Can't handle directions");
                } else {
                    return Linking.openURL(url);
                }
            })
            .catch((err) => console.error('An error occurred', err));
    };

    const handleCallPhoneNumber = (phoneNumber) => {
        // Handle initiating a phone call
        Linking.openURL(`tel:${phoneNumber}`);
    };

    const getLocationDetails = (location) => {
        return `${location.name}`;
    }

    const renderItem = ({ item }) => (
        <>
            {item.isActive && (
                <TouchableOpacity
                    style={[
                        styles.addressContainer,
                        selectedLocation && selectedLocation.name === item.name && styles.selectedAddressContainer
                    ]}
                    onPress={() => handleAddressPress(item)}
                >
                    <View style={styles.addressInfoContainer}>
                        <Text style={styles.locationName}>{item.name}</Text>
                        <Text style={styles.addressText}>{item.address}</Text>
                        <TouchableOpacity onPress={() => handleCallPhoneNumber(item.phoneNumber)}>
                            <Text style={styles.phoneNumber}>{item.phoneNumber}</Text>
                        </TouchableOpacity>
                    </View>
                    <View style={styles.directionsContainer}>
                        <Button title="Get Directions" onPress={() => handleGetDirections(item)} />
                    </View>
                </TouchableOpacity>
            )}
        </>
    );

    return (
        <>
            <HeaderComponent navigation={navigation} title="Locations" navigationTo={navigationTo} />
            <View isSafe style={styles.container}>
                <MapView
                    style={styles.map}
                    initialRegion={currentRegion}
                    region={
                        selectedLocation
                            ? {
                                latitude: selectedLocation.coordinates.latitude,
                                longitude: selectedLocation.coordinates.longitude,
                                latitudeDelta: 0.01,
                                longitudeDelta: 0.01
                            }
                            : currentRegion
                                ? {
                                    latitude: currentRegion.latitude,
                                    longitude: currentRegion.longitude,
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01
                                }
                                : {
                                    // Default to Sydney's coordinates if currentRegion is unavailable
                                    latitude: -33.8688, // Sydney latitude
                                    longitude: 151.2093, // Sydney longitude
                                    latitudeDelta: 0.01,
                                    longitudeDelta: 0.01
                                }
                    }
                >
                    {allLocations.map((location, index) => (
                        <Marker
                            key={index}
                            coordinate={location.coordinates}
                            title={getLocationDetails(location)}
                            pinColor={selectedLocation && selectedLocation.name === location.name ? 'red' : 'blue'}>
                            <Logo uri={Images.logo} width={80} height={40} />
                        </Marker>
                    ))}
                </MapView>
                <FlatList
                    data={allLocations}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => index.toString()}
                />
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: -1,
        backgroundColor: Colors.white,
    },
    locationsHeading: {
        fontSize: 32,
        fontWeight: '600',
        color: Colors.black,
        paddingTop: 20,
        textAlign: 'center',
    },
    map: {
        height: 300,
        marginVertical: 20,
    },
    addressContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 10,
        paddingHorizontal: 20,
    },
    selectedAddressContainer: {
        backgroundColor: Colors.politicalGray,
    },
    addressInfoContainer: {
        flex: 1,
        paddingBottom: 10,
    },
    locationName: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 5,
    },
    addressText: {
        fontSize: 16,
        marginBottom: 5,
    },
    phoneNumber: {
        fontSize: 16,
        color: Colors.mediumGray,
        textDecorationLine: 'underline',
    },
    directionsContainer: {
        marginTop: 10,
        marginLeft: 20,
    },
});

export default LocationScreen;
