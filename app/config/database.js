const Sequelize = require("sequelize");

// Order is 'database', 'username', 'password'
db = new Sequelize("gymapp", "admin", "Wasd#2731", {
  host: "database-2.clwjrzzurrw6.us-east-2.rds.amazonaws.com",
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
