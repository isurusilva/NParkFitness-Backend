const Sequelize = require("sequelize");

const db = require("../config/database");

var MealItem = db.define(
    "mealItem",
    {
        foodName: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        foodType: {                         // Food or Drink
            type: Sequelize.STRING,
            allowNull: false,
        },
        amount: {
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


module.exports = MealItem ;