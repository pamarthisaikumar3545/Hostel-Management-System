const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from config.env
require('dotenv').config({ path: path.join(__dirname, 'config.env') });

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/hostel-management';

console.log('Attempting to connect to MongoDB...');
console.log('Connection string:', mongoURI.replace(/\/\/.*@/, '//***:***@')); // Hide credentials

mongoose.connect(mongoURI)
.then(() => {
  console.log('✅ MongoDB connected successfully!');
  console.log('Database:', mongoose.connection.name);
})
.catch(err => {
  console.error('❌ MongoDB connection error:', err.message);
  console.log('\n🔧 Troubleshooting tips:');
  console.log('1. Check if your IP is whitelisted in MongoDB Atlas');
  console.log('2. Go to Atlas Dashboard > Network Access > Add IP Address');
  console.log('3. Choose "Add Current IP Address" or "Allow Access from Anywhere"');
  console.log('4. Verify your connection string is correct');
});

// Routes
const authRoutes = require('./routes/auth');
const roomRoutes = require('./routes/rooms');
const tenantRoutes = require('./routes/tenants');
const recordRoutes = require('./routes/records');
const maintenanceRoutes = require('./routes/maintenance');

app.use(authRoutes);
app.use('/rooms', roomRoutes);
app.use('/tenants', tenantRoutes);
app.use('/records', recordRoutes);
app.use('/maintenanceRequests', maintenanceRoutes);

// Root endpoint
app.get('/', (req, res) => {
  res.json({ 
    message: 'Hostel Management API is running',
    database: mongoose.connection.readyState === 1 ? 'Connected' : 'Disconnected'
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
  console.log(`📡 API endpoint: http://localhost:${PORT}`);
}); 