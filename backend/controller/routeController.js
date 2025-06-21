const Route = require('../models/route');
const axios = require('axios');

// Get coordinates from OpenStreetMap (Nominatim)
async function getCoordinates(place) {
  const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(place)}&format=json&limit=1`;
  const response = await axios.get(url, { headers: { 'User-Agent': 'Transit-App/1.0' } });
  if (response.data.length > 0) {
    return {
      lat: parseFloat(response.data[0].lat),
      lon: parseFloat(response.data[0].lon),
    };
  }
  throw new Error(`Location not found: ${place}`);
}

// Add new route
exports.addRoute = async (req, res) => {
  try {
    const { name, source, destination, type, status, user } = req.body;

    const sourceCoords = await getCoordinates(source);
    const destCoords = await getCoordinates(destination);

    const route = new Route({
      name,
      source,
      destination,
      coordinates: {
        source: sourceCoords,
        destination: destCoords
      },
      type,
      status,
      user
    });

    const saved = await route.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get all routes
exports.getRoutes = async (req, res) => {
  try {
    const routes = await Route.find().populate('user', 'name email');
    res.json(routes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update route
exports.updateRoute = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, source, destination, type, status } = req.body;

    const sourceCoords = await getCoordinates(source);
    const destCoords = await getCoordinates(destination);

    const updated = await Route.findByIdAndUpdate(
      id,
      {
        name,
        source,
        destination,
        coordinates: {
          source: sourceCoords,
          destination: destCoords
        },
        type,
        status
      },
      { new: true }
    );

    if (!updated) return res.status(404).json({ error: 'Route not found' });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Delete route
exports.deleteRoute = async (req, res) => {
  try {
    const deleted = await Route.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: 'Route not found' });
    res.json({ message: 'Route deleted' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
