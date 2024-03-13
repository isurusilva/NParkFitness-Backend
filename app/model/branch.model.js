const Sequelize = require("sequelize");

const db = require("../config/database");

var Branch = db.define(
  "branch",
  {
    name: {
      type: Sequelize.STRING,
      allowNull: false,
      unique: true,
    },
    isActive: {
      type: Sequelize.BOOLEAN,
      allowNull: false,
    },
    // address: {
    //     type: Sequelize.STRING,
    //     allowNull: false,
    // }
    street: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    lane: {
      type: Sequelize.STRING,
      allowNull: true,
    },
    city: {
      type: Sequelize.STRING,
      allowNull: false,
    },
    province: {
      type: Sequelize.STRING,
      allowNull: false,
    },
  },
  {
    timestamps: true,
    createdAt: "CreatedAt",
    updatedAt: "UpdatedAt",
    freezeTableName: true,
  }
);

module.exports = Branch;
