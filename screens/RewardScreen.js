import React, { useContext, useEffect, useState } from 'react';
import { View, StyleSheet, ScrollView, Text } from 'react-native';
import QRCode from 'react-native-qrcode-svg';
import { Colors, auth } from '../config';
import { HeaderComponent } from '../components';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthenticatedUserContext } from '../providers';
import { fetchUserDetails } from '../services'
export const RewardScreen = ({ navigation }) => {
    const [userDetail, setUserDetail] = useState({});
    const [loading, setLoading] = useState(true);
    const { user, setUser } = useContext(AuthenticatedUserContext);

    useEffect(() => {
        const unsubscribeAuthStateChanged = onAuthStateChanged(
            auth,
            authenticatedUser => {
                setUser(authenticatedUser);
            }
        );
        return unsubscribeAuthStateChanged;
    }, [setUser]);


    useEffect(() => {
        if (user && user.uid) {
            getData();
        }
    }, [user]);

    const getData = async () => {
        if (user && user.uid) {
            const details = await fetchUserDetails(user.uid);
            if (details) {
                console.log("Document data:", details);
                setUserDetail(details);
                setLoading(false);
            } else {
                console.log("No such document!");
                setLoading(false);
            }
        }
    };

    return (
        <>
            <HeaderComponent navigation={navigation} title="Rewards" />
            {loading && (
                <View style={styles.container}>
                    <Text>Loading...</Text>
                </View>
            )}
            <View isSafe style={styles.container}>
                <ScrollView>
                    {/* Section for QR Code */}
                    <View style={styles.qrSection}>
                        <View style={styles.qrCodeContainer}>
                            <QRCode value={String(userDetail.memberNumber)} size={240} />
                        </View>
                        <View style={styles.pointsBalanceContainer}>
                            <Text style={styles.customerName}>{userDetail.firstName} {userDetail.lastName}</Text>
                            <Text style={styles.titleText}>Member Number</Text>
                            <Text style={styles.pointBalance}>{userDetail.memberNumber}</Text>
                            <Text style={styles.titleText}>Store Points</Text>
                            <Text style={styles.pointBalance}>{userDetail.pointBalance ? userDetail.pointBalance.toLocaleString() : 0}</Text>
                        </View>
                    </View>
                </ScrollView>
            </View>
        </>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16, // Adjust as needed
        backgroundColor: Colors.white,
        zIndex: -1,
    },
    heading: {
        fontSize: 32,
        fontWeight: '600',
        color: Colors.black,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingBottom: 10,
        backgroundColor: Colors.white,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    titleText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: Colors.black,
        paddingTop: 10,
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    qrSection: {
        backgroundColor: Colors.yellow,
        borderRadius: 20,
        padding: 20,
        paddingTop: 26,
        color: Colors.white,
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10, // Adjust margin as needed
        marginTop: 20, // Adjust margin as needed
    },
    section: {
        backgroundColor: Colors.white,
        borderRadius: 20,
        color: Colors.white,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginHorizontal: 10, // Adjust margin as needed
        marginTop: 20, // Adjust margin as needed
    },
    pointsBalanceContainer: {
        flex: 1, // Add flex: 1 to make it take remaining space
        alignItems: 'flex-start', // Align items to the start (left)
        marginLeft: 20, // Add left margin for spacing
        marginTop: 20, // Add left margin for spacing
        color: Colors.white, //
        alignItems: 'center',
    },
    customerName: {
        // Style for customer name
        fontWeight: 'bold',
        marginBottom: 5, // Add margin bottom if needed
        color: Colors.black, //
        fontSize: 22, // Add
        textTransform: 'uppercase',
        textAlign: 'center',
    },
    pointBalance: {
        // Style for customer name
        fontWeight: 'bold',
        marginBottom: 5, // Add margin bottom if needed
        color: Colors.black,
        fontSize: 16,
        marginTop: 5,
        borderRadius: 16,
        backgroundColor: Colors.white, //
        padding: 8, // Add padding
        width: 180, // Add
        textAlign: 'center'
    },
});