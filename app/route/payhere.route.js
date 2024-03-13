const express = require('express');
const SubPaymentController = require('../controller/subscriptionPayment.controller');
const PayHereRouter = express.Router();


// AuthRouter.get('/', UserController.getAllUser);
// AuthRouter.post('/', UserController.createUser);
// AuthRouter.put('/:id', UserController.updateUser);
PayHereRouter.post('/notify', SubPaymentController.notifyPayment);
PayHereRouter.post('/webhook', SubPaymentController.notifyStripePayment);
PayHereRouter.post('/create-payment-intent', SubPaymentController.createPaymentIntent);
PayHereRouter.post('/createStripeSession', SubPaymentController.createStripeSession);

module.exports = PayHereRouter;