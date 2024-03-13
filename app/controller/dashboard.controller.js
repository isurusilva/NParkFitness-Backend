const Attendance = require("../model/attendance.model");
const BodyDetails = require("../model/bodyDetails.model");
const Branch = require("../model/branch.model");
const Gym = require("../model/gym.model");
const Membership = require("../model/membership.model");
const Payment = require("../model/payment.model");
const Goal = require("../model/goal.model");
const Schedule = require("../model/schedule.model");
const ScheduleItem = require("../model/scheduleItem.model");
const ServiceType = require("../model/serviceType.model");
const Subscription = require("../model/subscription.model");
const SubscriptionType = require("../model/subscriptionType.model");
const AttendItem = require("../model/attendItem.model");
const MembershipType = require("../model/membershipType.model");
const DietPlan = require("../model/dietPlan.model");
const MealItem = require("../model/mealItem.model");
const SubPayment = require("../model/subscriptionPayment.model");
const User = require("../model/user.model");
const { Sequelize, Op } = require("sequelize");

// =========================== Manager Dashboard Data ==================================

//get Membership Count in Branch
function getBranchMemberCount(branchIdArr, callback) {
  Membership.count({
    where: {
      [Op.or]: branchIdArr,
    },
  })
    .then((data) => {
      console.log(data);
      callback(null, data);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
}

exports.getBranchMemberCount = async (req, res) => {
  if (!req.params.id) return res.status(500).send("Id is missing");
  let id = req.params.id;
  var branchIdArr = [{ branchId: id }];
  getBranchMemberCount(branchIdArr, (err, data) => {
    if (err)
      return res.status(400).send({
        success: "false",
        message: "Error in getting membership count",
        description: err.message,
      });

    res.send({
      success: "true",
      data: data,
    });
  });
};

//get Expired Membership Count in Branch
function getBranchExpiredMemberCount(branchIdArr, callback) {
  Membership.count({
    where: {
      [Op.or]: branchIdArr,
      expireDate: {
        [Op.lt]: new Date().toISOString().slice(0, 10),
      },
    },
  })
    .then((data) => {
      console.log(data);
      callback(null, data);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
}

exports.getBranchExpiredMemberCount = async (req, res) => {
  if (!req.params.id) return res.status(500).send("Id is missing");
  let id = req.params.id;
  var branchIdArr = [{ branchId: id }];
  getBranchExpiredMemberCount(branchIdArr, (err, data) => {
    if (err)
      return res.status(400).send({
        success: "false",
        message: "Error in getting expired membership count",
        description: err.message,
      });

    res.send({
      success: "true",
      data: data,
    });
  });
};

//get Service Count in Branch
function getBranchServiceCount(branchIdArr, callback) {
  ServiceType.count({
    where: {
      [Op.or]: branchIdArr,
    },
  })
    .then((data) => {
      console.log(data);
      callback(null, data);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
}

exports.getBranchServiceCount = async (req, res) => {
  if (!req.params.id) return res.status(500).send("Id is missing");
  let id = req.params.id;
  var branchIdArr = [{ branchId: id }];
  getBranchServiceCount(branchIdArr, (err, data) => {
    if (err)
      return res.status(400).send({
        success: "false",
        message: "Error in getting service count",
        description: err.message,
      });

    res.send({
      success: "true",
      data: data,
    });
  });
};

//get Staff Count in Branch
function getBranchStaffCount(branchIdArr, callback) {
  User.count({
    where: {
      [Op.or]: branchIdArr,
    },
    group: ["type"],
  })
    .then((data) => {
      console.log(data);
      callback(null, data);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
}

exports.getBranchStaffCount = async (req, res) => {
  if (!req.params.id) return res.status(500).send("Id is missing");
  let id = req.params.id;
  var branchIdArr = [{ branchId: id }];
  getBranchStaffCount(branchIdArr, (err, data) => {
    if (err)
      return res.status(400).send({
        success: "false",
        message: "Error in getting staff count",
        description: err.message,
      });

    res.send({
      success: "true",
      data: data,
    });
  });
};

//get Attendance Count in Branch
function getBranchAttendanceCount(branchIdArr, callback) {
  var today = new Date();
  Attendance.findAll({
    where: {
      [Op.or]: branchIdArr,
      date: {
        [Op.between]: [
          `${today.toISOString().slice(0, 4)}-01-01`,
          `${today.toISOString().slice(0, 4)}-12-31`,
        ],
      },
    },
    attributes: [
      "date",
      [Sequelize.fn("COUNT", Sequelize.col("date")), "count"],
    ],
    group: [Sequelize.fn("Month", Sequelize.col("date"))],
    order: [[Sequelize.col("date"), "ASC"]],
  })
    .then((attendanceYear) => {
      var lastDayOfMonth = new Date(
        today.getFullYear(),
        today.getMonth() + 1,
        1
      );
      console.log(
        `${today.toISOString().slice(0, 7)}-01 ${lastDayOfMonth
          .toISOString()
          .slice(0, 10)}`
      );
      Attendance.findAll({
        where: {
          [Op.or]: branchIdArr,
          date: {
            [Op.between]: [
              `${today.toISOString().slice(0, 7)}-01`,
              `${lastDayOfMonth.toISOString().slice(0, 10)}`,
            ],
          },
        },
        attributes: [
          "date",
          [Sequelize.fn("COUNT", Sequelize.col("date")), "count"],
        ],
        group: [Sequelize.fn("Day", Sequelize.col("date"))],
        order: [[Sequelize.col("date"), "ASC"]],
      })
        .then((attendanceMonth) => {
          callback(null, {
            attendanceMonth: attendanceMonth,
            attendanceYear: attendanceYear,
          });
        })
        .catch((err) => {
          console.log(err);
          callback(err);
        });
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
}

exports.getBranchAttendanceCount = async (req, res) => {
  if (!req.params.id) return res.status(500).send("Id is missing");
  let id = req.params.id;
  var branchIdArr = [{ branchId: id }];
  getBranchAttendanceCount(branchIdArr, (err, data) => {
    if (err)
      return res.status(400).send({
        success: "false",
        message: "Error in getting attendance count",
        description: err.message,
      });

    res.send({
      success: "true",
      data: data,
    });
  });
};

//get Total Income in Branch
function getBranchTotalIncome(branchIdArr, callback) {
  var today = new Date();
  var startMonth = new Date();
  startMonth.setMonth(startMonth.getMonth() - 12);
  var lastDayOfStartMonth = new Date(
    startMonth.getFullYear(),
    startMonth.getMonth() + 1,
    1
  );
  var memberIdArr = [];
  Membership.findAll({
    where: { [Op.or]: branchIdArr },
  })
    .then(async (member) => {
      await member.map((element) => {
        memberIdArr.push({ membershipId: element.id });
      });
      console.log(memberIdArr);
      Payment.findAll({
        where: {
          [Op.or]: memberIdArr,
          date: {
            [Op.between]: [
              `${today.toISOString().slice(0, 4)}-01-01`,
              `${today.toISOString().slice(0, 10)}`,
            ],
          },
        },
        attributes: [
          "date",
          [Sequelize.fn("sum", Sequelize.col("amount")), "totalAmount"],
        ],
        group: [Sequelize.fn("Month", Sequelize.col("date"))],
        order: [[Sequelize.col("date"), "ASC"]],
      })
        .then((payment) => {
          console.log(payment);
          Payment.findAll({
            where: {
              [Op.or]: memberIdArr,
              date: {
                [Op.between]: [
                  `${today.toISOString().slice(0, 4)}-01-01`,
                  `${today.toISOString().slice(0, 10)}`,
                ],
              },
            },
            order: [[Sequelize.col("CreatedAt"), "ASC"]],
          })
            .then((rawPayment) => {
              console.log(rawPayment);
              callback(null, { payment, rawPayment });
            })
            .catch((err) => {
              console.log(err);
              callback(err);
            });
        })
        .catch((err) => {
          console.log(err);
          callback(err);
        });
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
}

// get one gym total Income
exports.getGymTotalIncome = async (req, res) => {
  if (!req.params.id) return res.status(500).send("Id is missing");
  let id = req.params.id;
  var branchIdArr = [];
  Branch.findAll({
    where: { gymId: id },
  }).then(async (branches) => {
    await branches.map((element) => {
      branchIdArr.push({ branchId: element.id });
    });
    getBranchTotalIncome(branchIdArr, (err, data) => {
      if (err)
        return res.status(400).send({
          success: "false",
          message: "Error in getting total income",
          description: err.message,
        });

      res.send({
        success: "true",
        data: data,
      });
    });
  });
};

// get one gym monthly total Income
exports.getGymRawMonthlyTotalIncome = async (req, res) => {
  if (!req.params.id) return res.status(500).send("Id is missing");
  let id = req.params.id;
  var today = new Date();
  var memberIdArr = [];

  var branchIdArr = [];
  Branch.findAll({
    where: { gymId: id },
  })
    .then(async (branches) => {
      await branches.map((element) => {
        branchIdArr.push({ branchId: element.id });
      });
      Membership.findAll({
        where: { [Op.or]: branchIdArr },
      }).then(async (member) => {
        await member.map((element) => {
          memberIdArr.push({ membershipId: element.id });
        });
        console.log(memberIdArr);
        Payment.findAll({
          where: {
            [Op.or]: memberIdArr,
            date: {
              [Op.between]: [
                `${today.toISOString().slice(0, 8)}-01`,
                `${today.toISOString().slice(0, 10)}`,
              ],
            },
          },
          order: [[Sequelize.col("CreatedAt"), "ASC"]],
        })
          .then((rawPayment) => {
            console.log(rawPayment);
            res.send({
              success: "true",
              data: rawPayment,
            });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).send({
              success: "false",
              message: "Error in getting total income",
              description: err.message,
            });
          });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        success: "false",
        message: "Error in getting total income",
        description: err.message,
      });
    });
};

// get one gym monthly total Income
exports.getBranchRawMonthlyTotalIncome = async (req, res) => {
  if (!req.params.id) return res.status(500).send("Id is missing");
  let id = req.params.id;
  var memberIdArr = [];
  var branchIdArr = [{ branchId: id }];
  var today = new Date();

  Membership.findAll({
    where: { [Op.or]: branchIdArr },
  }).then(async (member) => {
    await member.map((element) => {
      memberIdArr.push({ membershipId: element.id });
    });
    console.log(memberIdArr);
    Payment.findAll({
      where: {
        [Op.or]: memberIdArr,
        date: {
          [Op.between]: [
            `${today.toISOString().slice(0, 8)}-01`,
            `${today.toISOString().slice(0, 10)}`,
          ],
        },
      },
      order: [[Sequelize.col("CreatedAt"), "ASC"]],
    })
      .then((rawPayment) => {
        console.log(rawPayment);
        res.send({
          success: "true",
          data: rawPayment,
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({
          success: "false",
          message: "Error in getting total income",
          description: err.message,
        });
      });
  });
};

exports.getBranchTotalIncome = async (req, res) => {
  if (!req.params.id) return res.status(500).send("Id is missing");
  let id = req.params.id;
  var branchIdArr = [{ branchId: id }];
  getBranchTotalIncome(branchIdArr, (err, data) => {
    if (err)
      return res.status(400).send({
        success: "false",
        message: "Error in getting total income",
        description: err.message,
      });

    res.send({
      success: "true",
      data: data,
    });
  });
};

// get All Manager Dashboard Data
exports.getManagerDashboardData = async (req, res) => {
  if (!req.params.id) return res.status(500).send("Id is missing");
  let id = req.params.id;
  var branchIdArr = [{ branchId: id }];
  getBranchMemberCount(branchIdArr, (err, memberCount) => {
    if (err)
      return res.status(400).send({
        success: "false",
        message: "Error in getting member count",
        description: err.message,
      });
    getBranchServiceCount(branchIdArr, (err, serviceCount) => {
      if (err)
        return res.status(400).send({
          success: "false",
          message: "Error in getting service count",
          description: err.message,
        });

      getBranchStaffCount(branchIdArr, (err, staffCount) => {
        if (err)
          return res.status(400).send({
            success: "false",
            message: "Error in getting staff count",
            description: err.message,
          });

        getBranchExpiredMemberCount(branchIdArr, (err, exMemberCount) => {
          if (err)
            return res.status(400).send({
              success: "false",
              message: "Error in getting exMember count",
              description: err.message,
            });

          getBranchAttendanceCount(branchIdArr, (err, attendanceCount) => {
            if (err)
              return res.status(400).send({
                success: "false",
                message: "Error in getting attendance count",
                description: err.message,
              });

            getBranchTotalIncome(branchIdArr, (err, incomeCount) => {
              if (err)
                return res.status(400).send({
                  success: "false",
                  message: "Error in getting income count",
                  description: err.message,
                });

              res.send({
                success: "true",
                data: {
                  memberCount: memberCount,
                  serviceCount: serviceCount,
                  staffCount: staffCount,
                  exMemberCount: exMemberCount,
                  attendanceCount: attendanceCount,
                  incomeCount: incomeCount.payment,
                  rawPaymentData: incomeCount.rawPayment,
                },
              });
            });
          });
        });
      });
    });
  });
};

// =========================== Ownerdashboard Data =================================

//get Membership Count in Gym

exports.getGymMemberCount = async (req, res) => {
  if (!req.params.id) return res.status(500).send("Id is missing");
  let id = req.params.id;
  var branchIdArr = [];
  Branch.findAll({
    where: { gymId: id },
  })
    .then(async (user) => {
      await user.map((element) => {
        branchIdArr.push({ branchId: element.id });
      });
      getGymMemberCount(branchIdArr, (err, data) => {
        if (err)
          return res.status(400).send({
            success: "false",
            message: "Error in getting membership count",
            description: err.message,
          });

        res.send({
          success: "true",
          data: data,
        });
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        success: "false",
        message: "Error in getting branch id",
        description: err.message,
      });
    });
};

// get All Owner Dashboard Data
exports.getOwnerDashboardData = async (req, res) => {
  if (!req.params.id) return res.status(500).send("Id is missing");
  let id = req.params.id;
  var branchIdArr = [];
  var gymIdArr = [];
  Gym.findAll({
    where: { userId: id },
  })
    .then(async (gym) => {
      await gym.map((element) => {
        gymIdArr.push({ gymId: element.id });
      });
      Branch.findAll({
        where: { [Op.or]: gymIdArr },
      })
        .then(async (user) => {
          await user.map((element) => {
            branchIdArr.push({ branchId: element.id });
          });
          getBranchMemberCount(branchIdArr, (err, memberCount) => {
            if (err)
              return res.status(400).send({
                success: "false",
                message: "Error in getting member count",
                description: err.message,
              });
            getBranchServiceCount(branchIdArr, (err, serviceCount) => {
              if (err)
                return res.status(400).send({
                  success: "false",
                  message: "Error in getting service count",
                  description: err.message,
                });

              getBranchStaffCount(branchIdArr, (err, staffCount) => {
                if (err)
                  return res.status(400).send({
                    success: "false",
                    message: "Error in getting staff count",
                    description: err.message,
                  });

                getBranchExpiredMemberCount(
                  branchIdArr,
                  (err, exMemberCount) => {
                    if (err)
                      return res.status(400).send({
                        success: "false",
                        message: "Error in getting exMember count",
                        description: err.message,
                      });

                    getBranchAttendanceCount(
                      branchIdArr,
                      (err, attendanceCount) => {
                        if (err)
                          return res.status(400).send({
                            success: "false",
                            message: "Error in getting attendance count",
                            description: err.message,
                          });

                        getBranchTotalIncome(
                          branchIdArr,
                          (err, incomeCount) => {
                            if (err)
                              return res.status(400).send({
                                success: "false",
                                message: "Error in getting income count",
                                description: err.message,
                              });

                            res.send({
                              success: "true",
                              data: {
                                memberCount: memberCount,
                                branchCount: branchIdArr.length,
                                serviceCount: serviceCount,
                                staffCount: staffCount,
                                exMemberCount: exMemberCount,
                                attendanceCount: attendanceCount,
                                incomeCount: incomeCount.payment,
                                rawPaymentData: incomeCount.rawPayment,
                              },
                            });
                          }
                        );
                      }
                    );
                  }
                );
              });
            });
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({
            success: "false",
            message: "Error in getting branch id",
            description: err.message,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        success: "false",
        message: "Error in getting gym id",
        description: err.message,
      });
    });
};

// get one Month Income
function getOneBranchMonthIncome(branchId, callback) {
  var today = new Date();
  var startMonth = new Date();
  startMonth.setMonth(startMonth.getMonth() - 1);
  var lastDayOfStartMonth = new Date(
    startMonth.getFullYear(),
    startMonth.getMonth() + 1,
    1
  );
  Payment.findAll({
    where: {
      date: {
        [Op.between]: [
          `${today.toISOString().slice(0, 7)}-01`,
          `${today.toISOString().slice(0, 10)}`,
        ],
      },
    },
    include: [
      {
        model: Membership,
        where: {
          branchId: branchId,
        },
        include: [
          {
            model: Branch,
          },
        ],
      },
    ],
    order: [[Sequelize.col("date"), "ASC"]],
  })
    .then((payment) => {
      console.log(payment);
      callback(null, payment);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
}

//get Month Income in Branch
function getBranchMonthIncome(branchIdArr, callback) {
  var today = new Date();
  var startMonth = new Date();
  startMonth.setMonth(startMonth.getMonth() - 1);
  var lastDayOfStartMonth = new Date(
    startMonth.getFullYear(),
    startMonth.getMonth() + 1,
    1
  );
  Payment.findAll({
    where: {
      date: {
        [Op.between]: [
          `${today.toISOString().slice(0, 7)}-01`,
          `${today.toISOString().slice(0, 10)}`,
        ],
      },
    },
    include: [
      {
        model: Membership,
        where: {
          [Op.or]: branchIdArr,
        },
        include: [
          {
            model: Branch,
          },
        ],
      },
    ],

    attributes: [[Sequelize.fn("sum", Sequelize.col("amount")), "totalAmount"]],
    group: ["branchId"],
    order: [[Sequelize.col("date"), "ASC"]],
  })
    .then((payment) => {
      console.log(payment);
      callback(null, payment);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
}

exports.getOneBranchMonthIncome = async (req, res) => {
  if (!req.params.id) return res.status(500).send("Id is missing");
  let branchId = req.params.id;
  getOneBranchMonthIncome(branchId, (err, data) => {
    if (err)
      return res.status(400).send({
        success: "false",
        message: "Error in getting membership count",
        description: err.message,
      });

    res.send({
      success: "true",
      data: data,
    });
  });
};

exports.getBranchMonthIncome = async (req, res) => {
  if (!req.params.id) return res.status(500).send("Id is missing");
  let id = req.params.id;
  var branchIdArr = [];
  var gymIdArr = [];
  Gym.findAll({
    where: { userId: id },
  })
    .then(async (gym) => {
      await gym.map((element) => {
        gymIdArr.push({ gymId: element.id });
      });
      Branch.findAll({
        where: { [Op.or]: gymIdArr },
      })
        .then(async (user) => {
          await user.map((element) => {
            branchIdArr.push({ branchId: element.id });
          });
          getBranchMonthIncome(branchIdArr, (err, data) => {
            if (err)
              return res.status(400).send({
                success: "false",
                message: "Error in getting membership count",
                description: err.message,
              });

            res.send({
              success: "true",
              data: data,
            });
          });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({
            success: "false",
            message: "Error in getting branch id",
            description: err.message,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        success: "false",
        message: "Error in getting branch id",
        description: err.message,
      });
    });
};

// get admin dashboard data
exports.getAdminDashboardData = async (req, res) => {
  User.count({
    group: ["type"],
  })
    .then((userCount) => {
      Membership.count({
        group: ["isActive"],
      })
        .then((memberCount) => {
          Gym.count()
            .then((gymCount) => {
              Branch.count({
                group: ["isActive"],
              })
                .then((branchCount) => {
                  ServiceType.count()
                    .then((serviceCount) => {
                      var today = new Date();
                      var startMonth = new Date();
                      startMonth.setMonth(startMonth.getMonth() - 1);
                      var lastDayOfStartMonth = new Date(
                        startMonth.getFullYear(),
                        startMonth.getMonth() + 1,
                        1
                      );
                      SubPayment.findAll({
                        where: {
                          date: {
                            [Op.between]: [
                              `${today.toISOString().slice(0, 4)}-01-01`,
                              `${today.toISOString().slice(0, 10)}`,
                            ],
                          },
                        },
                        attributes: [
                          "date",
                          [
                            Sequelize.fn("sum", Sequelize.col("amount")),
                            "totalAmount",
                          ],
                        ],
                        group: [Sequelize.fn("Month", Sequelize.col("date"))],
                        order: [[Sequelize.col("date"), "ASC"]],
                      })
                        .then((payment) => {
                          console.log(payment);

                          SubPayment.findAll({
                            where: {
                              date: {
                                [Op.between]: [
                                  `${today.toISOString().slice(0, 4)}-01-01`,
                                  `${today.toISOString().slice(0, 10)}`,
                                ],
                              },
                            },
                            order: [[Sequelize.col("CreatedAt"), "ASC"]],
                          })
                            .then((rawPayment) => {
                              console.log(rawPayment);

                              SubscriptionType.findAll()
                                .then((subscriptionType) => {
                                  res.send({
                                    success: "true",
                                    data: {
                                      userCount: userCount,
                                      memberCount: memberCount,
                                      gymCount: gymCount,
                                      branchCount: branchCount,
                                      serviceCount: serviceCount,
                                      payment: payment,
                                      rawPaymentData: rawPayment,
                                      subscriptionType: subscriptionType,
                                    },
                                  });
                                })
                                .catch((err) => {
                                  res.status(400).send({
                                    success: "false",
                                    message:
                                      "Error in getting subscription type data",
                                    description: err.message,
                                  });
                                });
                            })
                            .catch((err) => {
                              console.log(err);
                              res.status(400).send({
                                success: "false",
                                message:
                                  "Error in getting subscription payment data",
                                description: err.message,
                              });
                            });
                        })
                        .catch((err) => {
                          console.log(err);
                          res.status(400).send({
                            success: "false",
                            message:
                              "Error in getting subscription payment data",
                            description: err.message,
                          });
                        });
                    })
                    .catch((err) => {
                      console.log(err);
                      res.status(400).send({
                        success: "false",
                        message: "Error in getting service type data",
                        description: err.message,
                      });
                    });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(400).send({
                    success: "false",
                    message: "Error in getting branch data",
                    description: err.message,
                  });
                });
            })
            .catch((err) => {
              console.log(err);
              res.status(400).send({
                success: "false",
                message: "Error in getting gym data",
                description: err.message,
              });
            });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({
            success: "false",
            message: "Error in getting member data",
            description: err.message,
          });
        });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        success: "false",
        message: "Error in getting user data",
        description: err.message,
      });
    });
};

// =========================== Trainerdashboard Data ============================

//get Assigned Membership Count in Branch
function getAssignedBranchMemberCount(trainerId, callback) {
  Membership.count({
    where: {
      trainerId: trainerId,
    },
  })
    .then((data) => {
      console.log(data);
      callback(null, data);
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
}

exports.getAssignedBranchMemberCount = async (req, res) => {
  if (!req.params.id) return res.status(500).send("Id is missing");
  let id = req.params.id;
  getAssignedBranchMemberCount(id, (err, data) => {
    if (err)
      return res.status(400).send({
        success: "false",
        message: "Error in getting membership count",
        description: err.message,
      });

    res.send({
      success: "true",
      data: data,
    });
  });
};

//get latest Membership with details in Branch
function getLatestMemberDetails(trainerId, callback) {
  var memberIdArr = [];
  var today = new Date();
  Membership.findAll({
    where: {
      trainerId: trainerId,
    },
  })
    .then(async (memberData) => {
      console.log(memberData);
      await memberData.map((element) => {
        memberIdArr.push({ membershipId: element.id });
      });
      Schedule.findAll({
        limit: 6,
        where: {
          [Op.or]: memberIdArr,
        },
        attributes: [
          [Sequelize.fn("max", Sequelize.col("expireDate")), "expireDate"],
          "membershipId",
          "trainerId",
        ],
        group: ["membershipId"],
        // order: [[Sequelize.fn("max", Sequelize.col("expireDate"))]],
      })
        .then((scheduleData) => {
          console.log(scheduleData);
          callback(null, scheduleData);
        })
        .catch((err) => {
          console.log(err);
          callback(err);
        });
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
}

exports.getLatestMemberDetails = async (req, res) => {
  if (!req.params.id) return res.status(500).send("Id is missing");
  let id = req.params.id;
  getLatestMemberDetails(id, (err, data) => {
    if (err)
      return res.status(400).send({
        success: "false",
        message: "Error in getting membership count",
        description: err.message,
      });

    res.send({
      success: "true",
      data: data,
    });
  });
};

//get Customer has a dietPlan
function getHasADietPlan(trainerId, callback) {
  var memberIdArr = [];
  var userIdArr = [];
  var today = new Date();
  Membership.findAll({
    where: {
      trainerId: trainerId,
    },
    include: [
      {
        model: User,
        attributes: ["id", "firstName", "lastName"],
      },
    ],
  })
    .then(async (memberData) => {
      console.log(memberData);
      await memberData.map((element) => {
        userIdArr.push({ userId: element.user.id });
        memberIdArr.push({ membershipId: element.id });
      });
      DietPlan.findAll({
        limit: 6,
        where: {
          [Op.or]: userIdArr,
        },
        group: ["userId"],
        // order: [[Sequelize.fn("max", Sequelize.col("expireDate"))]],
      })
        .then(async (dietData) => {
          console.log(dietData);
          await memberData.forEach((element) => {
            if (dietData.some((e) => e.userId == element.user.id)) {
              element.dataValues.isDietAvailable = true;
              console.log("dietData True");
              console.log(element);
            } else {
              element.dataValues.isDietAvailable = false;
              console.log("dietData False");
              console.log(element);
            }
          });
          console.log("Done");
          callback(null, { memberData });
        })
        .catch((err) => {
          console.log(err);
          callback(err);
        });
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
}

exports.getHasADietPlan = async (req, res) => {
  if (!req.params.id) return res.status(500).send("Id is missing");
  let id = req.params.id;
  getHasADietPlan(id, (err, data) => {
    if (err)
      return res.status(400).send({
        success: "false",
        message: "Error in getting membership count",
        description: err.message,
      });

    res.send({
      success: "true",
      data: data,
    });
  });
};

// get memberDetails for Trainer Dashboard
exports.getMemberDetails = async (req, res) => {
  if (!req.params.id) return res.status(500).send("Id is missing");
  let trainerId = req.params.id;
  var memberIdArr = [];
  var userIdArr = [];
  var today = new Date();
  var branchIdArr = [{ branchId: req.body.branchId }];
  getAssignedBranchMemberCount(trainerId, (err, memberCount) => {
    if (err)
      return res.status(400).send({
        success: "false",
        message: "Error in getting member count",
        description: err.message,
      });
    getBranchServiceCount(branchIdArr, (err, serviceCount) => {
      if (err)
        return res.status(400).send({
          success: "false",
          message: "Error in getting service count",
          description: err.message,
        });

      getBranchExpiredMemberCount(branchIdArr, (err, exMemberCount) => {
        if (err)
          return res.status(400).send({
            success: "false",
            message: "Error in getting exMember count",
            description: err.message,
          });

        getBranchAttendanceCount(branchIdArr, (err, attendanceCount) => {
          if (err)
            return res.status(400).send({
              success: "false",
              message: "Error in getting attendance count",
              description: err.message,
            });
          Membership.findAll({
            where: {
              trainerId: trainerId,
            },
            include: [
              {
                model: User,
                attributes: ["id", "firstName", "lastName", "image"],
              },
            ],
          })
            .then(async (memberData) => {
              console.log(memberData);
              await memberData.map((element) => {
                userIdArr.push({ userId: element.user.id });
                memberIdArr.push({ membershipId: element.id });
              });
              DietPlan.findAll({
                where: {
                  [Op.or]: userIdArr,
                },
                group: ["userId"],
                // order: [[Sequelize.fn("max", Sequelize.col("expireDate"))]],
              })
                .then(async (dietData) => {
                  console.log(dietData);
                  await memberData.forEach((element) => {
                    if (dietData.some((e) => e.userId == element.user.id)) {
                      element.dataValues.isDietAvailable = true;
                      console.log("dietData True");
                      console.log(element);
                    } else {
                      element.dataValues.isDietAvailable = false;
                      console.log("dietData False");
                      console.log(element);
                    }
                  });
                  Schedule.findAll({
                    where: {
                      [Op.or]: memberIdArr,
                    },
                    attributes: [
                      [
                        Sequelize.fn("max", Sequelize.col("expireDate")),
                        "expireDate",
                      ],
                      "membershipId",
                      "trainerId",
                    ],
                    group: ["membershipId"],
                    // order: [[Sequelize.fn("max", Sequelize.col("expireDate"))]],
                  })
                    .then(async (scheduleData) => {
                      console.log(scheduleData);
                      await memberData.forEach((element) => {
                        const result = scheduleData.find(
                          ({ membershipId }) => membershipId == element.id
                        );

                        if (result != null) {
                          element.dataValues.scheduleExpireDate =
                            result.expireDate;
                          console.log("Schedule Data Added");
                          console.log(element);
                        } else {
                          element.dataValues.scheduleExpireDate = null;
                          console.log("Schedule Data Not Found");
                          console.log(element);
                        }
                      });
                      console.log("Done");
                      res.send({
                        success: "true",
                        data: {
                          memberCount: memberCount,
                          serviceCount: serviceCount,
                          exMemberCount: exMemberCount,
                          attendanceCount: attendanceCount,
                          memberData: memberData,
                        },
                      });
                    })
                    .catch((err) => {
                      console.log(err);
                      res.status(400).send({
                        success: "false",
                        message: "Error in Getting All Schedule",
                        description: err.message,
                      });
                    });
                })
                .catch((err) => {
                  console.log(err);
                  res.status(400).send({
                    success: "false",
                    message: "Error in Getting All DietPlan",
                    description: err.message,
                  });
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
        });
      });
    });
  });
};
