const mongoose = require('mongoose');

const tenantSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  rollNumber: { type: String, required: true, unique: true },
  roomId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Room',
    required: true,
  },
  startMonth: { type: String, required: true },
  numberOfMonths: { type: Number, required: true },
  checkInDate: { type: Date, default: Date.now },
  status: {
    type: String,
    enum: ['Active', 'Inactive'],
    default: 'Active',
  },
});

module.exports = mongoose.model('Tenant', tenantSchema); 