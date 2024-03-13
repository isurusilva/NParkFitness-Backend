const express = require("express");
const NotificationRouter = express.Router();
const NotificationController = require("../controller/notification.controller");

NotificationRouter.post("/", NotificationController.sendNotifications);
NotificationRouter.post(
  "/setNotifications",
  NotificationController.setNotifications
);
NotificationRouter.post(
  "/saveNotifications/:id",
  NotificationController.saveNotifications
);
NotificationRouter.get(
  "/getNotifications/:id",
  NotificationController.getNotifications
);
NotificationRouter.post(
  "/sendSingleUserNotifications/:id",
  NotificationController.sendSingleUserNotifications
);
// NotificationRouter.post('/', NotificationController.createNotification);
// NotificationRouter.get('/:id', NotificationController.getNotificationById);
// NotificationRouter.put('/:id', NotificationController.updateNotification);
// NotificationRouter.delete('/:id', NotificationController.deleteNotification);
module.exports = NotificationRouter;
