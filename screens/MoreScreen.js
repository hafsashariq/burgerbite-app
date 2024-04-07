import React, {  } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { Colors } from '../config';
import { HeaderComponent } from '../components';
export const MoreScreen = ({ navigation }) => {

    return (
        <>
            <HeaderComponent navigation={navigation} />
            <View style={styles.container}><Text style={styles.title}>{"More screen"}</Text></View>
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
