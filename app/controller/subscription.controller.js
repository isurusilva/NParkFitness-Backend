const Gym = require("../model/gym.model");
const Subscription = require("../model/subscription.model");
const SubscriptionType = require("../model/subscriptionType.model");
const User = require("../model/user.model");

//Register a Subscription | guest
exports.createSubscription = async (req, res) => {
  if (req.body) {
    console.log("Create subscription");
    Subscription.create(req.body)
      .then((subscription) => {
        res.send({
          success: "true",
          data: subscription,
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Create Subscription",
          description: err.message,
        });
      });
  }
};

//update Subscription Details
exports.updateSubscription = async (req, res) => {
  if (req.body) {
    if (!req.params.id) return res.status(500).send("Id is missing");
    let id = req.params.id;
    Subscription.update(req.body, {
      where: {
        id: id,
      },
    })
      .then((subscription) => {
        res.status(200).send({
          success: subscription[0] == 1 ? "true" : "false",
          data:
            subscription[0] == 1
              ? "Updated Successfully"
              : "Update Not Successful",
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Update Subscription",
          description: err.message,
        });
      });
  }
};

//Renew Subscription Details
exports.RenewSubscription = async (req, res) => {
  if (req.body) {
    if (!req.params.id) return res.status(500).send("Id is missing");
    let id = req.params.id;
    let body = {
      expireDate: new Date().toISOString().slice(0, 10),
      subscriptionTypeId: req.body.subscriptionTypeId,
    };
    Subscription.update(body, {
      where: {
        id: id,
      },
    })
      .then((subscription) => {
        res.status(200).send({
          success: subscription[0] == 1 ? "true" : "false",
          data:
            subscription[0] == 1
              ? "Updated Successfully"
              : "Update Not Successful",
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Update Subscription",
          description: err.message,
        });
      });
  }
};

//get All Subscription
exports.getAllSubscription = (req, res) => {
  console.log("get All");
  Subscription.findAll()
    .then((subscription) => {
      res.send({
        success: "true",
        data: subscription,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting All Subscription",
        description: err.message,
      });
    });
};

//get Subscription By Id
exports.getSubscriptionById = (req, res) => {
  console.log("get All");
  Subscription.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: User,
      },
      {
        model: SubscriptionType,
      },
    ],
  })
    .then((subscription) => {
      res.send({
        success: "true",
        data: subscription,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting Subscription By ID",
        description: err.message,
      });
    });
};

//get Subscription By UserId
exports.getSubscriptionByUserId = (req, res) => {
  console.log("get One");
  Subscription.findOne({
    where: {
      userId: req.params.id,
    },
    order: [["createdAt", "DESC"]],
    include: [
      {
        model: User,
      },
      {
        model: SubscriptionType,
      },
    ],
  })
    .then((subscription) => {
      console.log(subscription);
      res.send({
        success: "true",
        data: subscription,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting Subscription By UserID",
        description: err.message,
      });
    });
};

//get All Gym Owners with Subscription
exports.getAllGymOwnersWithSubscription = (req, res) => {
  console.log("get All 2354");
  User.findAll({
    where: {
      type: "Owner",
    },
    include: [
      {
        model: Gym,
      },
      {
        model: Subscription,
        include: {
          model: SubscriptionType,
        },
      },
    ],
  })
    .then((user) => {
      res.send({
        success: "true",
        data: user,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting All User",
        description: err.message,
      });
    });
};

//delete Subscription
exports.deleteSubscription = async (req, res) => {
  console.log("Delete subscription");
  Subscription.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((subscription) => {
      console.log(subscription);
      res.status(200).send({
        success: subscription == 1 ? "true" : "false",
        data:
          subscription == 1 ? "Deleted Successfully" : "Delete Not Successful",
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Delete Subscription",
        description: err.message,
      });
    });
};
