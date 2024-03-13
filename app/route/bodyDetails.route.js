const express = require('express');
const BodyDetailsRouter = express.Router();
const BodyDetailsController = require('../controller/bodyDetails.controller');


BodyDetailsRouter.get('/', BodyDetailsController.getAllBodyDetails);
BodyDetailsRouter.get('/getBodyDetailsByUserId/:id', BodyDetailsController.getBodyDetailsByUserId);
BodyDetailsRouter.get('/getLatestBodyDetailsByMemberId/:id', BodyDetailsController.getLatestBodyDetailsByMemberId);
BodyDetailsRouter.post('/', BodyDetailsController.createBodyDetails);
BodyDetailsRouter.get('/:id', BodyDetailsController.getBodyDetailsById);
BodyDetailsRouter.put('/:id', BodyDetailsController.updateBodyDetails);
BodyDetailsRouter.delete('/:id', BodyDetailsController.deleteBodyDetails);
module.exports = BodyDetailsRouter;
