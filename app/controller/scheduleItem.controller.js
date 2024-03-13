const ScheduleItem = require("../model/scheduleItem.model");
const Schedule = require("../model/schedule.model");
const Attendance = require("../model/attendance.model");
const ServiceType = require("../model/serviceType.model");
const { Sequelize, Op } = require("sequelize");

//Register a ScheduleItem | guest
exports.createScheduleItem = async (req, res) => {
  if (req.body) {
    console.log("Create scheduleItem");
    ScheduleItem.create(req.body)
      .then((scheduleItem) => {
        res.send({
          success: "true",
          data: scheduleItem,
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Create ScheduleItem",
          description: err.message,
        });
      });
  }
};

//update ScheduleItem Details
exports.updateScheduleItem = async (req, res) => {
  if (req.body) {
    if (!req.params.id) return res.status(500).send("Id is missing");
    let id = req.params.id;
    ScheduleItem.update(req.body, {
      where: {
        id: id,
      },
    })
      .then((scheduleItem) => {
        res.status(200).send({
          success: scheduleItem[0] == 1 ? "true" : "false",
          data:
            scheduleItem[0] == 1
              ? "Updated Successfully"
              : "Update Not Successful",
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Update ScheduleItem",
          description: err.message,
        });
      });
  }
};

//get All ScheduleItem
exports.getAllScheduleItem = (req, res) => {
  console.log("get All");
  ScheduleItem.findAll()
    .then((scheduleItem) => {
      res.send({
        success: "true",
        data: scheduleItem,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting All ScheduleItem",
        description: err.message,
      });
    });
};

//get ScheduleItem By Id
exports.getScheduleItemById = (req, res) => {
  console.log("get All");
  ScheduleItem.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Schedule,
      },
      {
        model: ServiceType,
      },
    ],
  })
    .then((scheduleItem) => {
      res.send({
        success: "true",
        data: scheduleItem,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting ScheduleItem By ID",
        description: err.message,
      });
    });
};

//get ScheduleItem By ScheduleId
exports.getScheduleItemById = (req, res) => {
  console.log("get All");
  ScheduleItem.findAll({
    where: {
      scheduleId: req.params.id,
    },
    include: [
      {
        model: Schedule,
      },
      {
        model: ServiceType,
      },
    ],
  })
    .then((scheduleItem) => {
      res.send({
        success: "true",
        data: scheduleItem,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting ScheduleItem By ID",
        description: err.message,
      });
    });
};

//get ScheduleItem By MemberId
exports.getScheduleItemByMemberId = (req, res) => {
  console.log("get All");
  Schedule.findAll({
    where: {
      membershipId: req.params.id,
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
          include: [
            {
              model: Schedule,
            },
            {
              model: ServiceType,
            },
          ],
        })
          .then((scheduleItem) => {
            res.send({
              success: "true",
              data: scheduleItem,
            });
          })
          .catch((err) => {
            res.status(400).send({
              success: "false",
              message: "Error in Getting ScheduleItem By ID",
              description: err.message,
            });
          });
      } else {
        res.status(400).send({
          success: "false",
          message: "Error in Getting ScheduleItem By ID",
          description: "Schedules Not Found",
        });
      }
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting Schedule By ID",
        description: err.message,
      });
    });
};

//delete ScheduleItem
exports.deleteScheduleItem = async (req, res) => {
  console.log("Delete scheduleItem");
  ScheduleItem.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((scheduleItem) => {
      console.log(scheduleItem);
      res.status(200).send({
        success: scheduleItem == 1 ? "true" : "false",
        data:
          scheduleItem == 1 ? "Deleted Successfully" : "Delete Not Successful",
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Delete ScheduleItem",
        description: err.message,
      });
    });
};
