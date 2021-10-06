import firebase from 'firebase'

const firebaseConfig = {
    apiKey: "AIzaSyCHCFy8wjq8pp5_fl376M4jl6b3ginfQCQ",
    authDomain: "homework-app-e90ec.firebaseapp.com",
    projectId: "homework-app-e90ec",
    storageBucket: "homework-app-e90ec.appspot.com",
    messagingSenderId: "372381379253",
    appId: "1:372381379253:web:3c52e462020b52bd1c2cfc"
  };

  if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
 }else {
    firebase.app(); 
 }
 
   export default firebase.firestore();
  