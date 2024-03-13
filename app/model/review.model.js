const Sequelize = require("sequelize");

const db = require("../config/database");

var Review = db.define(
    "review",
    {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        comment: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        rating: {
            type: Sequelize.INTEGER,
            allowNull: false,
        },
        userId: {
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


module.exports = Review ;