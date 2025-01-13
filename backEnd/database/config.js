// require("dotenv").config({ path: "./env" });
// const { Sequelize } = require("sequelize");

// // Database credentials from environment variables
// const DB_NAME = process.env.DB_NAME || "OMS"; // Default to OMS if not found in .env
// const DB_USER = process.env.DB_USER || "postgres"; // Default to postgres if not found in .env
// const DB_PASS = process.env.DB_PASS || "Root"; // Default to Root if not found in .env
// const DB_HOST = process.env.DB_HOST || "localhost"; // Default to localhost if not found in .env
// const DB_DIALECT = process.env.DB_DIALECT || "postgres"; // Default to postgres dialect
// const DB_PORT = process.env.DB_PORT || 5432; // Default to 5432 for PostgreSQL

// // Initialize Sequelize with the database credentials
// const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
//   host: DB_HOST,
//   port: DB_PORT,
//   dialect: DB_DIALECT,
//   logging: false, // Disables logging of SQL queries
// });

// // Authenticate the connection to the database
// sequelize
//   .authenticate()
//   .then(() => {
//     console.log("Authenticated to database...");
//   })
//   .catch((error) => {
//     console.error("Error authenticating to the database:", error);
//   });

// // Import models
// const Models = require("../models")(sequelize, Sequelize);

// const { User, Order, OrderDetails, Product, Category, Cart } = Models;


// // Create an object to hold the sequelize instance and models
// const db = {};

// // Define associations between models
// User.hasMany(Order, { foreignKey: 'userId' });
// Order.belongsTo(User, { foreignKey: 'userId' });

// Order.hasMany(OrderDetails, { foreignKey: 'orderId' });
// OrderDetails.belongsTo(Order, { foreignKey: 'orderId' });

// Product.hasMany(OrderDetails, { foreignKey: 'productId' });
// OrderDetails.belongsTo(Product, { foreignKey: 'productId' });

// Category.hasMany(Product, { foreignKey: 'categoryId' });
// Product.belongsTo(Category, { foreignKey: 'categoryId' });

// User.hasMany(Cart, { foreignKey: 'userId' });
// Cart.belongsTo(User, { foreignKey: 'userId' });

// Product.hasMany(Cart, { foreignKey: 'productId' });
// Cart.belongsTo(Product, { foreignKey: 'productId' });

// // Export the Sequelize instance, models, and associations
// db.sequelize = sequelize;
// db.Sequelize = Sequelize;
// db.User = Models.User;
// db.Product = Models.Product;
// db.Order = Models.Order;
// db.OrderItem = Models.OrderItem;
// db.Category = Models.Category;

// module.exports = db;


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
