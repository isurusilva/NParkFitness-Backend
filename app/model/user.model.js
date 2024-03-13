const Sequelize = require("sequelize");

const db = require("../config/database");

const Attendance = require("./attendance.model");
const BodyDetails = require("./bodyDetails.model");
const Branch = require("./branch.model");
const Gym = require("./gym.model");
const Membership = require("./membership.model");
const Payment = require("./payment.model");
const Goal = require("./goal.model");
const Schedule = require("./schedule.model");
const ScheduleItem = require("./scheduleItem.model");
const ServiceType = require("./serviceType.model");
const Subscription = require("./subscription.model");
const SubscriptionType = require("./subscriptionType.model");
const AttendItem = require("./attendItem.model");
const MembershipType = require("./membershipType.model");
const DietPlan = require("./dietPlan.model");
const MealItem = require("./mealItem.model");
const SubPayment = require("./subscriptionPayment.model");

var User = db.define(
  "user",
  {
    firstName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lastName: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    birthDay: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    email: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    contactNo: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    gender: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    // address: {
    //     type: Sequelize.STRING,
    //     allowNull: false,
    // },
    street: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lane: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    province: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    image: {
      type: Sequelize.STRING,
      // allowNull: false,
    },
    fireUID: {
      type: Sequelize.STRING,
      unique: true,
      allowNull: false,
    },
    height: {
      type: Sequelize.DECIMAL(10, 2),
    },
    branchId: {
      type: Sequelize.STRING,
      // allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    freezeTableName: true,
  }
);

User.hasMany(Gym, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
Gym.belongsTo(User, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
Gym.hasMany(Branch, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
Branch.belongsTo(Gym, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
// Branch.hasMany(User, { as: 'branchId', allowNull: true, defaultValue: null })
// User.hasOne(Branch,{as: 'branchId', allowNull: true, defaultValue: null })

// Branch.hasMany(User,{constraints: false , allowNull: true, defaultValue: null })
// User.belongsTo(Branch,{constraints: false})

Branch.hasMany(Membership, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
Membership.belongsTo(Branch, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});

// Branch.hasMany(MembershipType)
// MembershipType.belongsTo(Branch)

Gym.hasMany(MembershipType, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
MembershipType.belongsTo(Gym, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});

User.hasOne(Subscription, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
Subscription.belongsTo(User, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
SubscriptionType.hasMany(Subscription, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
Subscription.belongsTo(SubscriptionType, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
Branch.hasMany(ServiceType, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
ServiceType.belongsTo(Branch, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
/////
User.hasMany(BodyDetails, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
BodyDetails.belongsTo(User, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
User.hasMany(Membership, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
Membership.belongsTo(User, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
// Client.hasMany(BodyDetails)
// BodyDetails.belongsTo(Client)
// Client.hasMany(Membership)
// Membership.belongsTo(Client)
Membership.hasMany(Goal, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
Goal.belongsTo(Membership, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
Membership.hasMany(Payment, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
Payment.belongsTo(Membership, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
Membership.hasMany(Attendance, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
Attendance.belongsTo(Membership, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
Membership.hasMany(Schedule, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
Schedule.belongsTo(Membership, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
User.hasMany(Schedule, { as: "trainer", foreignKey: "trainerId" });
Schedule.belongsTo(User, { as: "trainer", foreignKey: "trainerId" });
Schedule.hasMany(ScheduleItem, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
ScheduleItem.belongsTo(Schedule, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
/////////
// Attendance.hasMany(ScheduleItem)
Attendance.hasMany(AttendItem, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
AttendItem.belongsTo(Attendance, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
ScheduleItem.hasMany(AttendItem, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
AttendItem.belongsTo(ScheduleItem, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
// ScheduleItem.belongsToMany(Attendance, { through: AttendItem })
//////////
ServiceType.hasMany(ScheduleItem, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
ScheduleItem.belongsTo(ServiceType, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
MembershipType.hasMany(Membership, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
Membership.belongsTo(MembershipType, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});

DietPlan.hasMany(MealItem, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
MealItem.belongsTo(DietPlan, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
User.hasMany(DietPlan, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
DietPlan.belongsTo(User, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});

User.hasMany(Membership, {
  as: "trainId",
  foreignKey: "trainerId",
  allowNull: true,
  defaultValue: null,
});
Membership.belongsTo(User, {
  as: "trainId",
  foreignKey: "trainerId",
  allowNull: true,
  defaultValue: null,
});

Branch.hasMany(Attendance, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
Attendance.belongsTo(Branch, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});

Subscription.hasMany(SubPayment, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});
SubPayment.belongsTo(Subscription, {
  onDelete: "cascade",
  foreignKey: { allowNull: false },
});

module.exports = User;
