const Sequelize = require("sequelize");

const db = require("../config/database");

var Goal = db.define(
    "goal",
    {
        description: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        heightTarget: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
        },
        weightTarget: {
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


module.exports = Goal ;