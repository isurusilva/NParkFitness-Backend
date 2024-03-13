const admin = require("../config/firebase-config");

// Send a message to devices subscribed to the provided topic.
exports.sendNotifications = (req, res) => {
  console.log("sendNotifications");
  var payload = {
    notification: {
      title: req.body.title,
      body: req.body.body,
    },
  };
  admin
    .messaging()
    .sendToTopic(req.body.topic, payload)
    .then((response) => {
      console.log("Sent successfully.\n");
      console.log(response);
      res.send({
        success: "true",
        data: response,
      });
    })
    .catch((error) => {
      console.log("Sent failed.\n");
      console.log(error);
      res.status(400).send({
        success: "false",
        message: "Error in Create Notification",
        description: error.message,
      });
    });
};


// Send a message to devices subscribed to the provided usertopic and save it to realtimeDB.
exports.sendSingleUserNotifications = (req, res) => {
  console.log("sendSingleUserNotifications");
  var payload = {
    notification: {
      title: req.body.title,
      body: req.body.body,
    },
  };
  admin
    .messaging()
    .sendToTopic(req.body.topic, payload)
    .then((response) => {
      console.log("Sent successfully.\n");
      console.log(response);
      var today = new Date();
      var body = {
        date: today.toISOString(),
        isNew: true,
        isRead: false,
        messageId: response.messageId,
        title: req.body.title,
        body: req.body.body,
      };
      const database = admin.database();
      const userRef = database.ref(`/users/${req.params.id}/notifications`).push();
      userRef.set(body, (error) => {
        if (error) {
          console.log("Data could not be saved." + error);
          res.status(400).send({
            success: "false",
            message: "Error in Saving Notification",
            description: error.message,
          });
        } else {
          res.send({
            success: "true",
            data: response,
          });
        }
      });
    })
    .catch((error) => {
      console.log("Sent failed.\n");
      console.log(error);
      res.status(400).send({
        success: "false",
        message: "Error in Create Notification",
        description: error.message,
      });
    });
};


// create user with notification in realtimeDB
exports.setNotifications = async (req, res) => {
  console.log("setting notifications");
  const database = admin.database();
  const userRef = database.ref("/users");
  await userRef.child(req.body.id).update(
    {
      fcm: req.body.fcm,
    },
    (error) => {
      if (error) {
        console.log("Data could not be saved." + error);
        res.status(400).send({
          success: "false",
          message: "Error in Setting Notification",
          description: error.message,
        });
      } else {
        res.send({
          success: "true",
        });
      }
    }
  );
};

// save user with notification in realtimeDB
exports.saveNotifications = (req, res) => {
  console.log("saving notifications");
  const database = admin.database();
  var body = {
    date: req.body.date,
    isNew: req.body.isNew,
    isRead: req.body.isRead,
    message: req.body.message,
  };
  const userRef = database.ref(`/users/${req.params.id}/notifications`).push();
  userRef.set(body, (error) => {
    if (error) {
      console.log("Data could not be saved." + error);
      res.status(400).send({
        success: "false",
        message: "Error in Saving Notification",
        description: error.message,
      });
    } else {
      res.send({
        success: "true",
      });
    }
  });
};

// get user with notification in realtimeDB
exports.getNotifications = async (req, res) => {
  console.log("saving notifications");
  const database = admin.database();
  const userRef = database.ref(`/users/${req.params.id}/notifications`);
  userRef.once(
    "value",
    (snapshot) => {
      console.log(snapshot.val());
      res.send({
        success: "true",
        data: snapshot.val(),
      });
    },
    (errorObject) => {
      console.log("The read failed: " + errorObject.name);
      res.status(400).send({
        success: "false",
        message: "Error in Saving Notification",
        description: errorObject.name,
      });
    }
  );
};
