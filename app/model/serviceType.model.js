const Sequelize = require("sequelize");

const db = require("../config/database");

var ServiceType = db.define(
    "service",
    {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        status: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        bodyPart: {
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


module.exports = ServiceType ;