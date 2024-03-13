const express = require("express");
const GymRouter = express.Router();
const GymController = require("../controller/gym.controller");

GymRouter.get("/", GymController.getAllGym);
GymRouter.post("/", GymController.createGym);
GymRouter.get("/:id", GymController.getGymById);
GymRouter.get("/getAllGymByUserId/:id", GymController.getAllGymByUserId);
GymRouter.put("/:id", GymController.updateGym);
GymRouter.get("/getGymCountByUserId/:id", GymController.getGymCountByUserId);
GymRouter.delete("/:id", GymController.deleteGym);
module.exports = GymRouter;
