const express = require('express');
const bookingController = require('../controllers/bookingController');

const router = express.Router();

router.post('/createbooking', bookingController.createBooking);

router.get('/user/my-bookings', bookingController.getUserBookings);

// Check availability for a restaurant on a date (public - no role check)
router.get('/:restaurantId/availability', bookingController.checkAvailability);

// Cancel a booking
router.delete('/:bookingId', bookingController.cancelBooking);

module.exports = router;