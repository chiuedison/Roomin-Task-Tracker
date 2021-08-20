import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyDA7rfHrN2mWP2T3EJaS5ePHxYdKxzMd5Y",
  authDomain: "roomin-task-system.firebaseapp.com",
  projectId: "roomin-task-system",
  storageBucket: "roomin-task-system.appspot.com",
  messagingSenderId: "548433500696",
  appId: "1:548433500696:web:914db93b1430adb740c16d",
  measurementId: "G-MX8GXRF9KW",
};

firebase.initializeApp(firebaseConfig);

// export utils
const db = firebase.firestore();
const auth = firebase.auth();
const storage = firebase.storage();

export { db, auth, storage }