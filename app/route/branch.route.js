const express = require('express');
const BranchRouter = express.Router();
const BranchController = require('../controller/branch.controller');


BranchRouter.get('/', BranchController.getAllBranch);
BranchRouter.post('/', BranchController.createBranch);
BranchRouter.get('/:id', BranchController.getBranchById);
BranchRouter.get('/getBranchByGymId/:id', BranchController.getBranchByGymId);
BranchRouter.get('/getBranchCountByGymId/:id',BranchController.getBranchCountByGymId);
BranchRouter.put('/:id', BranchController.updateBranch);
BranchRouter.delete('/:id', BranchController.deleteBranch);
module.exports = BranchRouter;
