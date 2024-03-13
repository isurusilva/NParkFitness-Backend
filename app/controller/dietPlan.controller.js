const DietPlan = require("../model/dietPlan.model");
const MealItem = require("../model/mealItem.model");
const Membership = require("../model/membership.model");
const User = require("../model/user.model");
const { Sequelize, Op } = require("sequelize");
const Schedule = require("../model/schedule.model");
const ScheduleItem = require("../model/scheduleItem.model");
const sendAndSaveNotification = require("../config/firebaseNotification");
const Branch = require("../model/branch.model");
const Gym = require("../model/gym.model");

//Register a DietPlan | guest
exports.createDietPlan = async (req, res) => {
  if (req.body) {
    console.log("Create dietPlan");
    DietPlan.create(req.body)
      .then((dietPlan) => {
        res.send({
          success: "true",
          data: dietPlan,
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Create DietPlan",
          description: err.message,
        });
      });
  }
};

//update DietPlan Details
exports.updateDietPlan = async (req, res) => {
  if (req.body) {
    if (!req.params.id) return res.status(500).send("Id is missing");
    let id = req.params.id;
    DietPlan.update(req.body, {
      where: {
        id: id,
      },
    })
      .then((dietPlan) => {
        res.status(200).send({
          success: dietPlan[0] == 1 ? "true" : "false",
          data:
            dietPlan[0] == 1 ? "Updated Successfully" : "Update Not Successful",
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Update DietPlan",
          description: err.message,
        });
      });
  }
};

//get All DietPlan
exports.getAllDietPlan = (req, res) => {
  console.log("get All");
  DietPlan.findAll()
    .then((dietPlan) => {
      res.send({
        success: "true",
        data: dietPlan,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting All DietPlan",
        description: err.message,
      });
    });
};

//get DietPlan By Id
exports.getDietPlanById = (req, res) => {
  console.log("get All");
  DietPlan.findOne({
    where: {
      id: req.params.id,
    },
    include: {
      model: User,
    },
  })
    .then((dietPlan) => {
      res.send({
        success: "true",
        data: dietPlan,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting DietPlan By ID",
        description: err.message,
      });
    });
};

