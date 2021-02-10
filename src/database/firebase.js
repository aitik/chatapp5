import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";

var firebaseConfig = {
    apiKey: "AIzaSyB4dgsFJJCj6qTqWVAJMh3L2r54lTq5q64",
    authDomain: "chatapp-4babe.firebaseapp.com",
    projectId: "chatapp-4babe",
    storageBucket: "chatapp-4babe.appspot.com",
    messagingSenderId: "784238943887",
    appId: "1:784238943887:web:56c9ecf41406c4971f5afa",
    measurementId: "G-0CKZRMY570"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();


export const auth = firebase.auth;
export const db = firebase.firestore();
