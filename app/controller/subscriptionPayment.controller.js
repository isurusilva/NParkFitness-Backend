const Gym = require("../model/gym.model");
const SubscriptionPayment = require("../model/subscriptionPayment.model");
const Subscription = require("../model/subscription.model");
const SubscriptionType = require("../model/subscriptionType.model");
const User = require("../model/user.model");
const { Op } = require("sequelize");
var md5 = require("md5");
const stripe = require("stripe")(
  "sk_test_51L19WVJhj4XbjMCU0sLhTSnDxvUVn2fhHAcs39tTwRX1LN51Nv3LgEZrmFlu9eRZkBJZ2AUB8VwVCnqn3KRd3XE100OSqGqVmz",
  {
    apiVersion: "2020-08-27",
    appInfo: {
      // For sample support and debugging, not required for production:
      name: "stripe-samples/accept-a-payment/custom-payment-flow",
      version: "0.0.2",
      url: "https://github.com/stripe-samples",
    },
  }
);

//RCreate Stripe Payment Intent
exports.createPaymentIntent = async (req, res) => {
  const {
    paymentMethodType,
    currency,
    paymentMethodOptions,
    amount,
    description,
  } = req.body;

  // Each payment method type has support for different currencies. In order to
  // support many payment method types and several currencies, this server
  // endpoint accepts both the payment method type and the currency as
  // parameters.
  //
  // Some example payment method types include `card`, `ideal`, and `alipay`.
  const params = {
    payment_method_types: [paymentMethodType],
    payment_method_options: [paymentMethodOptions],
    description: description,
    amount: amount,
    currency: currency,
  };

  // If this is for an ACSS payment, we add payment_method_options to create
  // the Mandate.
  if (paymentMethodType === "acss_debit") {
    params.payment_method_options = {
      acss_debit: {
        mandate_options: {
          payment_schedule: "sporadic",
          transaction_type: "personal",
        },
      },
    };
  } else if (paymentMethodType === "konbini") {
    /**
     * Default value of the payment_method_options
     */
    params.payment_method_options = {
      konbini: {
        product_description: "Tシャツ",
        expires_after_days: 3,
      },
    };
  } else if (paymentMethodType === "customer_balance") {
    params.payment_method_data = {
      type: "customer_balance",
    };
    params.confirm = true;
    params.customer =
      req.body.customerId ||
      (await stripe.customers.create().then((data) => data.id));
  }

  /**
   * If API given this data, we can overwride it
   */
  if (paymentMethodOptions) {
    params.payment_method_options = paymentMethodOptions;
  }

  // Create a PaymentIntent with the amount, currency, and a payment method type.
  //
  // See the documentation [0] for the full list of supported parameters.
  //
  // [0] https://stripe.com/docs/api/payment_intents/create
  try {
    const paymentIntent = await stripe.paymentIntents.create(params);

    // Send publishable key and PaymentIntent details to client
    console.log(paymentIntent);
    res.status(200).send({
      success: "true",
      data: paymentIntent,
    });
  } catch (e) {
    console.log(e.message);
    return res.status(400).send({
      success: "false",
      message: "Error in Create Payment",
      description: e.message,
    });
  }
};

//Register a SubscriptionPayment | guest
exports.createSubscriptionPayment = async (req, res) => {
  if (req.body) {
    console.log("Create subscriptionPayment");
    SubscriptionPayment.create(req.body)
      .then((subscriptionPayment) => {
        res.send({
          success: "true",
          data: subscriptionPayment,
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Create SubscriptionPayment",
          description: err.message,
        });
      });
  }
};

//update SubscriptionPayment Details
exports.updateSubscriptionPayment = async (req, res) => {
  if (req.body) {
    if (!req.params.id) return res.status(500).send("Id is missing");
    let id = req.params.id;
    SubscriptionPayment.update(req.body, {
      where: {
        id: id,
      },
    })
      .then((subscriptionPayment) => {
        res.status(200).send({
          success: subscriptionPayment[0] == 1 ? "true" : "false",
          data:
            subscriptionPayment[0] == 1
              ? "Updated Successfully"
              : "Update Not Successful",
        });
      })
      .catch((err) => {
        res.status(400).send({
          success: "false",
          message: "Error in Update SubscriptionPayment",
          description: err.message,
        });
      });
  }
};

//get All SubscriptionPayment
exports.getAllSubscriptionPayment = (req, res) => {
  console.log("get All");
  SubscriptionPayment.findAll()
    .then((subscriptionPayment) => {
      res.send({
        success: "true",
        data: subscriptionPayment,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting All SubscriptionPayment",
        description: err.message,
      });
    });
};

