import firebase from 'firebase';
import 'firebase/firestore/dist/index.cjs';
import 'firebase/auth/dist/index.cjs';
import 'firebase/storage/dist/index.cjs';
import 'firebase/database/dist/index.cjs';

//Use the firebase keys in environment variables.
//crosslight test

let firebaseConfig = {
    apiKey: process.env.REACT_APP_FB_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DB_URL,
    projectId: process.env.REACT_APP_PROJECTID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_SENDER_ID
};

firebase.initializeApp(firebaseConfig);

const store = firebase.firestore();
const settings = { timestampsInSnapshots: true };
store.settings(settings);
const firestore = store;

// Firebase storage for files upload
const storage = firebase.storage();

//Firebase database for real time
const database = firebase.database();

// Firebase Auth for Authentication
const auth = firebase.auth();
auth.useDeviceLanguage();

export {firebase, firestore, database, auth, storage};
