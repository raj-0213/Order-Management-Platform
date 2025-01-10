const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Order = sequelize.define(
    'Order',
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
      status: {
        type: DataTypes.ENUM('pending', 'confirmed', 'shipped', 'delivered'),
        defaultValue: 'pending',
        validate: {
          isIn: {
            args: [['pending', 'confirmed', 'shipped', 'delivered']],
            msg: "Status must be one of 'pending', 'confirmed', 'shipped', or 'delivered'",
          },
        },
      },
      totalAmount: {
        type: DataTypes.FLOAT,
        allowNull: false,
        validate: {
          isFloat: {
            msg: "Total amount must be a valid number",
          },
          min: 0.01, // Total amount should be greater than 0
        },
      },
    },
    {
      tableName: 'orders',  // Optional: Set the table name explicitly
      timestamps: true,     // Optional: Enable timestamps to track created and updated times
    }
  );

  return Order;
};
