import React, { useState, useEffect } from 'react';
import { Colors } from '../config';
import { HeaderComponent } from '../components';
import { Image, Dimensions, FlatList, Modal, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { getOffers } from '../services'
const screenWidth = Dimensions.get('window').width;
const screenHeight = Dimensions.get('window').height;

export const OfferScreen = ({ user, navigation }) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [offers, setOffers] = useState([]);

    useEffect(() => {
        getOffersData();
    }, []);

    const getOffersData = async () => {
        try {
            const data = await getOffers();
            console.log('offers data', data);
            setOffers(data);
        } catch (error) {
            console.error('Error fetching offers:', error);
        }
    };

    const openModal = (item) => {
        setSelectedItem(item);
        setModalVisible(true);
    };

    const closeModal = () => {
        setModalVisible(false);
    };

    const ListItem = ({ item }) => (
        <TouchableOpacity onPress={() => openModal(item)}>
            <View style={styles.posterContainer}>
                <Image source={{ uri: item.imageUrl }} style={styles.posterImage} />
            </View>
        </TouchableOpacity>
    );

    return (
        <>
            <HeaderComponent navigation={navigation} title="Your Offers" />
            {!offers ? (
                <View style={styles.centeredContainer}>
                    <Text style={styles.titleText}>You currently don't have active offers</Text>
                </View>
            ) : (
                <FlatList
                    contentContainerStyle={styles.container}
                        data={[...offers, { uid: 'empty', empty: true }]} // Adding an empty item for the "You currently don't have active offers" message
                    keyExtractor={(item) => item.uid}
                        key={(item) => item.uid}
                    renderItem={({ item }) => (
                        item.empty ? (
                            <></>
                        ) : (
                            <ListItem item={item} />
                        )
                    )}
                />
            )}
            {selectedItem && (
                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={modalVisible}
                    onRequestClose={closeModal}>
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                                <Text style={styles.closeButtonText}>X</Text>
                            </TouchableOpacity>
                            <Image source={{ uri: selectedItem.imageUrl }} style={styles.selectedImage} />
                            <Text style={styles.detailsText}>{selectedItem.details}</Text>
                        </View>
                    </View>
                </Modal>
            )}
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flexGrow: 1,
        padding: 20,
    },
    centeredContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    titleText: {
        fontSize: 16,
        marginTop: 10,
        textAlign: 'center',
    },
    posterContainer: {
        borderRadius: 10,
        overflow: 'hidden',
        marginVertical: 5,
    },
    posterImage: {
        width: screenWidth - 32,
        height: 200,
        borderRadius: 8,
        resizeMode: 'cover'
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContent: {
        backgroundColor: Colors.white,
        padding: 8,
        borderRadius: 10,
        alignItems: 'center',
    },
    closeButton: {
        position: 'absolute',
        top: 10,
        right: 10,
        padding: 10,
        zIndex: 1, // Ensure the button appears above other content
    },
    closeButtonText: {
        color: Colors.darkGrey,
        fontSize: 18,
    },
    selectedImage: {
        width: screenWidth - 64,
        height: screenHeight * 0.5,
        borderRadius: 10,
        resizeMode: 'contain'
    },
    detailsText: {
        fontSize: 16,
        textAlign: 'center',
    },
});

export default OfferScreen;
