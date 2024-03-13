const admin = require("firebase-admin");

const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://gymapp-955fe-default-rtdb.firebaseio.com",
});

var db = admin.database();



module.exports = admin;
// module.exports = sendAndSaveNotification;
