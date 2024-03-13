const Sequelize = require("sequelize");

const db = require("../config/database");

var Attendance = db.define(
    "attendance",
    {
        date: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        isTrue: {
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


module.exports = Attendance ;