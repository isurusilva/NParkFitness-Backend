const Sequelize = require("sequelize");

const db = require("../config/database");

var Gym = db.define(
    "gym",
    {
        name: {
            type: Sequelize.STRING,
            allowNull: false,
            unique: true
        }
    },
    {
        timestamps: true,
        createdAt: "CreatedAt",
        updatedAt: "UpdatedAt",
        freezeTableName: true,
    }
);


module.exports = Gym ;