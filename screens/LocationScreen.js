import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Button, TouchableOpacity, FlatList, Linking, Platform, Image } from 'react-native';
import MapView, { Marker, Callout } from 'react-native-maps';
import { Colors, db, Images } from '../config';
import { HeaderComponent, Logo } from '../components';
import * as Location from 'expo-location';
import { collection, getDocs } from 'firebase/firestore';

export const LocationScreen = ({ route, user, navigation }) => {

    return (
        <>
            <HeaderComponent navigation={navigation} title="Locations" navigationTo="back" />
            <View style={styles.container}><Text style={styles.title}>{"Location screen"}</Text></View>
        </>
    )
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        zIndex: -1,
        backgroundColor: Colors.white,
    },
    title: {
        fontSize: 32,
        fontWeight: '600',
        color: Colors.black,
        paddingTop: 20,
        textAlign: 'center',
    }
});

export default LocationScreen;
