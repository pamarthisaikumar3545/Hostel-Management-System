const mongoose = require('mongoose');
const path = require('path');

// Load environment variables
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI;
mongoose.connect(mongoURI)
  .then(() => {
    console.log('Connected to MongoDB');
    
    // Get the User model
    const User = require('./models/user');
    
    // Find all users
    User.find({})
      .select('-password') // Exclude password for security
      .then(users => {
        console.log('\n=== All Users in Database ===');
        if (users.length === 0) {
          console.log('No users found in database');
        } else {
          users.forEach((user, index) => {
            console.log(`${index + 1}. Roll Number: ${user.rollNumber}`);
            console.log(`   Name: ${user.name}`);
            console.log(`   Email: ${user.email}`);
            console.log(`   Role: ${user.role}`);
            console.log('   ---');
          });
        }
        mongoose.connection.close();
      })
      .catch(err => {
        console.error('Error fetching users:', err);
        mongoose.connection.close();
      });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
  }); 