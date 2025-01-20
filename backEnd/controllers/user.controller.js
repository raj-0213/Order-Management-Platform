const { User } = require('../models');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Register a new user
exports.register = async (req, res) => {
  try {
    const { username, email, password, role, mobileNo, dob, address } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
      role,
      mobileNo,
      dob,
      address,
    });

    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Authenticate a user (Login)
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: 'User not found' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(400).json({ error: 'Incorrect password' });
    }

    // Generate JWT with only userId
    const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET || "secret", {
      expiresIn: '7d',
    });

    res.status(200).json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.userId);
    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// GET: Fetch all users (Admin Only)
exports.getAllUsers =  async (req, res) => {
    try {
        const users = await User.findAll({ attributes: { exclude: ['password'] } }); 
        res.status(200).json({ success: true, users });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server Error', error: error.message });
    }
};


exports.editProfile = async (req, res) => {
  try {
    const id = req.params;
    const { username, email, password, mobileNo, dob, address } = req.body;

    let updateData = { username, email, mobileNo, dob, address };

    // Hash password if user wants to update it
    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await User.update(updateData, {
      where: { id: id },
      returning: true,
    });

    res.status(200).json({ message: 'Profile updated successfully', user: updatedUser[1][0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.changeUserRole = async (req, res) => {
  try {
    const { userId, newRole } = req.body;
    // console.log(req.body);

    const user = await User.findByPk(userId);
    if (!user) return res.status(404).json({ message: 'User not found' });

    user.role = newRole;
    await user.save();

    res.status(200).json({ message: 'User role updated successfully', user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


exports.deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    // Find the user by ID
    const user = await User.findOne({ where: { id } });

    // If user doesn't exist
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Delete the user
    await User.destroy({
      where: { id }
    });

    return res.status(200).json({ message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};