//get SubscriptionPayment By Id
exports.getSubscriptionPaymentById = (req, res) => {
  console.log("get All");
  SubscriptionPayment.findOne({
    where: {
      id: req.params.id,
    },
    include: [
      {
        model: Subscription,
        include: {
          model: SubscriptionType,
        },
      },
    ],
  })
    .then((subscriptionPayment) => {
      res.send({
        success: "true",
        data: subscriptionPayment,
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting SubscriptionPayment By ID",
        description: err.message,
      });
    });
};

//get SubscriptionPayment By UserId
exports.getSubscriptionPaymentByUserId = (req, res) => {
  console.log("get All");

  var subscriptionIdArr = [];

  Subscription.findAll({
    where: {
      userId: req.params.id,
    },
  })
    .then(async (user) => {
      await user.map((element) => {
        subscriptionIdArr.push({ subscriptionId: element.id });
      });
      console.log(subscriptionIdArr);

      SubscriptionPayment.findAll({
        where: {
          [Op.or]: subscriptionIdArr,
        },
        include: [
          {
            model: Subscription,
            include: [
              {
                model: SubscriptionType,
              },
              {
                model: User,
              },
            ],
          },
        ],
        order: [["date", "DESC"]],
      })
        .then((payment) => {
          res.send({
            success: "true",
            data: { payment: payment },
          });
        })
        .catch((err) => {
          res.status(400).send({
            success: "false",
            message: "Error in Getting Subscription Payment By ID",
            description: err.message,
          });
        });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Getting Subscription By userId",
        description: err.message,
      });
    });
};

// create stripe session
exports.createStripeSession = async (req, res) => {
  try {
    const session = await stripe.checkout.sessions.create({
      metadata: req.body.metadata,
      success_url: req.body.success_url,
      cancel_url: req.body.cancel_url,
      line_items: [req.body.line_items],
      mode: "payment",
    });

    res.status(200).send({
      success: "true",
      data: session,
    });
  } catch (error) {
    res.status(400).send({
      success: "false",
      message: "Error in Creating Session",
      description: error.message,
    });
  }
};

//listen to Stripe notification
exports.notifyStripePayment = (req, res) => {
  let data, eventType;
  console.log(
    "544444444444444444444444444444444444444444444444444444444444444"
  );
  console.log(req.body);
  // console.log(req.body.data.object.metadata.userId);
  console.log(
    "544444444444444444444444444444444444444444444444444444444444444"
  );

  // Check if webhook signing is configured.
  if (process.env.STRIPE_WEBHOOK_SECRET) {
    // Retrieve the event by verifying the signature using the raw body and secret.
    let event;
    let signature = req.headers["stripe-signature"];
    try {
      event = stripe.webhooks.constructEvent(
        req.rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );
    } catch (err) {
      console.log(`⚠️  Webhook signature verification failed.`);
      return res.sendStatus(400);
    }
    data = event.data;
    eventType = event.type;
  } else {
    // Webhook signing is recommended, but if the secret is not configured in `config.js`,
    // we can retrieve the event data directly from the request body.
    data = req.body.data;
    eventType = req.body.type;
    // userType = req.body.data.object.description;
  }

  if (eventType === "checkout.session.completed") {
    console.log("💰 Payment Done by Owner");

    Subscription.findOne({
      where: {
        userId: req.body.data.object.metadata.userId,
      },
      order: [["createdAt", "DESC"]],
    })
      .then((subscription) => {
        console.log("Create subscriptionPayment");
        console.log(subscription);
        var body = {
          date: new Date().toISOString().slice(0, 10),
          amount: req.body.data.object.amount_total / 100,
          subscriptionId: subscription.id,
        };
        SubscriptionPayment.create(body)
          .then((subscriptionPayment) => {
            console.log(subscriptionPayment);
            var dt = new Date();
            dt.setMonth(dt.getMonth() + 1);
            var updateBody = {
              expireDate: dt.toISOString().slice(0, 10),
              isActive: true,
            };
            Subscription.update(updateBody, {
              where: {
                id: subscription.id,
              },
            })
              .then((subscription) => {
                res.status(200).send({
                  success: subscription[0] == 1 ? "true" : "false",
                  data:
                    subscription[0] == 1
                      ? "Updated Successfully"
                      : "Update Not Successful",
                });
              })
              .catch((err) => {
                res.status(400).send({
                  success: "false",
                  message: "Error in Update Subscription",
                  description: err.message,
                });
              });
          })
          .catch((err) => {
            console.log("payment failed2");

            res.status(400).send({
              success: "false",
              message: "Error in Create SubscriptionPayment",
              description: err.message,
            });
          });
      })
      .catch((err) => {
        console.log("payment failed3");

        res.status(400).send({
          success: "false",
          message: "Error in Getting Subscription By UserID",
          description: err.message,
        });
      });
  } else if (eventType === "payment_intent.succeeded") {
    // Funds have been captured
    // Fulfill any orders, e-mail receipts, etc
    // To cancel the payment after capture you will need to issue a Refund (https://stripe.com/docs/api/refunds)
    console.log("💰 Payment captured!");
  } else if (eventType === "payment_intent.payment_failed") {
    console.log("❌ Payment failed.");
  }
  // res.sendStatus(200);
};

