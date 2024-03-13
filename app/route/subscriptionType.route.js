const express = require('express');
const SubscriptionType = express.Router();
const SubscriptionTypeController = require('../controller/subscriptionType.controller');


SubscriptionType.get('/', SubscriptionTypeController.getAllSubscriptionType);
SubscriptionType.post('/', SubscriptionTypeController.createSubscriptionType);
SubscriptionType.get('/:id', SubscriptionTypeController.getSubscriptionTypeById);
SubscriptionType.put('/:id', SubscriptionTypeController.updateSubscriptionType);
SubscriptionType.delete('/:id', SubscriptionTypeController.deleteSubscriptionType);
module.exports = SubscriptionType;
