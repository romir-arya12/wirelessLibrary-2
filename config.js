import * as firebase from 'firebase'
require('@firebase/firestore')
var firebaseConfig ={
    apiKey: "AIzaSyDcpIu8T4f9J50y8vNZPJFNN6Lhi6BubXE",
    authDomain: "wireleibrary-300bf.firebaseapp.com",
    databaseURL: "https://wireleibrary-300bf.firebaseio.com",
    projectId: "wireleibrary-300bf",
    storageBucket: "wireleibrary-300bf.appspot.com",
    messagingSenderId: "257927650010",
    appId: "1:257927650010:web:f50fa8fbfb8a78f004e3e3"
  };
firebase.initializeApp(firebaseConfig);
export default firebase.firestore