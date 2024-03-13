const Sequelize = require("sequelize");

const db = require("../config/database");

var SubscriptionType = db.define(
  "subscriptionType",
  {
    type: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    description: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    amount: {
      type: Sequelize.DECIMAL(10, 2),
      allowNull: false,
    },
    gymCount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    branchCount: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    isCalAvailable: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    isDietAvailable: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    }
  },
  {
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    freezeTableName: true,
  }
);

module.exports = SubscriptionType;
