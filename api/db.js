const admin = require("firebase-admin");

let serviceAccount = {}
if(process.env.NODE_ENV === 'production') {
  serviceAccount = process.env.GOOGLE_SERVICE_KEY
} else {
  serviceAccount = require("./serviceAccountKey.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://turbodoto.firebaseio.com"
});

const db = admin.firestore();

const settings = { timestampsInSnapshots: true }

admin.firestore().settings(settings);

module.exports = db