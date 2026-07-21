const bookingService = require('../services/bookingService');

const createBooking = async (req, res) => {
  try {
    const { userId, restaurantId, bookingDate, role } = req.body;

    if (!userId || !restaurantId || !bookingDate || !role) {
      return res.status(400).json({ 
        success: false,
        message: 'userId, restaurantId, bookingDate, and role are required' 
      });
    }

    const booking = await bookingService.createBooking(userId, restaurantId, bookingDate, role);
    res.status(201).json({ success: true, message: 'Booking created', booking });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
};

const getUserBookings = async (req, res) => {
  try {
    const { userId, role } = req.query;

    if (!userId || !role) {
      return res.status(400).json({ success: false, message: 'userId and role are required' });
    }

    const bookings = await bookingService.getUserBookings(userId, role);
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

const getRestaurantBookings = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { date, role } = req.query;

    if (!date || !role) {
      return res.status(400).json({ success: false, message: 'date and role are required' });
    }

    const bookings = await bookingService.getRestaurantBookings(restaurantId, new Date(date), role);
    res.status(200).json({ success: true, bookings });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

const checkAvailability = async (req, res) => {
  try {
    const { restaurantId } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ success: false, message: 'date is required' });
    }

    const availability = await bookingService.getAvailability(restaurantId, new Date(date));
    res.status(200).json({ success: true, ...availability });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { userId, role } = req.body;

    if (!userId || !role) {
      return res.status(400).json({ success: false, message: 'userId and role are required' });
    }

    const booking = await bookingService.cancelBooking(bookingId, userId, role);
    res.status(200).json({ success: true, message: 'Booking cancelled', booking });
  } catch (error) {
    res.status(403).json({ success: false, message: error.message });
  }
};

module.exports = {
  createBooking,
  getUserBookings,
  getRestaurantBookings,
  checkAvailability,
  cancelBooking
};