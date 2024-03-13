const Sequelize = require("sequelize");

const db = require("../config/database");

var Subscription = db.define(
    "subscription",
    {
        expireDate: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        isActive: {
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


module.exports = Subscription ;