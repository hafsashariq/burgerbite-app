import { doc, getDoc, getDocs, collection } from "firebase/firestore";
import { db } from '../config';
export const getBanners = async () => {
    try {
        const col = collection(db, 'banners');
        const snapshot = await getDocs(col);
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error fetching getBanners', error);
        return null
    }
};

export const getOffers = async () => {
    try {
        const col = collection(db, 'offers');
        const snapshot = await getDocs(col);
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error fetching getOffersl:', error);
        return null
    }
};

export const getLocations = async () => {
    try {
        const col = collection(db, 'locations');
        const snapshot = await getDocs(col);
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error fetching getLocations:', error);
        return null
    }
};

export const getWhatsNew = async () => {
    try {
        const col = collection(db, 'whatsnew');
        const snapshot = await getDocs(col);
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        console.error('Error fetching whatsnew:', error);
        return null
    }
};