const express = require("express");
const UserController = require("../controller/user.controller");
const SubscriptionTypeController = require("../controller/subscriptionType.controller");
const ReviewController = require("../controller/review.controller");
const AuthRouter = express.Router();

// AuthRouter.get('/', UserController.getAllUser);
// AuthRouter.post('/', UserController.createUser);
// AuthRouter.put('/:id', UserController.updateUser);
AuthRouter.post("/validate", UserController.validateUser);
AuthRouter.post(
  "/validateUserByFireUIDAndEmail",
  UserController.validateUserByFireUIDAndEmail
);
AuthRouter.post("/signUp", UserController.createUser);
AuthRouter.get(
  "/getAllSubscriptionTypes",
  SubscriptionTypeController.getAllSubscriptionType
);
AuthRouter.get("/getPlatformCounts", UserController.getPlatformCounts);
AuthRouter.get("/getAllReview", ReviewController.getAllReview);

module.exports = AuthRouter;
