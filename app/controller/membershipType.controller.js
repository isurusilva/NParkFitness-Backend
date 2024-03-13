const Branch = require("../model/branch.model");
const Gym = require("../model/gym.model");
const Membership = require("../model/membership.model");
const MembershipType = require("../model/membershipType.model");
const User = require("../model/user.model");
const { Op } = require("sequelize");


//Register a MembershipType | guest
exports.createMembershipType = async (req, res) => {
  if (req.body) {
    console.log("Create membershipType");
    MembershipType.create(req.body)
      .then((membershipType) => {
        res.send({
          success: "true",
          data: membershipType,
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Create MembershipType",
          description: err.message,
        });
      });
  }
};

//update MembershipType Details
exports.updateMembershipType = async (req, res) => {
  if (req.body) {
    if (!req.params.id) return res.status(500).send("Id is missing");
    let id = req.params.id;
    MembershipType.update(req.body, {
      where: {
        id: id,
      },
    })
      .then((membershipType) => {
        res.status(200).send({
          success: membershipType[0] == 1 ? "true" : "false",
          data:
            membershipType[0] == 1
              ? "Updated Successfully"
              : "Update Not Successful",
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Update MembershipType",
          description: err.message,
        });
      });
  }
};

//get All MembershipType
exports.getAllMembershipType = (req, res) => {
  console.log("get All");
  MembershipType.findAll()
    .then((membershipType) => {
      res.send({
        success: "true",
        data: membershipType,
      });
    })
    .catch((err) => {
      console.log(err);
      res.status(400).send({
        success: "false",
        message: "Error in Getting All MembershipType",
        description: err.message,
      });
    });
};

//get MembershipType By Id
exports.getMembershipTypeById = (req, res) => {
  console.log("get All");
  MembershipType.findOne({
    where: {
      id: req.params.id,
    },
    include: {
      model: User,
    },
  })
    .then((membershipType) => {
      res.send({
        success: "true",
        data: membershipType,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting MembershipType By ID",
        description: err.message,
      });
    });
};

//get MembershipType By GymId
exports.getMembershipTypeByGymId = (req, res) => {
  console.log("get All MembershipType By GymId");
  MembershipType.findAll({
    where: {
      gymId: req.params.id,
    },
  })
    .then((membershipType) => {
      res.send({
        success: "true",
        data: { membershipType: membershipType },
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting MembershipType By ID",
        description: err.message,
      });
    });
};

//get MembershipType By BranchId
exports.getMembershipTypeByBranchId = (req, res) => {
  console.log("get All MembershipType By GymId");
  Branch.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((branch) => {
      if (!branch) {
        console.log("branch Not Found");
        return res.status(400).send({
          success: "false",
          message: "Branch Not Found",
          description: "Entered details does not found in database",
        });
      }
      MembershipType.findAll({
        where: {
          gymId: branch.gymId,
        },
      })
        .then((membershipType) => {
          res.send({
            success: "true",
            data: { membershipType: membershipType },
          });
        })
        .catch((err) => {
          res.status(400).send({
            success: "false",
            message: "Error in Getting MembershipType By ID",
            description: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting MembershipType By ID",
        description: err.message,
      });
    });
};

//delete MembershipType
exports.deleteMembershipType = async (req, res) => {
  console.log("Delete membershipType");
  var today = new Date();
  today.setDate(today.getDate() - 30);
  Membership.count({
    where: {
      membershipTypeId: req.params.id,
      expireDate: {
        [Op.gt]: `${today.toISOString().slice(0, 10)}`,
      },
    },
  })
    .then((member) => {
if (member < 1) {
  MembershipType.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((membershipType) => {
      console.log(membershipType);
      res.status(200).send({
        success: membershipType == 1 ? "true" : "false",
        data:
          membershipType == 1
            ? "Deleted Successfully"
            : "Delete Not Successful",
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Delete MembershipType",
        description: err.message,
      });
    });
} else {
  res.status(400).send({
    success: "false",
    message: "This membership type already in use. Cannot delete this type.",
  });
}
 
  })
  .catch((err) => {
      console.log(err);
    res.status(400).send({
      success: "false",
      message: "Error in Getting Member By ID",
      description: err.message,
    });
  });
};
