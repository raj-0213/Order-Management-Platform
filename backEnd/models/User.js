const { DataTypes } = require('sequelize');

module.exports = (sequelize, Sequelize) => {
  const User = sequelize.define(
    'User',
    {
      id: {
        type: DataTypes.INTEGER,
        autoIncrement: true,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          customValidator(value) {
            if (!value || value.trim() === '') throw new Error("Username cannot be empty");
          },
        },
      },
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          isEmail: {
            msg: "Invalid email format",
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      role: {
        type: DataTypes.ENUM('admin', 'customer'),
        allowNull: false,
        defaultValue: 'customer',
      },
      mobileNo: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          is: {
            args: /^[0-9]{10}$/, // Assuming a 10-digit mobile number
            msg: "Mobile number must be 10 digits",
          },
        },
      },
      dob: {
        type: DataTypes.DATEONLY, // To store the date only (no time component)
        allowNull: false,
        validate: {
          isDate: {
            msg: "Invalid date of birth format",
          },
        },
      },
      address: {
        type: DataTypes.STRING,
        allowNull: false, // Address is optional
        validate: {
          len: {
            args: [10, 255], // Address length validation (minimum 10 characters)
            msg: "Address should be between 10 to 255 characters long",
          },
        },
      },
    },
    {
      tableName: 'users',  // Optional: You can specify the table name explicitly here
      timestamps: false,   // If you don't want Sequelize to automatically add createdAt and updatedAt
    }
  );

  return User;
};
