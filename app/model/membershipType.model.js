const Sequelize = require("sequelize");

const db = require("../config/database");

var MembershipType = db.define(
    "membershipType",
    {
        type: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        description: {
            type: Sequelize.STRING,
            allowNull: false,
        },
        isActive: {
            type: Sequelize.BOOLEAN,
            allowNull: false,
          },
        amount: {
            type: Sequelize.DECIMAL(10, 2),
            allowNull: false,
        },
        periodInMonths: {
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


module.exports = MembershipType ;