const Sequelize = require("sequelize");

const db = require("../config/database");

var AttendItem = db.define(
    "attendItem",
    {
        donePercentage: {
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


module.exports = AttendItem ;