const express = require("express");
const PaymentRouter = express.Router();
const PaymentController = require("../controller/payment.controller");

PaymentRouter.get("/", PaymentController.getAllPayment);
PaymentRouter.post("/", PaymentController.createPayment);
// PaymentRouter.post('/notifyPayment', PaymentController.notifyPayment);
PaymentRouter.get("/:id", PaymentController.getPaymentById);
PaymentRouter.get(
  "/getAllPaymentByMembershipId/:id",
  PaymentController.getAllPaymentByMembershipId
);
PaymentRouter.get(
  "/getAllPaymentByUserId/:id",
  PaymentController.getAllPaymentByUserId
);
PaymentRouter.get(
  "/getAllPaymentByMemberId/:id",
  PaymentController.getAllPaymentByMemberId
);
PaymentRouter.get(
  "/getAllPaymentGroupByOwner/:id",
  PaymentController.getAllPaymentGroupByOwner
);
PaymentRouter.put("/:id", PaymentController.updatePayment);
PaymentRouter.delete("/:id", PaymentController.deletePayment);
module.exports = PaymentRouter;
