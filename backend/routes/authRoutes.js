const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User"); // Adjust path as needed
const router = express.Router();

router.post("/register", async (req, res) => {
  try {
      const { username, email, password } = req.body;

      // Check if the user already exists
      let existingUser = await User.findOne({ email });
      if (existingUser) {
          return res.status(400).json({ error: "User already exists" });
      }

      // Hash the password before saving
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(password, salt);

      // Create and save the user
      const newUser = new User({
          username,
          email,
          password: hashedPassword
      });

      const savedUser = await newUser.save(); // Save user to DB

      if (!savedUser) {
          return res.status(500).json({ error: "Failed to save user" });
      }

      // Debugging: Ensure user is defined
      console.log("Registered User:", savedUser);

      // Generate JWT token
      const token = jwt.sign(
          { id: savedUser._id },
          process.env.JWT_SECRET || "your_jwt_secret",
          { expiresIn: "1h" }
      );

      // ✅ Send response with user data
      return res.status(201).json({
          message: "User registered successfully",
          user: {
              _id: savedUser._id,
              username: savedUser.username,
              email: savedUser.email
          },
          token
      });

  } catch (error) {
      console.error("Error in registration:", error);
      return res.status(500).json({ error: "Internal Server Error" });
  }
});


router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ error: "User not found" });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || "your_jwt_secret", // Ensure a fallback for local testing
      { expiresIn: "1h" }
    );

    console.log("Generated Token:", token); // Debugging

    // ✅ Send response once (prevents 'headers already sent' error)
    return res.status(200).json({
      message: "Login successful",
      user: {
        _id: user._id,
        username: user.username,
        email: user.email,
      },
      token,
    });

  } catch (error) {
    console.error("Error during login:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
});


module.exports = router;
