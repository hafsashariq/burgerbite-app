import React from 'react';
import { View, TouchableOpacity, StyleSheet, Text } from 'react-native'; // Assuming you're using React Native
import { Logo, Icon } from '../components';
import { Images, Colors } from '../config';

export const HeaderComponent = ({ navigation, title, navigationTo }) => {
    return (
        <View style={styles.header}>
            <View style={styles.headerLeft}>
                {navigationTo ? (
                    <TouchableOpacity style={{ paddingTop:14}} onPress={() => navigation.goBack()}>
                        <Icon name="keyboard-backspace" size={24} color="black" />
                    </TouchableOpacity>
                ) :
                    <TouchableOpacity onPress={() => navigation.navigate('HomeScreen')}>
                        <Logo uri={Images.logo} width={80} height={40} />
                    </TouchableOpacity>
                }
            </View>
            <View style={styles.headerCenter}>
                <Text style={styles.title}>{title}</Text>
            </View>
            <View style={styles.headerRight}>
                <TouchableOpacity onPress={() => navigation.navigate('LocationScreen')}>
                    <Icon name="map-outline" size={32} color={Colors.darkGrey} />
                </TouchableOpacity>
            </View>
        </View>
    );
};


const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 16,
        paddingBottom: 8,
        backgroundColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.50,
        shadowRadius: 4,
        elevation: 5,
        paddingTop: 60
    },
    headerLeft: {
        flex: 1,
    },
    headerCenter: {
        flex: 2, // Adjust as per your requirement
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: 16,
    },
    headerRight: {
        flex: 1,
        alignItems: 'flex-end',
        paddingTop: 8
    },
    banner: {
        paddingVertical: 10,
    },
    welcomeText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.black, // Adjust color as needed
    }
});
