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

  return (
    <>
      <HeaderComponent navigation={navigation}/>
      <View style={styles.container}><Text style={styles.title}>{"My Offers screen"}</Text></View>
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

export default MyOfferScreen;
