const Vehicle = require('../models/Vehicle');

// Create Vehicle
exports.createVehicle = async (req, res) => {
  try {
    const { type } = req.body;
    if (!type) {
      return res.status(400).json({ message: 'Vehicle type is required' });
    }

    const vehicle = new Vehicle({ type });
    await vehicle.save();

    res.status(201).json({ message: 'Vehicle created successfully', vehicle });
  } catch (error) {
    console.error('Create vehicle error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get All Vehicles
exports.getVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.find();
    res.status(200).json({ vehicles });
  } catch (error) {
    console.error('Get vehicles error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get Vehicle by ID
exports.getVehicleById = async (req, res) => {
  try {
    const vehicle = await Vehicle.findById(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ vehicle });
  } catch (error) {
    console.error('Get vehicle error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update Vehicle
exports.updateVehicle = async (req, res) => {
  try {
    const { type } = req.body;
    if (!type) {
      return res.status(400).json({ message: 'Vehicle type is required' });
    }

    const vehicle = await Vehicle.findByIdAndUpdate(
      req.params.id,
      { type },
      { new: true, runValidators: true }
    );

    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }

    res.status(200).json({ message: 'Vehicle updated', vehicle });
  } catch (error) {
    console.error('Update vehicle error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete Vehicle
exports.deleteVehicle = async (req, res) => {
  try {
    const vehicle = await Vehicle.findByIdAndDelete(req.params.id);
    if (!vehicle) {
      return res.status(404).json({ message: 'Vehicle not found' });
    }
    res.status(200).json({ message: 'Vehicle deleted' });
  } catch (error) {
    console.error('Delete vehicle error:', error.message);
    res.status(500).json({ message: 'Server error' });
  }
};
