const Sequelize = require("sequelize");

const db = require("../config/database");

var DietPlan = db.define(
    "dietPlan",
    {
        mealType: {
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


module.exports = DietPlan ;