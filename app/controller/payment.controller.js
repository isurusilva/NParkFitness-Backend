const Payment = require("../model/payment.model");
const Membership = require("../model/membership.model");
const Branch = require("../model/branch.model");
const Gym = require("../model/gym.model");
const User = require("../model/user.model");
const MembershipType = require("../model/membershipType.model");
const sendAndSaveNotification = require("../config/firebaseNotification");
const { Sequelize, Op } = require("sequelize");

//Register a Payment | guest
exports.createPayment = async (req, res) => {
  if (req.body) {
    console.log("Create payment");
    Payment.create(req.body)
      .then((payment) => {
        Membership.findOne({
          where: {
            id: req.body.membershipId,
          },
          include: {
            model: User,
          },
        })
          .then((membership) => {
            var dt = new Date(membership.expireDate);
            dt.setMonth(dt.getMonth() + 1);
            var updateBody = {
              expireDate: dt.toISOString().slice(0, 10) + " 00:00:00",
            };
            Membership.update(updateBody, {
              where: {
                id: req.body.membershipId,
              },
            })
              .then((membership2) => {
                console.log(membership);
                sendAndSaveNotification(membership.userId, {
                  notification: {
                    title: "Payment completed successfully.",
                    body: "Checkout your account for payment details.",
                  },
                });
                res.send({
                  success: "true",
                  data: payment,
                });
              })
              .catch((err) => {
                res.status(400).send({
                  success: "false",
                  message: "Error in Update Membership",
                  description: err.message,
                });
              });
          })
          .catch((err) => {
            res.status(400).send({
              success: "false",
              message: "Error in Getting Membership By ID",
              description: err.message,
            });
          });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Create Payment",
          description: err.message.name,
        });
      });
  }
};

//update Payment Details
exports.updatePayment = async (req, res) => {
  if (req.body) {
    if (!req.params.id) return res.status(500).send("Id is missing");
    let id = req.params.id;
    Payment.update(req.body, {
      where: {
        id: id,
      },
    })
      .then((payment) => {
        res.status(200).send({
          success: payment[0] == 1 ? "true" : "false",
          data:
            payment[0] == 1 ? "Updated Successfully" : "Update Not Successful",
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Update Payment",
          description: err.message,
        });
      });
  }
};

//get All Payment
exports.getAllPayment = (req, res) => {
  console.log("get All");
  Payment.findAll()
    .then((payment) => {
      res.send({
        success: "true",
        data: payment,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting All Payment",
        description: err.message,
      });
    });
};

