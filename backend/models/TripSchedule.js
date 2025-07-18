const mongoose = require('mongoose');

const tripScheduleSchema = new mongoose.Schema({
  route: { type: mongoose.Schema.Types.ObjectId, ref: 'Route', required: true },
  vehicle: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle', required: true },
   departureTime: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Accepts HH:MM in 24-hour format (e.g., "14:30")
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
      },
      message: props => `${props.value} is not a valid time (expected format HH:MM)`
    }
  },
  arrivalTime: {
    type: String,
    required: true,
    validate: {
      validator: function (v) {
        // Accepts HH:MM in 24-hour format (e.g., "18:45")
        return /^([01]\d|2[0-3]):([0-5]\d)$/.test(v);
      },
      message: props => `${props.value} is not a valid time (expected format HH:MM)`
    }
  },
  status: { type: String, enum: ['scheduled', 'cancelled', 'completed'], default: 'scheduled' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TripSchedule', tripScheduleSchema);
