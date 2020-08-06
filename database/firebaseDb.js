import * as firebase from 'firebase';
import firestore from 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyBG-bJ_ZFw7VBsuCjjpCIYrQDugoc9ZeWI",
    authDomain: "ample-e8ef4.firebaseapp.com",
    databaseURL: "https://ample-e8ef4.firebaseio.com",
    projectId: "ample-e8ef4",
    storageBucket: "ample-e8ef4.appspot.com",
    messagingSenderId: "783209149490",
    appId: "1:783209149490:web:1083ca172880d2958a782b"
};

firebase.initializeApp(firebaseConfig);
firebase.firestore();

export default firebase;
