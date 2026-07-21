'use client'
import { useState } from 'react'
import axios from 'axios'

const BookingForm = ({ restaurantId, userId, userRole }) => {
  const [bookingDate, setBookingDate] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState(null)
  const [messageType, setMessageType] = useState(null)

  const handleBooking = async (e) => {
    e.preventDefault()
    
    if (!bookingDate) {
      setMessage('Please select a date')
      setMessageType('error')
      return
    }

    try {
      setLoading(true)
      await axios.post('http://localhost:8000/api/bookings/createbooking', {
        userId: userId,
        restaurantId: restaurantId,
        bookingDate: bookingDate,
        role: userRole
      })

      setMessage('✓ Booking successful!')
      setMessageType('success')
      setBookingDate('')
    } catch (err) {
      if (err.response?.status === 409) {
        setMessage('Restaurant is fully booked for this date')
      } else {
        setMessage(err.response?.data?.message || 'Booking failed. Please try again.')
      }
      setMessageType('error')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="mt-8 rounded-2xl border border-gray-200 bg-white p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Book a Table</h2>

      {message && (
        <div className={`mb-4 rounded-lg px-4 py-3 ${
          messageType === 'success' 
            ? 'bg-green-50 text-green-700 border border-green-200' 
            : 'bg-red-50 text-red-700 border border-red-200'
        }`}>
          {message}
        </div>
      )}

      <form onSubmit={handleBooking} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Select Date</label>
          <input
            type="date"
            value={bookingDate}
            onChange={(e) => setBookingDate(e.target.value)}
            min={new Date().toISOString().split('T')[0]}
            className="w-full text-black rounded-lg border border-gray-300 px-4 py-2 outline-none focus:border-emerald-500"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-lg bg-emerald-600 text-white py-3 font-medium hover:bg-emerald-700 disabled:opacity-50"
        >
          {loading ? 'Booking...' : 'Confirm Booking'}
        </button>
      </form>
    </div>
  )
}

export default BookingForm