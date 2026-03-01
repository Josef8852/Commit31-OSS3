const User = require("../models/userModel");

// Register user
// POST /api/auth/register
exports.registerUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }
    const { name, email, password } = req.body;

    const userExists = await User.findOne({ email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const user = await User.create({
      name,
      email,
      password,
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: "User registered successfully",
      });
    } else {
      res.status(400).json({ message: "Invalid user data" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Login user
// POST /api/auth/login
exports.loginUser = async (req, res) => {
  try {
    if (!req.body) {
      return res.status(400).json({ message: "Request body is missing" });
    }
    const { email, password } = req.body;
    console.log(req.body)
    const user = await User.findOne({ email }).select("+password");

    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        message: "User logged in successfully",
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};