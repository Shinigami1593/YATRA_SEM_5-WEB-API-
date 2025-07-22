const mongoose = require('mongoose');

const pointSchema = new mongoose.Schema({
  type: { type: String, enum: ['Point'], required: true },
  coordinates: { type: [Number], required: true }, // [lon, lat]
});

const routeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  source: { type: String, required: true },
  destination: { type: String, required: true },
  coordinates: {
    source: { type: pointSchema, required: true },
    destination: { type: pointSchema, required: true },
  },
  type: { type: String, enum: ['bus', 'micro', 'tempo'], required: false },
  status: { type: String, enum: ['active', 'inactive'], default: 'active' },
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
});

routeSchema.index({ 'coordinates.source': '2dsphere' });
routeSchema.index({ 'coordinates.destination': '2dsphere' });

module.exports = mongoose.model('Route', routeSchema);
