const admin = require("firebase-admin");

// Send a message to devices subscribed to the provided usertopic and save it to realtimeDB.
function sendAndSaveNotification(userId, payload) {
  console.log("sendSingleUserNotifications");
  var topic = "UserID" + userId;
  admin
    .messaging()
    .sendToTopic(topic, payload)
    .then((response) => {
      console.log("Sent successfully.\n");
      console.log(response);
      var today = new Date();
      var body = {
        date: today.toISOString(),
        isNew: true,
        isRead: false,
        messageId: response.messageId,
        title: payload.notification.title,
        body: payload.notification.body,
      };
      const database = admin.database();
      const userRef = database.ref(`/users/${userId}/notifications`).push();
      userRef.set(body, (error) => {
        if (error) {
          console.log("Data could not be saved." + error);
          // res.status(400).send({
          //   success: "false",
          //   message: "Error in Saving Notification",
          //   description: error.message,
          // });
        } else {
          console.log("Data saved." + response);

          // res.send({
          //   success: "true",
          //   data: response,
          // });
        }
        return 0;
      });
    })
    .catch((error) => {
      console.log("Sent failed.\n");
      console.log(error);
      // res.status(400).send({
      //   success: "false",
      //   message: "Error in Create Notification",
      //   description: error.message,
      // });
      return 0;
    });
}

module.exports = sendAndSaveNotification;
