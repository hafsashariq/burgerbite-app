import { doc, getDoc, getDocs, collection } from "firebase/firestore";
// Import database instance from config file
import { db } from '../config';

// Function to get banners from the database
export const getBanners = async () => {
    try {
        // Get the 'banners' collection reference
        const col = collection(db, 'banners');
        // Get all documents from the 'banners' collection
        const snapshot = await getDocs(col);
        // Map through each document and return its data
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        // Handle errors and log them
        console.error('Error fetching getBanners', error);
        return null;
    }
};

// Function to get offers from the database
export const getOffers = async () => {
    try {
        // Get the 'offers' collection reference
        const col = collection(db, 'offers');
        // Get all documents from the 'offers' collection
        const snapshot = await getDocs(col);
        // Map through each document and return its data
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        // Handle errors and log them
        console.error('Error fetching getOffers:', error);
        return null;
    }
};

// Function to get locations from the database
export const getLocations = async () => {
    try {
        // Get the 'locations' collection reference
        const col = collection(db, 'locations');
        // Get all documents from the 'locations' collection
        const snapshot = await getDocs(col);
        // Map through each document and return its data
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        // Handle errors and log them
        console.error('Error fetching getLocations:', error);
        return null;
    }
};

// Function to get what's new from the database
export const getWhatsNew = async () => {
    try {
        // Get the 'whatsnew' collection reference
        const col = collection(db, 'whatsnew');
        // Get all documents from the 'whatsnew' collection
        const snapshot = await getDocs(col);
        // Map through each document and return its data
        return snapshot.docs.map(doc => doc.data());
    } catch (error) {
        // Handle errors and log them
        console.error('Error fetching whatsnew:', error);
        return null;
    }
};
