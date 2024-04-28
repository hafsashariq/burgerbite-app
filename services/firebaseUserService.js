import { collection, doc, getDoc, getDocs, query, where } from "firebase/firestore"; // Import necessary Firestore functions
import { db } from '../config'; // Import Firestore database instance

// Function to fetch user details by UID
export const fetchUserDetails = async (uid) => {
    try {
        console.log('Fetching user details', uid); // Log message indicating user details are being fetched
        const docRef = doc(db, "users", uid); // Reference to the document with the given UID
        const docSnap = await getDoc(docRef); // Get the document snapshot

        if (docSnap.exists()) { // If document exists
            console.log("Document data:", docSnap.data()); // Log the document data
            return docSnap.data(); // Return the user data
        } else {
            console.log("No such document!"); // Log message indicating document doesn't exist
            return null; // Return null if document doesn't exist
        }
    } catch (error) {
        console.error('Error fetching user detail:', error); // Log error if fetching user details fails
        return null; // Return null in case of error
    }
};

// Function to fetch user details by phone number
export const fetchUserByPhoneNumber = async (phoneNumber) => {
    try {
        const usersCollectionRef = collection(db, 'users'); // Reference to the 'users' collection
        const phoneNumberQuery = query(usersCollectionRef, where('phoneNumber', '==', phoneNumber)); // Query to get documents where phoneNumber equals the provided phoneNumber
        const querySnapshot = await getDocs(phoneNumberQuery); // Get the query snapshot

        if (!querySnapshot.empty) { // If query snapshot is not empty
            // Assuming there's only one document with a given phone number
            const userData = querySnapshot.docs[0].data(); // Get the data of the first document in the snapshot
            console.log("Document data:", userData); // Log the document data
            return userData; // Return the user data
        } else {
            console.log("No such document!"); // Log message indicating document doesn't exist
            return null; // Return null if document doesn't exist
        }
    } catch (error) {
        console.error('Error fetching user detail by phonenumber:', error); // Log error if fetching user details by phone number fails
        return null; // Return null in case of error
    }
};

// Function to fetch user offers by UID
export const fetchUserOffers = async (uid) => {
    try {
        const col = collection(db, `users/${uid}/offers`); // Reference to the subcollection 'offers' under the user with the given UID
        const snapshot = await getDocs(col); // Get the documents in the subcollection
        const offersData = snapshot.docs.map(doc => doc.data()); // Map through the documents and extract their data
        return offersData; // Return the array of offer data
    } catch (error) {
        console.error('Error fetching user offers:', error); // Log error if fetching user offers fails
        throw error; // Re-throw the error to handle it where the function is called
    }
};
