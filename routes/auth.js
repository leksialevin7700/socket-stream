const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const router = express.Router();

const SECRET = "asbcdefghijkl1456"; // Fetch from environment variable or use fallback

// Register Route
router.post("/register", async (req, res) => {
  const { username, email, phoneNumber, password } = req.body;

  console.log("Register request received:", { username, email, phoneNumber, password }); // Debugging

  // Check if all fields are provided
  if (!username || !email || !phoneNumber || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    // Check if username already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check if phone number already exists
    const existingPhoneNumber = await User.findOne({ phoneNumber });
    if (existingPhoneNumber) {
      return res.status(400).json({ message: "Phone number already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create a new user with the hashed password
    const newUser = new User({ username, email, phoneNumber, password: hashedPassword });
    await newUser.save();

    console.log("New user registered:", newUser);
    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during registration:", error);
    return res.status(500).json({ message: "An error occurred while registering the user" });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: "Username and password are required" });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare password with the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user._id, username }, SECRET, { expiresIn: "1h" });

    res.status(200).json({ token, username });
  } catch (err) {
    console.error("Error logging in user:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Fetch All Users (User List for Chat)
router.get("/users", async (req, res) => {
  try {
    const users = await User.find({}, { username: 1, _id: 0 }); // Return only usernames, exclude sensitive fields
    res.status(200).json(users);
  } catch (err) {
    console.error("Error fetching users:", err);
    res.status(500).json({ message: "Error fetching users" });
  }
});

module.exports = router;


 