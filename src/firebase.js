const firebase = require('firebase/app')
const firestore = require('firebase/firestore')

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyDdA5wr4H1AB0V9040aDpBpNdIODQ8VTE4",
  authDomain: "sales-system-525cf.firebaseapp.com",
  databaseURL: "https://sales-system-525cf.firebaseio.com",
  projectId: "sales-system-525cf",
  storageBucket: "sales-system-525cf.appspot.com",
  messagingSenderId: "83695402687",
  appId: "1:83695402687:web:0cd559d5a4fd409099500a"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

let db = firebase.firestore()

export default db
