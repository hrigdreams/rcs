const { Booking, Restaurant, User } = require('../models');
const { Op } = require('sequelize');

const BOOKING_CAPACITY_PER_DAY = 10;

// Check available slots for a restaurant on a specific date
const checkAvailability = async (restaurantId, bookingDate) => {
  const startOfDay = new Date(bookingDate);
  startOfDay.setHours(0, 0, 0, 0);
  
  const endOfDay = new Date(bookingDate);
  endOfDay.setHours(23, 59, 59, 999);

  const bookedCount = await Booking.count({
    where: {
      restaurant_id: restaurantId,
      booking_date: {
        [Op.between]: [startOfDay, endOfDay]
      },
      status: 'confirmed'
    }
  });

  return bookedCount < BOOKING_CAPACITY_PER_DAY;
};

// Create a new booking - ONLY FOR 'user' ROLE
const createBooking = async (userId, restaurantId, bookingDate, role) => {
  try {
    // CHECK ROLE
    if (role !== 'user') {
      throw new Error('Only users can create bookings. Admin cannot book.');
    }

    // Check if restaurant exists
    const restaurant = await Restaurant.findByPk(restaurantId);
    if (!restaurant) {
      throw new Error('Restaurant not found');
    }

    // Check availability
    const isAvailable = await checkAvailability(restaurantId, bookingDate);
    if (!isAvailable) {
      throw new Error(`No slots available for ${new Date(bookingDate).toDateString()}. Maximum 10 bookings per day.`);
    }

    // Create booking
    const booking = await Booking.create({
      user_id: userId,
      restaurant_id: restaurantId,
      booking_date: bookingDate
    });

    return booking;
  } catch (error) {
    throw error;
  }
};

// Get user's bookings - ONLY FOR 'user' ROLE
const getUserBookings = async (userId, role) => {
  if (role !== 'user') {
    throw new Error('Unauthorized');
  }

  return await Booking.findAll({
    where: { user_id: userId },
    include: [{model: Restaurant}],
    order: [['booking_date', 'DESC']]
  });
};

// Cancel a booking - ONLY FOR 'user' ROLE
const cancelBooking = async (bookingId, userId, role) => {
  if (role !== 'user') {
    throw new Error('Only users can cancel their own bookings');
  }

  const booking = await Booking.findByPk(bookingId);
  
  if (!booking) {
    throw new Error('Booking not found');
  }

  if (booking.user_id !== userId) {
    throw new Error('Unauthorized');
  }

  await booking.update({ status: 'cancelled' });
  return booking;
};

// Check availability - PUBLIC (no role check needed)
const getAvailability = async (restaurantId, bookingDate) => {
  const isAvailable = await checkAvailability(restaurantId, bookingDate);
  const bookedCount = await Booking.count({
    where: {
      restaurant_id: restaurantId,
      booking_date: {
        [Op.between]: [new Date(bookingDate).setHours(0,0,0,0), new Date(bookingDate).setHours(23,59,59,999)]
      },
      status: 'confirmed'
    }
  });
  return { available: isAvailable, booked: bookedCount, capacity: BOOKING_CAPACITY_PER_DAY };
};

module.exports = {
  createBooking,
  getUserBookings,
  cancelBooking,
  getAvailability
};