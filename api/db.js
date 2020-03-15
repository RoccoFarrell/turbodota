var admin = require("firebase-admin");

var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://turbodoto.firebaseio.com"
});

var db = admin.firestore();

const settings = { timestampsInSnapshots: true }

admin.firestore().settings(settings);

module.exports = db