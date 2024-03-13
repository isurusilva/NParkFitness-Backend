const express = require('express');
const MealItemRouter = express.Router();
const MealItemController = require('../controller/mealItem.controller');


MealItemRouter.get('/', MealItemController.getAllMealItem);
MealItemRouter.post('/', MealItemController.createMealItem);
MealItemRouter.get('/:id', MealItemController.getMealItemById);
MealItemRouter.put('/:id', MealItemController.updateMealItem);
MealItemRouter.delete('/:id', MealItemController.deleteMealItem);
module.exports = MealItemRouter;
