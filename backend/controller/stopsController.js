const Stop = require('../models/Stop');
const axios = require('axios');

const ORS_API_KEY = process.env.ORS_API_KEY;
const OVERPASS_API_URL = 'http://overpass-api.de/api/interpreter';

// Helper to convert MongoDB stops to GeoJSON
const toGeoJson = (stop) => ({
  type: 'Feature',
  geometry: {
    type: 'Point',
    coordinates: stop.location.coordinates // [lon, lat]
  },
  properties: {
    id: stop._id,
    name: stop.name,
    route: stop.route,
    status: stop.status,
    user: stop.user,
    createdAt: stop.createdAt
  }
});

exports.createStop = async (req, res) => {
  try {
    const { name, location, route } = req.body;
    if (!name || !location || !location.coordinates || location.coordinates.length !== 2) {
      return res.status(400).json({ message: 'Name and location (coordinates: [lon, lat]) are required' });
    }

    const stop = new Stop({
      name,
      location: { type: 'Point', coordinates: location.coordinates },
      route: route || null,
      user: req.user.userId,
      status: 'active'
    });
    await stop.save();

    res.status(201).json({ message: 'Stop created', stop: toGeoJson(stop) });
  } catch (error) {
    console.error('Create stop error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStops = async (req, res) => {
  try {
    const { lat, lon, radius } = req.query;
    let stops = [];

    if (lat && lon && radius) {
      // Proximity search from MongoDB
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);
      const radiusNum = parseFloat(radius);
      if (isNaN(latNum) || isNaN(lonNum) || isNaN(radiusNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180 || radiusNum <= 0) {
        return res.status(400).json({ message: 'Invalid lat, lon, or radius' });
      }
      const radiusInRadians = radiusNum / 6371;
      const mongoStops = await Stop.find({
        status: 'active',
        location: {
          $nearSphere: {
            $geometry: { type: 'Point', coordinates: [lonNum, latNum] },
            $maxDistance: radiusInRadians * 1000
          }
        }
      }).populate('user', 'name firstName lastName profilePicture').populate('route', 'name');
      stops = mongoStops.map(toGeoJson);
    } else {
      // Fetch stops from OSM (e.g., bus stops) via Overpass API
      const query = `
        [out:json];
        node["highway"="bus_stop"](around:${req.query.radius || 1000},${req.query.lat || 27.7172},${req.query.lon || 85.3240});
        out body;
      `;
      const response = await axios.post(OVERPASS_API_URL, query);
      const osmStops = response.data.elements.map(element => ({
        type: 'Feature',
        geometry: {
          type: 'Point',
          coordinates: [element.lon, element.lat]
        },
        properties: {
          id: `osm-${element.id}`,
          name: element.tags.name || 'Unnamed Stop',
          route: null,
          status: 'active',
          user: req.user,
          createdAt: new Date()
        }
      }));
      // Combine with MongoDB stops
      const mongoStops = await Stop.find({ status: 'active' })
        .populate('user', 'name firstName lastName profilePicture')
        .populate('route', 'name');
      stops = [...osmStops, ...mongoStops.map(toGeoJson)];
    }

    res.status(200).json({ stops });
  } catch (error) {
    console.error('Get stops error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getStopById = async (req, res) => {
  try {
    const stop = await Stop.findOne({ _id: req.params.id, status: 'active' })
      .populate('user', 'name firstName lastName profilePicture')
      .populate('route', 'name');
    if (!stop) {
      return res.status(404).json({ message: 'Stop not found' });
    }
    res.status(200).json(toGeoJson(stop));
  } catch (error) {
    console.error('Get stop error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAdminStops = async (req, res) => {
  try {
    const { lat, lon, radius, geojson } = req.query;
    let stops = [];

    if (lat && lon && radius) {
      const latNum = parseFloat(lat);
      const lonNum = parseFloat(lon);
      const radiusNum = parseFloat(radius);
      if (isNaN(latNum) || isNaN(lonNum) || isNaN(radiusNum) || latNum < -90 || latNum > 90 || lonNum < -180 || lonNum > 180 || radiusNum <= 0) {
        return res.status(400).json({ message: 'Invalid lat, lon, or radius' });
      }
      const radiusInRadians = radiusNum / 6371;
      const mongoStops = await Stop.find({
        location: {
          $nearSphere: {
            $geometry: { type: 'Point', coordinates: [lonNum, latNum] },
            $maxDistance: radiusInRadians * 1000
          }
        }
      }).populate('user', 'name firstName lastName profilePicture').populate('route', 'name');
      stops = mongoStops.map(geojson === 'true' ? toGeoJson : stop => stop);
    } else {
      const mongoStops = await Stop.find({})
        .populate('user', 'name firstName lastName profilePicture')
        .populate('route', 'name');
      stops = geojson === 'true' ? mongoStops.map(toGeoJson) : mongoStops;
    }

    res.status(200).json({ stops });
  } catch (error) {
    console.error('Get admin stops error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAdminStopById = async (req, res) => {
  try {
    const { geojson } = req.query;
    const stop = await Stop.findById(req.params.id)
      .populate('user', 'name firstName lastName profilePicture')
      .populate('route', 'name');
    if (!stop) {
      return res.status(404).json({ message: 'Stop not found' });
    }
    res.status(200).json(geojson === 'true' ? toGeoJson(stop) : stop);
  } catch (error) {
    console.error('Get admin stop error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateStop = async (req, res) => {
  try {
    const { name, location, route, status } = req.body;
    const updateData = {};
    if (name) updateData.name = name;
    if (location) {
      if (!location.coordinates || location.coordinates.length !== 2) {
        return res.status(400).json({ message: 'Valid location (coordinates: [lon, lat]) is required' });
      }
      updateData.location = { type: 'Point', coordinates: location.coordinates };
    }
    if (route) updateData.route = route;
    if (status && ['active', 'inactive'].includes(status)) updateData.status = status;

    const stop = await Stop.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate('user', 'name firstName lastName profilePicture')
      .populate('route', 'name');
    if (!stop) {
      return res.status(404).json({ message: 'Stop not found' });
    }
    res.status(200).json({ message: 'Stop updated', stop: toGeoJson(stop) });
  } catch (error) {
    console.error('Update stop error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteStop = async (req, res) => {
  try {
    const stop = await Stop.findByIdAndDelete(req.params.id);
    if (!stop) {
      return res.status(404).json({ message: 'Stop not found' });
    }
    res.status(200).json({ message: 'Stop deleted successfully' });
  } catch (error) {
    console.error('Delete stop error:', error.message, error.stack);
    res.status(500).json({ message: 'Server error' });
  }
};