const Sequelize = require("sequelize");

const db = require("../config/database");

var SubPayment = db.define(
    "subPayment",
    {
        date: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        amount: {
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


module.exports = SubPayment ;