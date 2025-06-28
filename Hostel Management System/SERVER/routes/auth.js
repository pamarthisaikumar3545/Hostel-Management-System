const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Assuming User is your Mongoose model
const router = express.Router();

// Register Route
router.post("/register", async (req, res) => {
  const { rollNumber, name, email, password, confirmPassword, role } = req.body;

  console.log('Registration attempt:', { rollNumber, name, email, role });

  // Check if password matches confirm password
  if (password !== confirmPassword) {
    return res.status(400).json({ message: "Passwords do not match" });
  }

  try {
    // Check if the user already exists with the same roll number
    const existingUserByRoll = await User.findOne({ rollNumber });
    if (existingUserByRoll) {
      return res.status(400).json({ message: "User with this roll number already exists" });
    }

    // Check if the user already exists with the same email
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ message: "User with this email already exists" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      rollNumber,
      name,
      email,
      password: hashedPassword,
      role,
    });

    // Save the new user to the database
    await newUser.save();
    console.log('User registered successfully:', { rollNumber, name, email, role });
    res.status(201).json({ message: "User registered successfully" });
  } catch (err) {
    console.error("Error during registration:", err);
    res.status(500).json({ message: "Registration failed", error: err.message });
  }
});

// Login Route
router.post("/login", async (req, res) => {
  const { rollNumber, password, role } = req.body;

  console.log('Login attempt:', { rollNumber, role });

  // Validate required fields
  if (!rollNumber || !password || !role) {
    console.log('Missing required fields:', { rollNumber: !!rollNumber, password: !!password, role: !!role });
    return res.status(400).json({ 
      message: "Roll number, password, and role are required" 
    });
  }

  try {
    const user = await User.findOne({ rollNumber, role });
    console.log('User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      return res.status(400).json({ 
        message: "User with this roll number and role not found" 
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch ? 'Yes' : 'No');
    
    if (!isMatch) {
      return res.status(400).json({ 
        message: "Invalid password" 
      });
    }

    // Create and sign a JWT
    const payload = {
      user: {
        id: user.id,
        role: user.role,
        name: user.name,
      },
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET || "your_default_jwt_secret", // Use an environment variable for the secret
      { expiresIn: "1h" }, // Token expires in 1 hour
      (err, token) => {
        if (err) throw err;
        res.status(200).json({
          message: "Login successful",
          token, // <-- Send token to the client
          user: {
            rollNumber: user.rollNumber,
            name: user.name,
            email: user.email,
            role: user.role,
          },
        });
      }
    );
  } catch (err) {
    console.error("Error during login:", err);
    res.status(500).json({ message: "Login failed", error: err.message });
  }
});

module.exports = router;
