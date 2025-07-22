const Route = require('../models/RouteModel');
const axios = require('axios');
const { v4: uuidv4 } = require('uuid');

const ORS_API_KEY = process.env.ORS_API_KEY;
const ORS_BASE_URL = 'https://api.openrouteservice.org/v2/directions';

const toGeoJson = route => ({
  type: 'Feature',
  geometry: {
    type: 'LineString',
    coordinates: [
      route.coordinates.source.coordinates,
      route.coordinates.destination.coordinates,
    ],
  },
  properties: {
    id: route._id,
    name: route.name,
    source: route.source,
    destination: route.destination,
    type: route.type,
    status: route.status,
    user: route.user,
  },
});

exports.createRoute = async (req, res) => {
  try {
    const { name, source, destination, coordinates, type } = req.body;
    if (!name || !source || !destination || !coordinates || !type) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const { source: src, destination: dest } = coordinates;
    if (
      !src?.lat || !src?.lon ||
      !dest?.lat || !dest?.lon ||
      !['bus', 'micro', 'tempo'].includes(type)
    ) {
      return res.status(400).json({ message: 'Invalid data.' });
    }

    const route = new Route({
      name,
      source,
      destination,
      coordinates: {
        source: { type: 'Point', coordinates: [src.lon, src.lat] },
        destination: { type: 'Point', coordinates: [dest.lon, dest.lat] },
      },
      type,
      status: 'active',
      user: req.user.userId,
    });
    await route.save();

    res.status(201).json({ message: 'Route created', route: toGeoJson(route) });
  } catch (error) {
    console.error('Create route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRoutes = async (req, res) => {
  try {
    const { lat, lon, radius, source, destination, type } = req.query;
    let routes = [];

    if (source && destination) {
      // ORS routing
      const profile = 'driving-car';
      const resp = await axios.get(`${ORS_BASE_URL}/${profile}/geojson`, {
        headers: { Authorization: ORS_API_KEY },
        params: {
          coordinates: [
            [parseFloat(source.lon), parseFloat(source.lat)],
            [parseFloat(destination.lon), parseFloat(destination.lat)],
          ],
          instructions: true,
          preference: 'recommended',
        },
      });
      routes = resp.data.features.map(feature => ({
        type: 'Feature',
        geometry: feature.geometry,
        properties: {
          id: `ors-${uuidv4()}`,
          name: `Route from ${source.name || 'src'} to ${destination.name || 'dst'}`,
          source,
          destination,
          type: type || 'bus',
          status: 'active',
          user: req.user.userId,
        },
      }));
    } else if (lat && lon && radius) {
      const latNum = parseFloat(lat), lonNum = parseFloat(lon), r = parseFloat(radius);
      if (isNaN(latNum) || isNaN(lonNum) || isNaN(r) || r <= 0) {
        return res.status(400).json({ message: 'Invalid lat/lon/radius.' });
      }
      const routesDb = await Route.find({
        'coordinates.source': {
          $nearSphere: {
            $geometry: { type: 'Point', coordinates: [lonNum, latNum] },
            $maxDistance: r * 1000,
          },
        },
        status: 'active',
      }).populate('user', 'name firstName lastName profilePicture');

      routes = routesDb.map(toGeoJson);
    } else {
      const allRoutes = await Route.find({ status: 'active' })
        .populate('user', 'name firstName lastName profilePicture');
      routes = allRoutes.map(toGeoJson);
    }

    res.status(200).json({ routes });
  } catch (error) {
    console.error('Get routes error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getRouteById = async (req, res) => {
  try {
    const route = await Route.findOne({ _id: req.params.id, status: 'active' })
      .populate('user', 'name firstName lastName profilePicture');
    if (!route) return res.status(404).json({ message: 'Route not found' });
    res.status(200).json(toGeoJson(route));
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateRoute = async (req, res) => {
  try {
    const { name, source, destination, coordinates, type, status } = req.body;
    const update = {};

    if (name) update.name = name;
    if (source) update.source = source;
    if (destination) update.destination = destination;

    if (coordinates) {
      // coordinates expected as { source: { lat, lon }, destination: { lat, lon } }
      const { source: src, destination: dest } = coordinates;

      if (src?.lat != null && src?.lon != null && dest?.lat != null && dest?.lon != null) {
        update.coordinates = {
          source: { type: 'Point', coordinates: [src.lon, src.lat] },
          destination: { type: 'Point', coordinates: [dest.lon, dest.lat] },
        };
      } else {
        return res.status(400).json({ message: 'Invalid coordinates format' });
      }
    }

    if (type) {
      if (!['bus', 'micro', 'tempo'].includes(type)) {
        return res.status(400).json({ message: 'Invalid type' });
      }
      update.type = type;
    }

    if (status) update.status = status;

    console.log('Update Route called with id:', req.params.id);

    const updated = await Route.findByIdAndUpdate(req.params.id, update, { new: true });

    if (!updated) {
      return res.status(404).json({ message: 'Route not found' });
    }

    res.status(200).json({ message: 'Route updated', route: toGeoJson(updated) });
  } catch (error) {
    console.error('Update route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




exports.deleteRoute = async (req, res) => {
  try {
    const deleted = await Route.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Route not found' });
    }
    res.status(200).json({ message: 'Route deleted successfully' });
  } catch (error) {
    console.error('Delete route error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getInactiveRoutes = async (req, res) => {
  const routes = await Route.find({ status: 'inactive' })
    .populate('user', 'name firstName lastName profilePicture');
  res.status(200).json({ routes });
};

exports.activateRoute = async (req, res) => {
  const route = await Route.findById(req.params.id);
  if (!route) return res.status(404).json({ message: 'Route not found' });
  route.status = 'active';
  await route.save();
  res.status(200).json({ message: 'Route activated', route: toGeoJson(route) });
};

exports.getAllRoutesAdmin = async (req, res) => {
  // console.log('User in request'. req.user);
  try {
    // if (!res.user || !req.user.isAdmin) {
    //   return res.status(403).json({ message: 'Access denied. Admins only.' });
    // }
    
    const routes = await Route.find({})
      .populate('user', 'name firstName lastName');

    const geoJsonRoutes = routes.map(toGeoJson);
    res.status(200).json({ routes: geoJsonRoutes });
  } catch (error) {
    console.error('Get all routes (admin) error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
