
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/storage';
import 'firebase/compat/firestore';
const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyDs3H1UHW7--sgSIjf71Ylisf6ew2yGDzg",
    authDomain: "instagram-da305.firebaseapp.com",
    projectId: "instagram-da305",
    storageBucket: "instagram-da305.appspot.com",
    messagingSenderId: "709201079751",
    appId: "1:709201079751:web:025ded329823150a557de2",
    measurementId: "G-DNMNL8G7KV"
    
})

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage =firebase.storage();

export {db,auth,storage};