const Sequelize = require("sequelize");

const db = require("../config/database");

var Membership = db.define(
    "membership",
    {
        expireDate: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        trainerNeeded: {
            type: Sequelize.BOOLEAN,
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


module.exports = Membership ;