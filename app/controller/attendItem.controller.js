const AttendItem = require("../model/attendItem.model");
const Attendance = require("../model/attendance.model");
const ScheduleItem = require("../model/scheduleItem.model");
const { Sequelize, Op } = require("sequelize");
const ServiceType = require("../model/serviceType.model");
// const sequelize = Sequelize();

//Register a AttendItem | guest
exports.createAttendItem = async (req, res) => {
  if (req.body) {
    console.log("Create attendItem");
    AttendItem.create(req.body)
      .then((attendItem) => {
        res.send({
          success: "true",
          data: attendItem,
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Create AttendItem",
          description: err.message,
        });
      });
  }
};

//update AttendItem Details
exports.updateAttendItem = async (req, res) => {
  if (req.body) {
    if (!req.params.id) return res.status(500).send("Id is missing");
    let id = req.params.id;
    AttendItem.update(req.body, {
      where: {
        id: id,
      },
    })
      .then((attendItem) => {
        res.status(200).send({
          success: attendItem[0] == 1 ? "true" : "false",
          data:
            attendItem[0] == 1
              ? "Updated Successfully"
              : "Update Not Successful",
        });
      })
      .catch((err) => {
        console.log(err);

        res.status(400).send({
          success: "false",
          message: "Error in Update AttendIte",
          description: err.message,
        });
      });
  }
};

//update AttendItem Details By Id and AttendanceId
exports.updateAttendItemByScheduleItemIdAndAttendanceId = async (req, res) => {
  if (req.body) {
    if (!req.body.attendanceId)
      return res.status(500).send("AttendanceId is missing");
    // let id = req.body.attendanceId;
    AttendItem.update(req.body, {
      where: {
        attendanceId: req.body.attendanceId,
        scheduleItemId: req.body.scheduleItemId,
      },
    })
      .then((attendItem) => {
        res.status(200).send({
          success: attendItem[0] == 1 ? "true" : "false",
          data:
            attendItem[0] == 1
              ? "Updated Successfully"
              : "Update Not Successful",
        });
      })
      .catch((err) => {
        console.log(err);
        res.status(400).send({
          success: "false",
          message:
            "Error in Update AttendItem By ScheduleItemId And AttendanceId",
          description: err.message,
        });
      });
  }
};

//get All AttendItem
exports.getAllAttendItem = (req, res) => {
  console.log("get All");
  AttendItem.findAll()
    .then((attendItem) => {
      res.send({
        success: "true",
        data: attendItem,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting All AttendItem",
        description: err.message,
      });
    });
};

//get All AttendItem By AttendanceId
exports.getAllAttendItemByAttendanceId = (req, res) => {
  console.log("get All AttendItem By AttendanceId");
  AttendItem.findAll({
    where: {
      attendanceId: req.params.id,
    },
    include: [
      {
        model: Attendance,
      },
      {
        model: ScheduleItem,
        include: [
          {
            model: ServiceType,
          },
        ],
      },
    ],
  })
    .then((attendItem) => {
      res.send({
        success: "true",
        data: attendItem,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting All AttendItem",
        description: err.message,
      });
    });
};

function getMonday(d) {
  d = new Date(d);
  var day = d.getDay(),
    diff = d.getDate() - day + (day == 0 ? -6 : 1); // adjust when day is sunday
  return new Date(d.setDate(diff)).toISOString();
}

//get Total Percentage In Week AttendItem By MemberId And Date
exports.getAllAttendItemByMemberIdAndDate = (req, res) => {
  console.log("get Total Percentage In Week AttendItem By MemberId And Date");
  var attendIdArr = [];
  var startDate = getMonday(req.body.date);
  console.log(startDate);

  var startDate = startDate.slice(0, 10);
  Attendance.findAll({
    where: {
      [Op.and]: [
        { membershipId: req.body.membershipId },
        {
          date: {
            [Op.between]: [startDate, req.body.date],
          },
        },
      ],
    },
  })
    .then(async (attendance) => {
      await attendance.map((element) => {
        attendIdArr.push({ attendanceId: element.id });
      });
      console.log(attendIdArr);

      AttendItem.findAll({
        where: {
          [Op.or]: attendIdArr,
        },
        attributes: [
          "scheduleItemId",
          [
            Sequelize.fn("sum", Sequelize.col("donePercentage")),
            "totalDonePercentage",
          ],
        ],
        group: ["scheduleItemId"],
        include: {
          model: ScheduleItem,
          include: {
            model: ServiceType,
          },
        },
      })
        .then((attendItem) => {
          console.log(attendItem);
          res.send({
            success: "true",
            data: { attendItem: attendItem },
          });
        })
        .catch((err) => {
          console.log(err);

          res.status(400).send({
            success: "false",
            message: "Error in Getting All AttendItem",
            description: err.message,
          });
        });
    })
    .catch((err) => {
      console.log(err);

      res.status(400).send({
        success: "false",
        message: "Error in Getting All AttendItem",
        description: err.message,
      });
    });
};

//get AttendItem By Id
exports.getAttendItemById = (req, res) => {
  console.log("get All");
  AttendItem.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Attendance,
      },
      {
        model: ScheduleItem,
      },
    ],
  })
    .then((attendItem) => {
      res.send({
        success: "true",
        data: attendItem,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting AttendItem By ID",
        description: err.message,
      });
    });
};

//delete AttendItem
exports.deleteAttendItem = async (req, res) => {
  console.log("Delete attendItem");
  AttendItem.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((attendItem) => {
      console.log(attendItem);
      res.status(200).send({
        success: attendItem == 1 ? "true" : "false",
        data:
          attendItem == 1 ? "Deleted Successfully" : "Delete Not Successful",
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Delete AttendItem",
        description: err.message,
      });
    });
};
