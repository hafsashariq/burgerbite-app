import React from 'react';
import { View, Text, Image, StyleSheet, Dimensions } from 'react-native';
import { HeaderComponent } from '../components';
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;
export const DetailScreen = ({ route, navigation }) => {
    // Extract item details from navigation params
    const { item, title } = route.params;

    return (
        <>
            <HeaderComponent navigation={navigation} title={title} navigationTo="home" />
            <View style={styles.container}>
                <Text style={styles.title}>{item.title}</Text>
                <Image source={{ uri: item.imageUrl }} style={styles.image} />
                <Text style={styles.description}>{item.details}</Text>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    image: {
        width: screenWidth,
        height: screenHeight * 0.5,
        resizeMode: 'contain',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        paddingTop: 30,
        paddingBottom: 0,
        textAlign: 'center',
    },
    description: {
        fontSize: 16,
        padding: 16,
        textAlign: 'left',
    },
});

