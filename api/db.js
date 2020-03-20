const admin = require("firebase-admin");

let serviceAccount = {}
if(process.env.NODE_ENV === 'production') {
  serviceAccount = JSON.parse(process.env.GOOGLE_SERVICE_KEY)
} else {
  serviceAccount = require("./serviceAccountKey.json");
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://turbodota-1f6de.firebaseio.com"
});

const db = admin.firestore();

const settings = { timestampsInSnapshots: true }

admin.firestore().settings(settings);

module.exports = db