//listen to payHere notification
exports.notifyPayment = (req, res) => {
  console.log("notify Payhere Payment");
  console.log(req.body);
  console.log(`Payhere Notify ${JSON.stringify(req.body)}`);

  var merchant_id = req.body.merchant_id;
  var order_id = req.body.order_id;
  var payhere_amount = req.body.payhere_amount;
  var payhere_currency = req.body.payhere_currency;
  var status_code = req.body.status_code;
  var md5sig = req.body.md5sig;
  if (req.body.custom_1 == null || req.body.custom_1 == "") {
    console.log("payment failed1");
    return res.sendStatus(404);
  }
  var custom_1 = JSON.parse(req.body.custom_1);
  var merchant_secret = "49WUiSiKwSJ49Y1t6KwI414q7ylFFVse28RmB4FEIIvn"; // Replace with your Merchant Secret (Can be found on your PayHere account's Settings page)
  var local_md5sig = md5(
    merchant_id +
      order_id +
      payhere_amount +
      payhere_currency +
      status_code +
      md5(merchant_secret).toUpperCase()
  ).toUpperCase();
  switch (status_code) {
    case 2:
      console.log("payment success");
      break;
    case 0:
      console.log("payment pending");
      break;
    case -1:
      console.log("payment cancel");
      break;
    case -2:
      console.log("payment failed");
      break;
    case -3:
      console.log("payment charged back");
      break;

    default:
      console.log("payment known");
      break;
  }
  if (local_md5sig === md5sig || status_code == 2) {
    console.log(`Payment Details ${JSON.stringify(custom_1)}`);
    Subscription.findOne({
      where: {
        userId: req.body.custom_1,
      },
      order: [["createdAt", "DESC"]],
    })
      .then((subscription) => {
        console.log("Create subscriptionPayment");
        console.log(subscription);
        var body = {
          date: new Date().toISOString().slice(0, 10),
          amount: payhere_amount,
          subscriptionId: subscription.id,
        };
        SubscriptionPayment.create(body)
          .then((subscriptionPayment) => {
            console.log(subscriptionPayment);
            var dt = new Date();
            dt.setMonth(dt.getMonth() + 1);
            var updateBody = {
              expireDate: dt.toISOString().slice(0, 10),
            };
            Subscription.update(updateBody, {
              where: {
                id: subscription.id,
              },
            })
              .then((subscription) => {
                res.status(200).send({
                  success: subscription[0] == 1 ? "true" : "false",
                  data:
                    subscription[0] == 1
                      ? "Updated Successfully"
                      : "Update Not Successful",
                });
              })
              .catch((err) => {
                res.status(400).send({
                  success: "false",
                  message: "Error in Update Subscription",
                  description: err.message,
                });
              });
          })
          .catch((err) => {
            console.log("payment failed2");

            res.status(400).send({
              success: "false",
              message: "Error in Create SubscriptionPayment",
              description: err.message,
            });
          });
      })
      .catch((err) => {
        console.log("payment failed3");

        res.status(400).send({
          success: "false",
          message: "Error in Getting Subscription By UserID",
          description: err.message,
        });
      });
  } else {
    console.log("payment failed4");
    res.sendStatus(403);
  }
};

//get All Gym Owners with SubscriptionPayment
// exports.getAllGymOwnersWithSubscriptionPayment = (req, res) => {
//   console.log("get All 2354");
//   User.findAll({
//     where: {
//       type: "Owner",
//     },
//     include: [
//       {
//         model: Subscription,
//         include: {
//           model: SubscriptionType,
//         },
//       },
//     ],
//   })
//     .then((user) => {
//       res.send({
//         success: "true",
//         data: user,
//       });
//     })
//     .catch((err) => {
//       res.status(400).send({
//         success: "false",
//         message: "Error in Getting All User",
//         description: err.message,
//       });
//     });
// };

//delete SubscriptionPayment
exports.deleteSubscriptionPayment = async (req, res) => {
  console.log("Delete subscriptionPayment");
  SubscriptionPayment.destroy({
    where: {
      id: req.params.id,
    },
  })
    .then((subscriptionPayment) => {
      console.log(subscriptionPayment);
      res.status(200).send({
        success: subscriptionPayment == 1 ? "true" : "false",
        data:
          subscriptionPayment == 1
            ? "Deleted Successfully"
            : "Delete Not Successful",
      });
    })
    .catch((err) => {
      res.status(400).send({
        success: "false",
        message: "Error in Delete SubscriptionPayment",
        description: err.message,
      });
    });
};
