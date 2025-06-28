const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// In-memory storage for testing
const users = [];

// Registration route
app.post('/api/register', (req, res) => {
  const { rollNumber, name, email, password, confirmPassword, role } = req.body;

  console.log('Received registration request:', { rollNumber, name, email, role });

  // Check if password matches confirm password
  if (password !== confirmPassword) {
    console.log('Password mismatch');
    return res.status(400).json({ message: "Passwords do not match" });
  }

  // Check if user already exists
  const existingUser = users.find(user => 
    user.rollNumber === rollNumber || user.email === email
  );
  
  if (existingUser) {
    console.log('User already exists');
    return res.status(400).json({ message: "User already exists" });
  }

  // Create new user
  const newUser = {
    rollNumber,
    name,
    email,
    password, // In production, hash this
    role
  };

  users.push(newUser);
  console.log('User registered successfully:', { rollNumber, name, email, role });
  res.status(201).json({ message: "User registered successfully" });
});

// Root endpoint
app.get('/', (req, res) => {
  res.send('Simple Hostel Management API is running');
});

app.listen(PORT, () => {
  console.log(`Simple server is running on port ${PORT}`);
  console.log(`Users in memory: ${users.length}`);
}); 