//get All Payment By userId
exports.getAllPaymentByUserId = (req, res) => {
  console.log("get All Payment By userId");
  var memberId = [];

  Membership.findAll({
    where: {
      userId: req.params.id,
    },
  })
    .then(async (membership) => {
      await membership.map((element) => {
        memberId.push({ membershipId: element.id });
      });
      console.log(memberId);

      Payment.findAll({
        where: {
          [Op.or]: memberId,
        },
        include: {
          model: Membership,
          include: {
            model: Branch,
            include: {
              model: Gym,
            },
          },
        },
        order: [["date", "DESC"]],
      })
        .then((payment) => {
          res.send({
            success: "true",
            data: { payment: payment },
          });
        })
        .catch((err) => {
          res.status(400).send({
            success: "false",
            message: "Error in Getting All Payment",
            description: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting Membership By userId",
        description: err.message,
      });
    });
};

//get All Payment By memberId
exports.getAllPaymentByMemberId = (req, res) => {
  console.log("get All Payment By MemberId");
  console.log(req.user);
  var memberId = [];

  Branch.findOne({
    where: {
      id: req.user.branchId,
    },
  })
    .then((branch) => {
      Membership.findOne({
        where: {
          id: req.params.id,
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
        .then(async (membership) => {
          console.log(membership);
          if (branch !== null && branch.gymId !== membership.branch.gymId) {
            res.status(400).send({
              success: "false",
              message: "This membership is not registered to your gym.",
            });
          } else {
            Payment.findAll({
              where: {
                membershipId: req.params.id,
              },
              order: [["date", "DESC"]],
            })
              .then((payment) => {
                res.send({
                  success: "true",
                  data: { member: membership, payment: payment },
                });
              })
              .catch((err) => {
                res.status(400).send({
                  success: "false",
                  message: "Error in Getting All Payment",
                  description: err.message,
                });
              });
          }
        })
        .catch((err) => {
          res.status(400).send({
            success: "false",
            message: "Error in Getting Membership By userId",
            description: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting Staff Branch Details",
        description: err.message,
      });
    });
};

//get All Payment By membershipId
exports.getAllPaymentByMembershipId = (req, res) => {
  console.log("get All Payment By membershipId");
  Payment.findAll({
    where: {
      membershipId: req.params.id,
    },
    include: {
      model: Membership,
      include: {
        model: Branch,
        include: {
          model: Gym,
        },
      },
    },
  })
    .then((payment) => {
      res.send({
        success: "true",
        data: { payment: payment },
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting All Payment",
        description: err.message,
      });
    });
};

//get Payment By Id
exports.getPaymentById = (req, res) => {
  console.log("get All");
  Payment.findOne({
    where: {
      id: req.params.id,
    },
    include: {
      model: Membership,
    },
  })
    .then((payment) => {
      res.send({
        success: "true",
        data: payment,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting Payment By ID",
        description: err.message,
      });
    });
};

//get All Payment Group By Owner
exports.getAllPaymentGroupByOwner = (req, res) => {
  console.log("get All");
  var today = new Date();
  var lastDayOfMonth = new Date(today.getFullYear(), today.getMonth(), 0);
  console.log(lastDayOfMonth);

  Payment.findAll({
    where: {
      method: "card",
      date: {
        [Op.between]: [
          `${lastDayOfMonth.toISOString().slice(0, 7)}-01`,
          `${lastDayOfMonth.toISOString().slice(0, 10)}`,
        ],
      },
    },
    include: {
      model: Membership,
      include: {
        model: Branch,
        include: {
          model: Gym,
          include: {
            model: User,
          },
        },
      },
    },
    // group: [["date"]],
    // attributes: [
    //   [Sequelize.fn("sum", Sequelize.col("amount")), "totalAmount"],
    // ],
  })
    .then(async (payment) => {
      console.log("sdfsdfdsf======================");
      console.log(payment.find((e) => e.membership.branch.gym.userId === 2));
      const paymentArr = [];

      const promises = payment.map((element) => {
        const temp = paymentArr.findIndex(
          (e) => e.userId === element.membership.branch.gym.userId
        );
        console.log(temp);

        if (temp !== null && temp !== -1 && paymentArr[temp].totAmount >= 0) {
          const value = element.amount
          console.log(parseFloat(value));
          paymentArr[temp].totAmount += parseFloat(value);
        } else if (temp !== null && temp !== -1) {
          paymentArr[temp].totAmount = parseFloat(element.amount);
        } else if (temp == null || temp === -1) {
          paymentArr.push({
            userId: element.membership.branch.gym.userId,
            firstName: element.membership.branch.gym.user.firstName,
            lastName: element.membership.branch.gym.user.lastName,
            totAmount: parseFloat(element.amount),
          });
        }
        console.log(paymentArr);
      });
      await Promise.all(promises);
      console.log(paymentArr);

      res.send({
        success: "true",
        data: paymentArr,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting Payment By ID",
        description: err.message,
      });
    });
};

//delete Payment
exports.deletePayment = async (req, res) => {
  console.log("Delete payment");
  Payment.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((payment) => {
      console.log(payment);
      res.status(200).send({
        success: payment == 1 ? "true" : "false",
        data: payment == 1 ? "Deleted Successfully" : "Delete Not Successful",
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Delete Payment",
        description: err.message,
      });
    });
};
