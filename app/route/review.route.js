const express = require('express');
const ReviewRouter = express.Router();
const ReviewController = require('../controller/review.controller');


ReviewRouter.get('/', ReviewController.getAllReview);
ReviewRouter.post('/', ReviewController.createReview);
ReviewRouter.get('/:id', ReviewController.getReviewById);
ReviewRouter.get('/getReviewByUserId/:id', ReviewController.getReviewByUserId);
ReviewRouter.put('/:id', ReviewController.updateReview);
ReviewRouter.delete('/:id', ReviewController.deleteReview);
module.exports = ReviewRouter;
