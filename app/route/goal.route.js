const express = require('express');
const GoalRouter = express.Router();
const GoalController = require('../controller/goal.controller');


GoalRouter.get('/', GoalController.getAllGoal);
GoalRouter.get('/getGoalByMemberId/:id', GoalController.getGoalByMemberId);
GoalRouter.post('/', GoalController.createGoal);
GoalRouter.get('/:id', GoalController.getGoalById);
GoalRouter.put('/:id', GoalController.updateGoal);
GoalRouter.delete('/:id', GoalController.deleteGoal);
module.exports = GoalRouter;
