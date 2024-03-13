const Branch = require("../model/branch.model");
const Gym = require("../model/gym.model");
const Membership = require("../model/membership.model");
const MembershipType = require("../model/membershipType.model");
const User = require("../model/user.model");
const { Sequelize, Op } = require("sequelize");
const sendAndSaveNotification = require("../config/firebaseNotification");

function getFreeTrainerFromBranch(branch, callback) {
  var trainerIdArr = [];
  var traineeCountArr = [];

  User.findAll({
    where: { type: "Trainer", branchId: branch },
  })
    .then(async (user) => {
      await user.map((element) => {
        trainerIdArr.push({ trainerId: element.id });
      });
      console.log(trainerIdArr);
      Membership.count({
        where: {
          [Op.or]: trainerIdArr,
        },
        group: ["trainerId"],
      })
        .then(async (membership) => {
          console.log(membership);
          if (trainerIdArr.length < 1) {
            callback(Error("Trainers Not Found In This Branch"));
          } else {
            await trainerIdArr.map((element, i) => {
              if (
                membership[i] != null &&
                element.trainerId == membership[i].trainerId
              ) {
                traineeCountArr.push({
                  trainerId: element.trainerId,
                  count: membership[i].count,
                });
              } else {
                traineeCountArr.push({
                  trainerId: trainerIdArr[i].trainerId,
                  count: 0,
                });
              }
            });
            console.log(traineeCountArr);
            console.log(traineeCountArr);
            var min = Math.min.apply(
              null,
              traineeCountArr.map(function (o) {
                return o.count;
              })
            );
            var obj = traineeCountArr.find(function (o) {
              return o.count == min;
            });
            console.log(obj.trainerId);
            callback(null, obj.trainerId);
          }
        })
        .catch((err) => {
          console.log(err);
          callback(err);
        });
    })
    .catch((err) => {
      callback(err);
    });
}

