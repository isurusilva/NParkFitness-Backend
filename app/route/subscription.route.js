const express = require('express');
const SubscriptionRouter = express.Router();
const SubscriptionController = require('../controller/subscription.controller');

SubscriptionRouter.get('/', SubscriptionController.getAllSubscription);
SubscriptionRouter.post('/', SubscriptionController.createSubscription);
SubscriptionRouter.get('/getSubscriptionByUserId/:id', SubscriptionController.getSubscriptionByUserId);
SubscriptionRouter.get('/:id', SubscriptionController.getSubscriptionById);
SubscriptionRouter.get('/getAllGymOwnersWithSubscription/:id', SubscriptionController.getAllGymOwnersWithSubscription);
SubscriptionRouter.put('/:id', SubscriptionController.updateSubscription);
SubscriptionRouter.put('/RenewSubscription/:id', SubscriptionController.RenewSubscription);
SubscriptionRouter.delete('/:id', SubscriptionController.deleteSubscription);
module.exports = SubscriptionRouter;
