const TripSchedule = require('../models/TripSchedule');
const isValidTime = (timeStr) => /^([01]\d|2[0-3]):([0-5]\d)$/.test(timeStr);


exports.createTripSchedule = async (req, res) => {
  try {
    const { route, vehicle, departureTime, arrivalTime, status = 'scheduled' } = req.body;
    if (!route || !vehicle || !departureTime || !arrivalTime) {
      return res.status(400).json({ message: 'All fields are required' });
    }
    if (!isValidTime(departureTime) || !isValidTime(arrivalTime)) {
  return res.status(400).json({ message: 'Invalid time format. Use HH:MM (24-hour format).' });
}

    const trip = new TripSchedule({
      route,
      vehicle,
      departureTime,
      arrivalTime
    });

    await trip.save();
    res.status(201).json({ message: 'Trip schedule created', trip });
  } catch (error) {
    console.error('Create trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTripSchedules = async (req, res) => {
  try {
    const trips = await TripSchedule.find()
      .populate('route')
      .populate('vehicle', 'type')
      .sort({ departureTime: 1 }); // Sort by soonest departure

    res.status(200).json({ trips });
  } catch (error) {
    console.error('Get trips error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTripScheduleById = async (req, res) => {
  try {
    const trip = await TripSchedule.findById(req.params.id)
      .populate('route', 'name')
      .populate('vehicle', 'type');

    if (!trip) {
      return res.status(404).json({ message: 'Trip schedule not found' });
    }

    res.status(200).json(trip);
  } catch (error) {
    console.error('Get trip by ID error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateTripSchedule = async (req, res) => {
  try {
    const { route, vehicle, departureTime, arrivalTime, status } = req.body;
    const updateData = {};

    if (route) updateData.route = route;
    if (vehicle) updateData.vehicle = vehicle;
    if (departureTime) updateData.departureTime = departureTime;
    if (arrivalTime) updateData.arrivalTime = arrivalTime;
    if (status && ['scheduled', 'cancelled', 'completed'].includes(status)) updateData.status = status;

    const updatedTrip = await TripSchedule.findByIdAndUpdate(req.params.id, updateData, { new: true })
      .populate('route', 'name')
      .populate('vehicle', 'type');

    if (!updatedTrip) {
      return res.status(404).json({ message: 'Trip schedule not found' });
    }

    res.status(200).json({ message: 'Trip schedule updated', trip: updatedTrip });
  } catch (error) {
    console.error('Update trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteTripSchedule = async (req, res) => {
  try {
    const deleted = await TripSchedule.findByIdAndDelete(req.params.id);
    if (!deleted) {
      return res.status(404).json({ message: 'Trip schedule not found' });
    }
    res.status(200).json({ message: 'Trip schedule deleted successfully' });
  } catch (error) {
    console.error('Delete trip error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
