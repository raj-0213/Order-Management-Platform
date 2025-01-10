const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Cart = sequelize.define(
    'Cart',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          isInt: {
            msg: "User ID must be an integer",
          },
          min: 1,  // Ensure the user ID is a positive number
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
        defaultValue: 1,
        validate: {
          isInt: {
            msg: "Quantity must be a valid integer",
          },
          min: 1, // Quantity must be at least 1
        },
      },
    },
    {
      tableName: 'carts',  // Optional: Explicitly set the table name
      timestamps: false,   // Optional: Disable automatic timestamp fields
    }
  );

  return Cart;
};
