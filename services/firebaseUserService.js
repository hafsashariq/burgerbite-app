import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from '../config';
export const fetchUserDetails = async (uid) => {
    try {
        console.log('Fetching user details', uid);
        const docRef = doc(db, "users", uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            console.log("Document data:", docSnap.data());
            return docSnap.data();
        } else {
            console.log("No such document!");
            return null;
        }
    } catch (error) {
        console.error('Error fetching user detail:', error);
        return null
    }
};
export const fetchUserOffers = async (uid) => {
    try {
        const col = collection(db, `users/${uid}/offers`);
        const snapshot = await getDocs(col);
        const offersData = snapshot.docs.map(doc => doc.data());
        return offersData;
    } catch (error) {
        console.error('Error fetching user offers:', error);
        throw error; // Re-throw the error to handle it where the function is called
    }
};