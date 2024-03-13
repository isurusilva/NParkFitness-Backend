const ServiceType = require("../model/serviceType.model");
const Branch = require("../model/branch.model");
const Membership = require("../model/membership.model");
const User = require("../model/user.model");
const MembershipType = require("../model/membershipType.model");
const Gym = require("../model/gym.model");
const { Sequelize, Op } = require("sequelize");
const admin = require("../config/firebase-config");

//Register a ServiceType | guest
exports.createServiceType = async (req, res) => {
  if (req.body) {
    console.log("Create serviceType");
    ServiceType.create(req.body)
      .then((serviceType) => {
        var payload = {
          notification: {
            title: "Added new service to branch",
            body: "Check new service details in branch",
          },
        };
        admin
          .messaging()
          .sendToTopic("BranchID" + serviceType.branchId, payload);
        res.send({
          success: "true",
          data: serviceType,
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Create ServiceType",
          description: err.message,
        });
      });
  }
};

//update ServiceType Details
exports.updateServiceType = async (req, res) => {
  if (req.body) {
    if (!req.params.id) return res.status(500).send("Id is missing");
    let id = req.params.id;
    ServiceType.update(req.body, {
      where: {
        id: id,
      },
    })
      .then((serviceType) => {
        res.status(200).send({
          success: serviceType[0] == 1 ? "true" : "false",
          data:
            serviceType[0] == 1
              ? "Updated Successfully"
              : "Update Not Successful",
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Update ServiceType",
          description: err.message,
        });
      });
  }
};

//get All ServiceType
exports.getAllServiceType = (req, res) => {
  console.log("get All");
  ServiceType.findAll()
    .then((serviceType) => {
      res.send({
        success: "true",
        data: serviceType,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting All ServiceType",
        description: err.message,
      });
    });
};

//get ServiceType By Id
exports.getServiceTypeById = (req, res) => {
  console.log("get All");
  ServiceType.findOne({
    where: {
      id: req.params.id,
    },
    include: {
      model: Branch,
    },
  })
    .then((serviceType) => {
      res.send({
        success: "true",
        data: serviceType,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting ServiceType By ID",
        description: err.message,
      });
    });
};

//get ServiceType By Branch Id
exports.getServiceTypeByBranchId = (req, res) => {
  console.log("get ServiceType By Branch Id");
  ServiceType.findAll({
    where: {
      branchId: req.params.id,
    },
    include: {
      model: Branch,
    },
  })
    .then((serviceType) => {
      res.send({
        success: "true",
        data: { serviceType: serviceType },
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting ServiceType By Branch ID",
        description: err.message,
      });
    });
};

//get ServiceTypes with UserId
exports.getServiceTypeByUserId = (req, res) => {
  console.log("get ServiceType By User Id");
  var serviceTypeArr = [];
  Membership.findAll({
    where: {
      userId: req.params.id,
    },
    attributes: ["branchId"],
  })
    .then(async (membership) => {
      console.log(membership);
      const promises = membership.map(async (element) => {
        // memberArray.push({ branchId: element.branchId })
        await ServiceType.findAll({
          where: {
            branchId: element.branchId,
          },
          include: {
            model: Branch,
          },
        })
          .then((serviceType) => {
            serviceTypeArr.push({ serviceType });
          })
          .catch((err) => {
            console.log(err);
            res.status(400).send({
              success: "false",
              message: "Error in Getting ServiceType By Branch ID",
              description: err.message,
            });
          });
      });
      await Promise.all(promises);
      console.log(serviceTypeArr);
      res.send({
        success: "true",
        data: { service: serviceTypeArr },
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

  //////
};

//delete ServiceType
exports.deleteServiceType = async (req, res) => {
  console.log("Delete serviceType");
  ServiceType.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((serviceType) => {
      console.log(serviceType);
      res.status(200).send({
        success: serviceType == 1 ? "true" : "false",
        data:
          serviceType == 1 ? "Deleted Successfully" : "Delete Not Successful",
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Delete ServiceType",
        description: err.message,
      });
    });
};
