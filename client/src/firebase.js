import firebase from 'firebase'
const config = {
  apiKey: "AIzaSyD0STlguSSo0g3EaCPHAqwLjk2z9iAGdNc",
  authDomain: "turbodota-1f6de.firebaseapp.com",
  databaseURL: "https://turbodota-1f6de.firebaseio.com",
  projectId: "turbodota-1f6de",
  storageBucket: "turbodota-1f6de.appspot.com",
  messagingSenderId: "339345489728",
  appId: "1:339345489728:web:e577868f6b8a4374b7c4a5",
  measurementId: "G-GZ4P8LCEYS"
};
firebase.initializeApp(config);
firebase.analytics();
export default firebase;