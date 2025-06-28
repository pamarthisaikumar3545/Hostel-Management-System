const mongoose = require('mongoose');

const roomSchema = new mongoose.Schema({
  roomNumber: {
    type: String,
    required: true,
    unique: true,
    trim: true,
  },
  building: {
    type: String,
    required: true,
    default: 'Vedavathi',
  },
  floor: {
    type: Number,
    required: true,
    min: 1,
  },
  capacity: {
    type: Number,
    required: true,
    min: 1,
  },
  occupied: {
    type: Number,
    required: true,
    default: 0,
    min: 0,
  },
  status: {
    type: String,
    required: true,
    enum: ['Available', 'Occupied', 'Maintenance'],
    default: 'Available',
  },
  rent: {
    type: Number,
    required: true,
    min: 0,
  },
});

module.exports = mongoose.model('Room', roomSchema); 