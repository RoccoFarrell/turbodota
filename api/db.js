const admin = require("firebase-admin");
const admin_test = require("firebase-admin");

let environment = process.env.NODE_ENV || 'development'

let serviceAccount = {}
if(process.env.NODE_ENV === 'production') {
  serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_KEY)
} else {
  serviceAccount = require("./serviceAccountKey.json");
}

// Initialize Firebase with a default Firebase project
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://turbodota-1f6de.firebaseio.com"
});

// console.log(admin.app().name + ' live connection as db');  // "[DEFAULT]"
let db = admin.firestore();
const settings = { timestampsInSnapshots: true }
admin.firestore().settings(settings);

// to enable debug DB actions on live server, uncomment below
environment = "production"
if(environment === "development"){
  const serviceAccount_test = require("./serviceAccountKey-2.json")
  
  // Initialize Firebase with a second Firebase project
  let db_test = admin.initializeApp({
    credential: admin.credential.cert(serviceAccount_test),
    databaseURL: 'https://turbodota-2.firebaseio.com'
  }, 'db_test')

  const dbTest = db_test.firestore();
  db_test.firestore().settings(settings);

  console.log('connecting to backup DB')
  db = dbTest
} else {
  console.log('********* \nCONNECTED TO PROD DB \n*********')
}

module.exports = db


