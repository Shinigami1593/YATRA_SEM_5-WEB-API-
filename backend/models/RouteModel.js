const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  name: String,
  source: String,
  destination: String,
  coordinates: {
    source: {
      lat: Number,
      lon: Number,
    },
    destination: {
      lat: Number,
      lon: Number,
    }
  },
  type: {
    type: String,
    enum: ['bus', 'micro', 'tempo'],
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active'
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Route', routeSchema);
