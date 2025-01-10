const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const Category = sequelize.define(
    'Category',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notEmpty: {
            msg: "Category name cannot be empty",
          },
          len: {
            args: [3, 100], // Validates that the name length is between 3 and 100 characters
            msg: "Category name must be between 3 and 100 characters",
          },
        },
      },
    },
    {
      tableName: 'categories', // Optional: Explicitly set the table name
      timestamps: false,       // Optional: Disable automatic timestamp fields
    }
  );

  return Category;
};
