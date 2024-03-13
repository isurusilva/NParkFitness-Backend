const Review = require("../model/review.model");
const Membership = require("../model/membership.model");

//Register a Review | guest
exports.createReview = async (req, res) => {
  if (req.body) {
    console.log("Create review");
    Review.create(req.body)
      .then((review) => {
        res.send({
          success: "true",
          data: review,
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Create Review",
          description: err.message,
        });
      });
  }
};

//update Review Details
exports.updateReview = async (req, res) => {
  if (req.body) {
    if (!req.params.id) return res.status(500).send("Id is missing");
    let id = req.params.id;
    Review.update(req.body, {
      where: {
        id: id,
      },
    })
      .then((review) => {
        res.status(200).send({
          success: review[0] == 1 ? "true" : "false",
          data:
            review[0] == 1 ? "Updated Successfully" : "Update Not Successful",
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Update Review",
          description: err.message,
        });
      });
  }
};

//get All Review
exports.getAllReview = (req, res) => {
  console.log("get All");
  Review.findAll({
    order: [["CreatedAt", "DESC"]],
    limit: 10
  })
    .then((review) => {
      res.send({
        success: "true",
        data: review,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting All Review",
        description: err.message,
      });
    });
};

//get Review By Id
exports.getReviewById = (req, res) => {
  console.log("get All");
  Review.findOne({
    where: {
      id: req.params.id,
    },
  })
    .then((review) => {
      res.send({
        success: "true",
        data: review,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting Review By ID",
        description: err.message,
      });
    });
};

//get Review By userId
exports.getReviewByUserId = (req, res) => {
    console.log("get All");
    Review.findAll({
      where: {
        userId: req.params.id,
      },
      order: [["CreatedAt", "DESC"]],
    })
      .then((review) => {
        res.send({
          success: "true",
          data: review,
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Getting Review By ID",
          description: err.message,
        });
      });
  };

//delete Review
exports.deleteReview = async (req, res) => {
  console.log("Delete review");
  Review.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((review) => {
      console.log(review);
      res.status(200).send({
        success: review == 1 ? "true" : "false",
        data: review == 1 ? "Deleted Successfully" : "Delete Not Successful",
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Delete Review",
        description: err.message,
      });
    });
};
