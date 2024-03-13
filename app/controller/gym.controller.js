const Gym = require("../model/gym.model");
const User = require("../model/user.model");
const sendAndSaveNotification = require("../config/firebaseNotification");

//Register a Gym | guest
exports.createGym = async (req, res) => {
  if (req.body) {
    console.log("Create gym");
    Gym.create(req.body)
      .then(async (gym) => {
        sendAndSaveNotification(req.body.userId, {
          notification: {
            title: "New gym created in your account.",
            body: "Checkout your gym and add some branches to it.",
          },
        });
        res.send({
          success: "true",
          data: gym,
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Create Gym",
          description: err.message,
        });
      });
  }
};

//update Gym Details
exports.updateGym = async (req, res) => {
  if (req.body) {
    if (!req.params.id) return res.status(500).send("Id is missing");
    let id = req.params.id;
    Gym.update(req.body, {
      where: {
        id: id,
      },
    })
      .then((gym) => {
        res.status(200).send({
          success: gym[0] == 1 ? "true" : "false",
          data: gym[0] == 1 ? "Updated Successfully" : "Update Not Successful",
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Update Gym",
          description: err.message,
        });
      });
  }
};

//get All Gym
exports.getAllGym = (req, res) => {
  console.log("get All");
  Gym.findAll()
    .then((gym) => {
      res.send({
        success: "true",
        data: gym,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting All Gym",
        description: err.message,
      });
    });
};

//get Gym By Id
exports.getGymById = (req, res) => {
  console.log("get All");
  Gym.findOne({
    where: {
      id: req.params.id,
    },
    include: {
      model: User,
    },
  })
    .then((gym) => {
      res.send({
        success: "true",
        data: gym,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting Gym By ID",
        description: err.message,
      });
    });
};

//get GymAll By UserId
exports.getAllGymByUserId = (req, res) => {
  console.log("get All Gym By User Id");
  Gym.findAll({
    where: {
      userId: req.params.id,
    },
    include: {
      model: User,
    },
  })
    .then((gym) => {
      res.send({
        success: "true",
        data: gym,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting Gym By ID",
        description: err.message,
      });
    });
};

//get gym count from userId
exports.getGymCountByUserId = (req, res) => {
  Gym.count({
    where: {
      userId: req.params.id,
    },
  })
    .then((gym) => {
      res.send({
        success: "true",
        data: gym,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting gym By ID",
        description: err.message,
      });
    });
};

//delete Gym
exports.deleteGym = async (req, res) => {
  console.log("Delete gym");
  Gym.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((gym) => {
      console.log(gym);
      res.status(200).send({
        success: gym == 1 ? "true" : "false",
        data: gym == 1 ? "Deleted Successfully" : "Delete Not Successful",
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Delete Gym",
        description: err.message,
      });
    });
};
