require("dotenv").config({ path: "./.env" });
const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "OMS",
  "postgres",
  "Root",
  {
    host: "localhost",
    port: 5432,
    dialect: "postgres",
    logging: false, // Disable SQL query logging
  }
);

// Test connection
sequelize
  .authenticate()
  .then(() => {
    console.log("Connected to the database.");
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// Export Sequelize instance
module.exports = sequelize;
