const Sequelize = require("sequelize");

const db = require("../config/database");

var ScheduleItem = db.define(
    "scheduleItem",
    {
        noOfSet: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        noOfRepetition: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        timeBySeconds: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        calAmount: {
            type: Sequelize.INTEGER,
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


module.exports = ScheduleItem ;