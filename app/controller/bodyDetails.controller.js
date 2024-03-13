const BodyDetails = require("../model/bodyDetails.model");
const Membership = require("../model/membership.model");
const User = require("../model/user.model");

//Register a BodyDetails | guest
exports.createBodyDetails = async (req, res) => {
  if (req.body) {
    console.log("Create bodyDetails");
    BodyDetails.create(req.body)
      .then((bodyDetails) => {
        res.send({
          success: "true",
          data: bodyDetails,
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Create Attendance",
          description: err.message,
        });
      });
  }
};

//update BodyDetails Details
exports.updateBodyDetails = async (req, res) => {
  if (req.body) {
    if (!req.params.id) return res.status(500).send("Id is missing");
    let id = req.params.id;
    BodyDetails.update(req.body, {
      where: {
        id: id,
      },
    })
      .then((bodyDetails) => {
        res.status(200).send({
          success: bodyDetails[0] == 1 ? "true" : "false",
          data:
            bodyDetails[0] == 1
              ? "Updated Successfully"
              : "Update Not Successful",
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Update Attendance",
          description: err.message,
        });
      });
  }
};

//get All BodyDetails
exports.getAllBodyDetails = (req, res) => {
  console.log("get All");
  BodyDetails.findAll()
    .then((bodyDetails) => {
      res.send({
        success: "true",
        data: bodyDetails,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting All BodyDetails",
        description: err.message,
      });
    });
};

//get BodyDetails By Id
exports.getBodyDetailsById = (req, res) => {
  console.log("get All");
  BodyDetails.findOne({
    where: {
      id: req.params.id,
    },
    include: {
      model: User,
    },
  })
    .then((bodyDetails) => {
      res.send({
        success: "true",
        data: bodyDetails,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting BodyDetails By ID",
        description: err.message,
      });
    });
};

//get BodyDetails By UserId
exports.getBodyDetailsByUserId = (req, res) => {
  console.log("get BodyDetails By UserId");
  BodyDetails.findAll({
    where: {
      userId: req.params.id,
    },
  })
    .then((bodyDetails) => {
      res.send({
        success: "true",
        data: { bodyDetails: bodyDetails },
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting BodyDetails By User ID",
        description: err.message,
      });
    });
};

//get BodyDetails By UserId
exports.getLatestBodyDetailsByMemberId = (req, res) => {
  console.log("get Latest BodyDetails By MemberId");
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
      BodyDetails.findOne({
        where: {
          userId: membership.userId,
        },
        order: [["CreatedAt", "DESC"]],
      })
        .then((bodyDetails) => {
          res.send({
            success: "true",
            data: { bodyDetails: bodyDetails },
          });
        })
        .catch((err) => {
          res.status(400).send({
            success: "false",
            message: "Error in Getting BodyDetails By User ID",
            description: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting Membership By Member ID",
        description: err.message,
      });
    });
};

//delete BodyDetails
exports.deleteBodyDetails = async (req, res) => {
  console.log("Delete bodyDetails");
  BodyDetails.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((bodyDetails) => {
      console.log(bodyDetails);
      res.status(200).send({
        success: bodyDetails == 1 ? "true" : "false",
        data:
          bodyDetails == 1 ? "Deleted Successfully" : "Delete Not Successful",
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Delete BodyDetails",
        description: err.message,
      });
    });
};
