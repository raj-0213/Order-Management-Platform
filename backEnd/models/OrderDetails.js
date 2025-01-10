const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const OrderDetails = sequelize.define(
    'OrderDetails',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      orderId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Order ID must be an integer",
          },
          min: 1,  // Ensure the order ID is a positive number
        },
      },
      productId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Product ID must be an integer",
          },
          min: 1,  // Ensure the product ID is a positive number
        },
      },
      quantity: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "Quantity must be a valid integer",
          },
          min: 1, // Ensure the quantity is at least 1
        },
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: {
            msg: "Price must be a valid number",
          },
          min: 0.01,  // Price should be greater than 0
        },
      },
    },
    {
      tableName: 'order_details',  // Optional: Set the table name explicitly
      timestamps: false,           // Optional: Disable automatic timestamp fields
    }
  );

  return OrderDetails;
};
