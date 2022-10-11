


import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';
import 'firebase/compat/storage';

const firebaseConfig = {
  apiKey: "AIzaSyBvCtZ33C3555NIMJQ7e4OYePVn6u83PDI",
  authDomain: "instagram-clone-a976a.firebaseapp.com",
  projectId: "instagram-clone-a976a",
  storageBucket: "instagram-clone-a976a.appspot.com",
  messagingSenderId: "142352632938",
  appId: "1:142352632938:web:4e5bf9c84f92b4b34a0e13",
  measurementId: "G-5CH86ZY8XR"
};

// Use this to initialize the firebase App
const firebaseApp = firebase.initializeApp(firebaseConfig);

// Use these for db & auth
const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage();
export { auth, db,storage };