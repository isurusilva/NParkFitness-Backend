const Sequelize = require("sequelize");

const db = require("../config/database");

var BodyDetails = db.define(
    "bodyDetails",
    {
        date: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        weight: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
        },
        height: {
            type: Sequelize.DECIMAL(10, 2),
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


module.exports = BodyDetails ;