//get DietPlans and MealItems By MemberId
exports.getDietPlanAndMealByMemberId = (req, res) => {
  console.log("get DietPlans and MealItems By MemberId");
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
            model: Branch,
            include: {
              model: Gym,
            },
          },
        ],
      })
        .then((membership) => {
          if (membership == null)
            return res.status(500).send({
              success: "false",
              message: "Membership not found",
            });

          if (branch !== null && branch.gymId !== membership.branch.gymId) {
            res.status(400).send({
              success: "false",
              message: "This membership is not registered to your gym.",
            });
          } else {
            DietPlan.findAll({
              where: {
                userId: membership.userId,
              },
            })
              .then(async (dietPlan) => {
                var dietData = [];
                const promises = dietPlan.map(async (element) => {
                  await MealItem.findAll({
                    where: {
                      dietPlanId: element.id,
                    },
                    include: {
                      model: DietPlan,
                    },
                  })
                    .then(async (mealItem) => {
                      var totCalAmount = 0;
                      await mealItem.map((element) => {
                        totCalAmount += element.calAmount;
                      });
                      var data = {
                        totalCalorie: totCalAmount,
                        dietPlanData: element,
                        mealItemData: mealItem,
                      };
                      console.log(data);

                      dietData.push(data);
                    })
                    .catch((err) => {
                      res.status(400).send({
                        success: "false",
                        message: "Error in Getting MealItem By ID",
                        description: err.message,
                      });
                    });
                });
                await Promise.all(promises);
                // var allData = {
                //     'data': dietData
                // }
                console.log("Done");

                res.send({
                  success: "true",
                  data: dietData,
                });
              })
              .catch((err) => {
                console.log(err);
                res.status(400).send({
                  success: "false",
                  message: "Error in Getting DietPlan By ID",
                  description: err.message,
                });
              });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({
            success: "false",
            message: "Error in Getting DietPlan By ID",
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

//get DietPlans and MealItems By userId
exports.getDietPlanAndMealByUserId = (req, res) => {
  console.log("get DietPlans and MealItems By userId");
  DietPlan.findAll({
    where: {
      userId: req.params.id,
    },
  })
    .then(async (dietPlan) => {
      var dietData = [];
      const promises = dietPlan.map(async (element) => {
        await MealItem.findAll({
          where: {
            dietPlanId: element.id,
          },
          include: {
            model: DietPlan,
          },
        })
          .then(async (mealItem) => {
            var totCalAmount = 0;
            await mealItem.map((element) => {
              totCalAmount += element.calAmount;
            });
            var data = {
              totalCalorie: totCalAmount,
              dietPlanData: element,
              mealItemData: mealItem,
            };
            console.log(data);

            dietData.push(data);
          })
          .catch((err) => {
            res.status(400).send({
              success: "false",
              message: "Error in Getting MealItem By ID",
              description: err.message,
            });
          });
      });
      await Promise.all(promises);
      // var allData = {
      //     'data': dietData
      // }
      console.log("Done");

      res.send({
        success: "true",
        data: dietData,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        success: "false",
        message: "Error in Getting DietPlan By ID",
        description: err.message,
      });
    });
};

//create or update new Diet and mealItem
exports.createDietAndMealItem = (req, res) => {
  console.log("get All");
  console.log(req.body);
  Membership.findOne({
    where: {
      id: req.body.memberId,
    },
  })
    .then((membership) => {
      console.log(membership);
      DietPlan.findOne({
        where: {
          userId: membership.userId,
          mealType: req.body.mealType,
        },
      })
        .then((dietPlan) => {
          if (dietPlan !== null) {
            MealItem.destroy({
              where: {
                dietPlanId: dietPlan.id,
              },
            })
              .then(async (mealItem) => {
                console.log(mealItem);
                const mealArr = [];
                const promises = req.body.mealData.map(async (element) => {
                  mealArr.push({
                    foodName: element.name,
                    foodType: "Eat",
                    amount: element.amount,
                    calAmount: element.calorie,
                    dietPlanId: dietPlan.id,
                  });
                });
                await Promise.all(promises);
                await MealItem.bulkCreate(mealArr);
                sendAndSaveNotification(membership.userId, {
                  notification: {
                    title: "New diet plan created for you",
                    body: "Checkout your account for diet plan details.",
                  },
                });
                res.send({
                  success: "true",
                  data: mealArr,
                });
              })
              .catch((err) => {
                res.status(400).send({
                  success: "false",
                  message: "Error in Delete MealItem",
                  description: err.message,
                });
              });
          } else {
            console.log("Create dietPlan");
            DietPlan.create({
              mealType: req.body.mealType,
              userId: membership.userId,
            })
              .then(async (dietPlan) => {
                const mealArr = [];
                const promises = req.body.mealData.map(async (element) => {
                  mealArr.push({
                    foodName: element.name,
                    foodType: "Eat",
                    amount: element.amount,
                    calAmount: element.calorie,
                    dietPlanId: dietPlan.id,
                  });
                });
                await Promise.all(promises);
                await MealItem.bulkCreate(mealArr);
                res.send({
                  success: "true",
                  data: mealArr,
                });
              })
              .catch((err) => {
                res.status(400).send({
                  success: "false",
                  message: "Error in Create DietPlan",
                  description: err.message,
                });
              });
          }
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({
            success: "false",
            message: "Error in Getting DietPlan By ID",
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
};

async function getCalorieConsume(dietPlan, callback) {
  var dietIdArr = [];
  if (dietPlan !== null) {
    await dietPlan.map((element) => {
      dietIdArr.push({ dietPlanId: element.id });
    });
    MealItem.findAll({
      where: {
        [Op.or]: dietIdArr,
      },
    })
      .then(async (mealItem) => {
        console.log(mealItem);
        var concumedCalAmount = 0;
        const promises = mealItem.map(async (element) => {
          concumedCalAmount += element.calAmount;
        });
        await Promise.all(promises);
        console.log(concumedCalAmount);
        callback(null, concumedCalAmount);
      })
      .catch((err) => {
        console.log(err);
        callback(err);
      });
  } else {
    console.log("DietPlan is null");

    callback(null, 0);
  }
}

function getCalorieBurn(memberId, callback) {
  Schedule.findAll({
    where: {
      membershipId: memberId,
    },
    order: [["CreatedAt", "DESC"]],
  })
    .then((schedule) => {
      console.log("schedule");
      console.log(schedule);
      if (schedule.length > 0) {
        ScheduleItem.findAll({
          where: {
            scheduleId: schedule[0].id,
          },
        })
          .then(async (scheduleItem) => {
            var burnedCalAmount = 0;
            const promises = scheduleItem.map(async (element) => {
              burnedCalAmount += element.calAmount;
            });
            await Promise.all(promises);
            console.log(burnedCalAmount);
            callback(null, burnedCalAmount);
          })
          .catch((err) => {
            console.log(err);
            callback(err);
          });
      } else {
        console.log("Schedule is null");
        callback(null, 0);
      }
    })
    .catch((err) => {
      console.log(err);
      callback(err);
    });
}
//get Calorie Consumed and Burned
exports.getCalorieConsumeAndBurnByMemberId = async (req, res) => {
  console.log("Delete dietPlan");
  var body = {
    consumedCal: 0,
    burnedCal: 0,
  };

  Membership.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((membership) => {
      if (membership == null)
        return res.status(500).send({
          success: "false",
          message: "Membership not found",
        });

      console.log(membership);
      DietPlan.findAll({
        where: {
          userId: membership.userId,
        },
      })
        .then(async (dietPlan) => {
          var promises = new Promise(function (myResolve, myReject) {
            getCalorieConsume(dietPlan, (err, data) => {
              if (err) {
                myReject(err); // when error
              } else {
                body.consumedCal = data;
                myResolve(); // when successful
              }
            });
          });

          promises.then(
            function (value) {
              var promises1 = new Promise(function (myResolve, myReject) {
                getCalorieBurn(membership.id, (err, data) => {
                  if (err) {
                    myReject(err); // when error
                  } else {
                    body.burnedCal = data;
                    myResolve(); // when successful
                  }
                });
              });

              promises1.then(
                function (value) {
                  res.send({
                    success: "true",
                    data: body,
                  });
                },
                function (error) {
                  console.log(error);
                  res.status(400).send({
                    success: "false",
                    message: "Error in Getting DietPlan",
                    description: error.message,
                  });
                }
              );
            },
            function (error) {
              console.log(error);
              var promises1 = new Promise(function (myResolve, myReject) {
                getCalorieBurn(membership.id, (err, data) => {
                  if (err) {
                    myReject(err); // when error
                  } else {
                    body.burnedCal = data;
                    myResolve(); // when successful
                  }
                });
              });

              promises1.then(
                function (value) {
                  res.send({
                    success: "true",
                    data: body,
                  });
                },
                function (error) {
                  console.log(error);
                  res.status(400).send({
                    success: "false",
                    message: "Error in Getting DietPlan",
                    description: error.message,
                  });
                }
              );
            }
          );

          // await Promise.all(promises);
          // const promises1 = getCalorieBurn(membership.id, (err, data) => {
          //   if (err)
          //     return res.status(400).send({
          //       success: "false",
          //       message: "Error in getting burned calorie",
          //       description: err.message,
          //     });
          //   body.burnedCal = data;
          // });
          // await Promise.all(promises1);

          // res.send({
          //   success: "true",
          //   data: body,
          // });
        })
        .catch((err) => {
          console.log(err);
          res.status(400).send({
            success: "false",
            message: "Error in Getting DietPlan",
            description: err.message,
          });
        });
    })
    .catch((err) => {
      console.log(err);

      res.status(400).send({
        success: "false",
        message: "Error in Getting Membership",
        description: err.message,
      });
    });
};

//delete DietPlan
exports.deleteDietPlan = async (req, res) => {
  console.log("Delete dietPlan");
  DietPlan.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((dietPlan) => {
      console.log(dietPlan);
      res.status(200).send({
        success: dietPlan == 1 ? "true" : "false",
        data: dietPlan == 1 ? "Deleted Successfully" : "Delete Not Successful",
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Delete DietPlan",
        description: err.message,
      });
    });
};
