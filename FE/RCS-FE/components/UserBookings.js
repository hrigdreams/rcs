// components/UserBookings.js
'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'

const UserBookings = ({ userId, userRole }) => {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    if (userId) {
      fetchUserBookings()
    }
  }, [userId])

  const fetchUserBookings = async () => {
    try {
      setLoading(true)
      const response = await axios.get(
        `http://localhost:8000/api/bookings/user/my-bookings`,
        {
          params: {
            userId: userId,
            role: userRole
          },
          headers: {
            'Content-Type': 'application/json'
          }
        }
      )
      setBookings(response.data.bookings || [])
      setError(null)
    } catch (err) {
      console.error('Error fetching bookings:', err)
      setError('Failed to load bookings')
    } finally {
      setLoading(false)
    }
  }

  const handleCancelBooking = async (bookingId) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/bookings/${bookingId}`,
        {
          data: {
            userId: userId,
            role: userRole
          }
        }
      )
      setBookings(bookings.filter(b => b.booking_id !== bookingId))
    } catch (err) {
      console.error('Error canceling booking:', err)
      alert('Failed to cancel booking')
    }
  }

  const confirmedBookings = bookings.filter(booking => booking.status === 'confirmed')

  if (loading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
      </div>
    )
  }

  return (
    <div className="mt-8">
      <h2 className="text-2xl font-bold text-gray-900 mb-4">Your Bookings</h2>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
          {error}
        </div>
      )}

      {confirmedBookings.length === 0 ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center text-gray-600">
          No bookings yet. Start booking your favorite restaurants!
        </div>
      ) : (
        <div className="flex gap-4 overflow-x-auto pb-4">
          {confirmedBookings.map(booking => (
            <div
              key={booking.booking_id}
              className="shrink-0 w-80 bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow p-4 group"
            >
              <div className="space-y-3">
                <div>
                  <h3 className="text-lg font-bold text-gray-900">
                    {booking.restaurant?.r_name || 'Restaurant'}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {booking.restaurant?.r_location}
                  </p>
                </div>

                <div className="border-t border-gray-200 pt-3 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Date:</span>
                    <span className="font-medium text-gray-900">
                      {new Date(booking.booking_date).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Status:</span>
                    <span className="font-medium px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                      confirmed
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Booked on:</span>
                    <span className="text-gray-900 text-xs">
                      {new Date(booking.created_at).toLocaleDateString()}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => handleCancelBooking(booking.booking_id)}
                  className="w-full mt-3 opacity-0 group-hover:opacity-100 transition-opacity bg-red-50 hover:bg-red-100 text-red-600 font-medium py-2 rounded-lg"
                >
                  Cancel Booking
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default UserBookings