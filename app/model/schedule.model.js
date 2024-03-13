const Sequelize = require("sequelize");

const db = require("../config/database");

var Schedule = db.define(
    "schedule",
    {
        expireDate: {
            type: Sequelize.STRING,
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


module.exports = Schedule ;