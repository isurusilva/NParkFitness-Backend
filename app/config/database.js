const Sequelize = require("sequelize");

// Order is 'database', 'username', 'password'
db = new Sequelize("", "", "", {
  host: "",
  port: 3306,
  dialect: "mysql",
  ssl: 'Amazon RDS',
  dialectOptions: {
    connectTimeout: 60000
  },
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

module.exports = db;
