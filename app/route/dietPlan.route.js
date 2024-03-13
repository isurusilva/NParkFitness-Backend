const express = require('express');
const DietPlanRouter = express.Router();
const DietPlanController = require('../controller/dietPlan.controller');


DietPlanRouter.get('/', DietPlanController.getAllDietPlan);
DietPlanRouter.post('/', DietPlanController.createDietPlan);
DietPlanRouter.get('/:id', DietPlanController.getDietPlanById);
DietPlanRouter.post('/createDietAndMealItem', DietPlanController.createDietAndMealItem);
DietPlanRouter.get('/getDietPlanAndMealByUserId/:id', DietPlanController.getDietPlanAndMealByUserId);
DietPlanRouter.get('/getDietPlanAndMealByMemberId/:id', DietPlanController.getDietPlanAndMealByMemberId);
DietPlanRouter.get('/getCalorieConsumeAndBurnByMemberId/:id', DietPlanController.getCalorieConsumeAndBurnByMemberId);
DietPlanRouter.put('/:id', DietPlanController.updateDietPlan);
DietPlanRouter.delete('/:id', DietPlanController.deleteDietPlan);
module.exports = DietPlanRouter;
