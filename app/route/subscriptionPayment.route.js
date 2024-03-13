const express = require('express');
const SubscriptionPaymentRouter = express.Router();
const SubscriptionPaymentController = require('../controller/subscriptionPayment.controller');

SubscriptionPaymentRouter.get('/', SubscriptionPaymentController.getAllSubscriptionPayment);
SubscriptionPaymentRouter.post('/', SubscriptionPaymentController.createSubscriptionPayment);
SubscriptionPaymentRouter.get('/:id', SubscriptionPaymentController.getSubscriptionPaymentById);
SubscriptionPaymentRouter.get('/getSubscriptionPaymentByUserId/:id', SubscriptionPaymentController.getSubscriptionPaymentByUserId);
SubscriptionPaymentRouter.put('/:id', SubscriptionPaymentController.updateSubscriptionPayment);
SubscriptionPaymentRouter.delete('/:id', SubscriptionPaymentController.deleteSubscriptionPayment);
module.exports = SubscriptionPaymentRouter;
