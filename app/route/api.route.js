const express = require('express');
var app = express();
const ApiRouter = express.Router();
const User = require('./user.route');
const Gym = require('./gym.route');
const Branch = require('./branch.route');
const ServiceType = require('./serviceType.route');
const BodyDetails = require('./bodyDetails.route');
const Membership = require('./membership.route');
const MembershipType = require('./membershipType.route');
const AttendItem = require('./attendItem.route');
const Attendance = require('./attendance.route');
const Payment = require('./payment.route');
const Goal = require('./goal.route');
const Schedule = require('./schedule.route');
const ScheduleItem = require('./scheduleItem.route');
const SubscriptionType = require('./subscriptionType.route');
const Subscription = require('./subscription.route');
const SubscriptionPayment = require('./subscriptionPayment.route');
const DietPlan = require('./dietPlan.route');
const MealItem = require('./mealItem.route');
const Notification = require('./notification.route');
const Dashboard = require('./dashboard.route');
const Review = require('./review.route');


// module.exports = function (){
//     app.use("/user", User());
//     app.use("/gym", Gym());
//     app.use("/branch", Branch());
//     app.use("/serviceType", ServiceType());
//     app.use("/bodyDetails", BodyDetails());
//     app.use("/membership", Membership());
//     app.use("/attendItem", AttendItem());
//     app.use("/attendance", Attendance());
//     app.use("/payment", Payment());
//     app.use("/goal", Goal());
//     app.use("/schedule", Schedule());
//     app.use("/scheduleItem", ScheduleItem());
//     app.use("/subscriptionType", SubscriptionType());
//     app.use("/subscription", Subscription());
//     return app;
// }

ApiRouter.use("/user", User);
ApiRouter.use("/gym", Gym);
ApiRouter.use("/branch", Branch);
ApiRouter.use("/serviceType", ServiceType);
ApiRouter.use("/bodyDetails", BodyDetails);
ApiRouter.use("/membership", Membership);
ApiRouter.use("/membershipType", MembershipType);
ApiRouter.use("/attendItem", AttendItem);
ApiRouter.use("/attendance", Attendance);
ApiRouter.use("/payment", Payment);
ApiRouter.use("/goal", Goal);
ApiRouter.use("/schedule", Schedule);
ApiRouter.use("/scheduleItem", ScheduleItem);
ApiRouter.use("/subscriptionType", SubscriptionType);
ApiRouter.use("/subscription", Subscription);
ApiRouter.use("/dietPlan", DietPlan);
ApiRouter.use("/mealItem", MealItem);
ApiRouter.use("/subscriptionPayment", SubscriptionPayment);
ApiRouter.use("/notification", Notification);
ApiRouter.use("/dashboard", Dashboard);
ApiRouter.use("/review", Review);



module.exports = ApiRouter;