exports.getFreeTrainerFromBranch = (req, res) => {
  var trainerIdArr = [];
  var traineeCountArr = [];

  User.findAll({
    where: { type: "Trainer", branchId: req.body.branch },
  })
    .then(async (user) => {
      await user.map((element) => {
        trainerIdArr.push({ trainerId: element.id });
      });
      console.log(trainerIdArr);
      Membership.count({
        where: {
          [Op.or]: trainerIdArr,
        },
        group: ["trainerId"],
      })
        .then(async (membership) => {
          console.log(membership);
          await trainerIdArr.map((element, i) => {
            if (
              membership[i] != null &&
              element.trainerId == membership[i].trainerId
            ) {
              traineeCountArr.push({
                trainerId: element.trainerId,
                count: membership[i].count,
              });
            } else {
              traineeCountArr.push({
                trainerId: trainerIdArr[i].trainerId,
                count: 0,
              });
            }
          });
          console.log(traineeCountArr);
          var min = Math.min.apply(
            null,
            traineeCountArr.map(function (o) {
              return o.count;
            })
          );
          var obj = traineeCountArr.find(function (o) {
            return o.count == min;
          });
          console.log(obj);

          res.send({
            success: "true",
            data: obj ?? "Notfound",
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({
            success: "false",
            message: "Error in Getting All Membership",
            description: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting User By ID",
        description: err.message,
      });
    });
};

//Register a Membership | guest
exports.createMembership = async (req, res) => {
  if (req.body) {
    console.log("Create membership");
    Branch.findOne({
      where: {
        id: req.body.branchId,
      },
    })
      .then((branch) => {
        console.log(branch);
        if (!branch)
          return res.status(400).send({
            success: "false",
            message: "Error in Getting Membership By ID",
            description: "Scanned branch is not found",
          });

        if (branch.isActive) {
          Membership.findOne({
            where: {
              branchId: req.body.branchId,
              userId: req.body.userId,
            },
          })
            .then((temp_membership) => {
              console.log(temp_membership);
              if (temp_membership == null) {
                var trainerId;
                console.log("req.body.trainerNeeded");
                console.log(req.body.trainerNeeded);
                console.log(req.body.trainerNeeded == "true");

                if (
                  req.body.trainerNeeded == "true" ||
                  req.body.trainerNeeded
                ) {
                  getFreeTrainerFromBranch(req.body.branchId, (err, user) => {
                    if (err)
                      return res.status(400).send({
                        success: "false",
                        message: "Error in Create Membership",
                        description: err.message,
                      });
                    console.log("user");
                    console.log(user);
                    trainerId = user;
                    var body = {
                      expireDate: req.body.expireDate,
                      membershipTypeId: req.body.membershipTypeId,
                      trainerNeeded: req.body.trainerNeeded,
                      isActive: true,
                      userId: req.body.userId,
                      branchId: req.body.branchId,
                      trainerId: trainerId,
                    };
                    Membership.create(body)
                      .then((membership) => {
                        sendAndSaveNotification(body.trainerId, {
                          notification: {
                            title: "New member Assign to you.",
                            body: "Checkout your newly assigned member details.",
                          },
                        });
                        res.send({
                          success: "true",
                          data: membership,
                        });
                      })
                      .catch((err) => {
                        console.log(err);
                        res.status(400).send({
                          success: "false",
                          message: "Error in Create Membership",
                          description: err.message,
                        });
                      });
                  });
                } else {
                  Membership.create(req.body)
                    .then((membership) => {
                      res.send({
                        success: "true",
                        data: membership,
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      res.status(400).send({
                        success: "false",
                        message: "Error in Create Membership",
                        description: err.message,
                      });
                    });
                }
              } else {
                res.status(400).send({
                  success: "false",
                  message: "Error in Getting Membership By ID",
                  description: "This Member Already Exist",
                });
              }
            })
            .catch((err) => {
              res.status(400).send({
                success: "false",
                message: "Error in Getting Membership By ID",
                description: err.message,
              });
            });
        } else {
          res.status(400).send({
            success: "false",
            message: "Error Creating Membership",
            description:
              "This branch is currently inactive. You cannot register to this branch",
          });
        }
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Getting Branch By ID",
          description: err.message,
        });
      });
  }
};

//update Membership Details
exports.updateMembership = async (req, res) => {
  if (req.body) {
    if (!req.params.id) return res.status(500).send("Id is missing");
    let id = req.params.id;
    Membership.update(req.body, {
      where: {
        id: id,
      },
    })
      .then((membership) => {
        res.status(200).send({
          success: membership[0] == 1 ? "true" : "false",
          data:
            membership[0] == 1
              ? "Updated Successfully"
              : "Update Not Successful",
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Update Membership",
          description: err.message,
        });
      });
  }
};

//get All Membership
exports.getAllMembership = (req, res) => {
  console.log("get All");
  Membership.findAll()
    .then((membership) => {
      res.send({
        success: "true",
        data: membership,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting All Membership",
        description: err.message,
      });
    });
};

//get All Membership By UserId
exports.getAllMembershipByUserId = (req, res) => {
  console.log("get All By UserId");
  Membership.findAll({
    where: {
      userId: req.params.id,
    },
    include: [
      {
        model: User,
      },
      {
        model: User,
        as: "trainId",
      },
      {
        model: MembershipType,
      },
      {
        model: Branch,
        include: {
          model: Gym,
        },
      },
    ],
  })
    .then((membership) => {
      res.send({
        success: "true",
        data: { memberData: membership },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        success: "false",
        message: "Error in Getting All Membership",
        description: err.message,
      });
    });
};

//check membership validity
exports.checkMembershipValidity = (req, res) => {
  console.log("get All By UserId");
  Branch.findOne({
    where: {
      id: req.body.branchId,
    },
  })
    .then((branch) => {
      Membership.findAll({
        where: {
          userId: req.body.userId,
        },
        include: [
          {
            model: Branch,
            include: {
              model: Gym,
            },
          },
        ],
      })
        .then(async (member) => {
          if (!member || member.length < 1)
            return res.send({
              success: "true",
              data: { isValid: true },
            });

          let valid = true;
          const promises = member.map((element) => {
            if (element.branch.gymId === branch.gymId) {
              valid = false;
            }
          });

          await Promise.all(promises);

          res.send({
            success: "true",
            data: { isValid: valid },
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({
            success: "false",
            message: "Error in Getting All Branch",
            description: err.message,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        success: "false",
        message: "Error in Getting All Branch",
        description: err.message,
      });
    });
};

//get All Membership By BranchId
exports.getAllMembershipByBranchId = (req, res) => {
  console.log("get All By BranchId");
  Membership.findAll({
    where: {
      branchId: req.params.id,
    },
    include: [
      {
        model: User,
      },
      {
        model: User,
        as: "trainId",
      },
      {
        model: MembershipType,
      },
      {
        model: Branch,
        include: {
          model: Gym,
        },
      },
    ],
  })
    .then((membership) => {
      res.send({
        success: "true",
        data: { memberData: membership },
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        success: "false",
        message: "Error in Getting All Membership",
        description: err.message,
      });
    });
};

//get Membership By Id
exports.getMembershipById = (req, res) => {
  console.log("get All");
  Membership.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: User,
      },
      {
        model: MembershipType,
      },
    ],
  })
    .then((membership) => {
      res.send({
        success: "true",
        data: membership,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting Membership By ID",
        description: err.message,
      });
    });
};

//getAll Membership By neededTrainer false
exports.getMembershipByNeededTrainer = (req, res) => {
  console.log("get All");
  Membership.findAll({
    where: {
      neededTrainer: req.params.neededTrainer,
    },
    include: [
      {
        model: User,
      },
      {
        model: MembershipType,
      },
    ],
  })
    .then((membership) => {
      res.send({
        success: "true",
        data: membership,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting Membership By NeededTrainer",
        description: err.message,
      });
    });
};

//getAll Membership with Details
exports.getMembershipWithDetails = (req, res) => {
  console.log("get All");
  Membership.findAll({
    include: [
      {
        model: User,
      },
      {
        model: MembershipType,
      },
      {
        model: Branch,
        include: {
          model: Gym,
        },
      },
    ],
  })
    .then((membership) => {
      res.send({
        success: "true",
        data: membership,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting Membership With Details",
        description: err.message,
      });
    });
};

//delete Membership
exports.deleteMembership = async (req, res) => {
  console.log("Delete membership");
  Membership.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((membership) => {
      console.log(membership);
      res.status(200).send({
        success: membership == 1 ? "true" : "false",
        data:
          membership == 1 ? "Deleted Successfully" : "Delete Not Successful",
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Delete Membership",
        description: err.message,
      });
    });
};
