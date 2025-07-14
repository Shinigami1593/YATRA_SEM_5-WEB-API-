const mongoose = require('mongoose');

const vehicleSchema = new mongoose.Schema({
  type: {
    type: String,
    required: true,
    trim: true,
    enum: ['Bus', 'Micro', 'Tempo']
  }
}, { timestamps: true });

module.exports = mongoose.model('Vehicle', vehicleSchema);
