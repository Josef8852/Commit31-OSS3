const User = require("../models/userModel");

// Get current logged in user
// GET /api/users/me
exports.getUserProfile = async (req, res) => {
  try {
    // We are mocking parsing user ID from auth middleware for now,
    // assuming we will pass a user ID in the query or body for testing 
    // since JWT isn't fully set up.
    // For a real app, this would be req.user.id populated by auth middleware.
    const userId = (req.body ? req.body.userId : null) || req.query.userId;
    
    if (!userId) {
       return res.status(401).json({ message: "Not authorized, no user ID provided" });
    }

    const user = await User.findById(userId);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
      });
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
