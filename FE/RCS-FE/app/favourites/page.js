'use client'
import { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '../../components/Header'
import UserSidebar from '../../components/UserSidebar'
import { useAuth } from '@/context/AuthContext'
import RestaurantCard from '../../components/RestaurantCard'

const Favourites = () => {
  const [favouriteRestaurants, setFavouriteRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [likes, setLikes] = useState([])

  const { user } = useAuth()
  const userId = user?.data?.id

  const API_URL = 'http://localhost:8000/api/restaurant'
  const LIKE_API_URL = 'http://localhost:8000/api/like'
  const FAV_API_URL = 'http://localhost:8000/api/favourite'

  useEffect(() => {
    if (userId) {
      fetchUserFavourites()
      fetchUserLikes()
    }
  }, [userId])

  const fetchUserFavourites = async () => {
    try {
      setLoading(true)
      
      // Fetch user's favourite IDs
      const favResponse = await axios.get(`${FAV_API_URL}/user/${userId}`)
      const favouriteIds = favResponse.data.data?.map(item => 
        item.restaurant_id || item.restaurantId || item.id
      ) || []

      if (favouriteIds.length === 0) {
        setFavouriteRestaurants([])
        setLoading(false)
        return
      }

      // Fetch all restaurants
      const restaurantsResponse = await axios.get(`${API_URL}/all`)
      const allRestaurants = restaurantsResponse.data.data

      // Filter to get only favourited restaurants
      const favourited = allRestaurants.filter(restaurant => 
        favouriteIds.includes(restaurant.restaurant_id)
      )

      setFavouriteRestaurants(favourited)
      setError(null)
    } catch (err) {
      console.error('Error fetching favourites:', err)
      setError('Failed to load your favourite restaurants. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserLikes = async () => {
    try {
      const response = await axios.get(`${LIKE_API_URL}/user/${userId}`)
      const likedIds = response.data.data?.map(item => 
        item.restaurant_id || item.restaurantId || item.id
      ) || []
      setLikes(likedIds)
    } catch (err) {
      console.error('Error fetching likes:', err)
    }
  }

  const handleRemoveFavourite = async (restaurantId) => {
    try {
      await axios.post(`${FAV_API_URL}/remove`, {
        userId: userId,
        restaurantId: restaurantId
      })
      
      // Remove from local state
      setFavouriteRestaurants(favouriteRestaurants.filter(r => r.restaurant_id !== restaurantId))
    } catch (err) {
      console.error('Error removing favourite:', err)
      alert('Failed to remove from favourites. Please try again.')
    }
  }

  const handleLike = async (restaurantId) => {
    try {
      if (likes.includes(restaurantId)) {
        await axios.post(`${LIKE_API_URL}/remove`, {
          userId: userId,
          restaurantId: restaurantId
        })
        setLikes(likes.filter(id => id !== restaurantId))
      } else {
        await axios.post(`${LIKE_API_URL}/add`, {
          userId: userId,
          restaurantId: restaurantId
        })
        setLikes([...likes, restaurantId])
      }
    } catch (err) {
      console.error('Error toggling like:', err)
      alert('Failed to update like. Please try again.')
    }
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-50">
        <UserSidebar />

        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">My Favourites</h1>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-6 py-4 rounded-lg mb-6 relative">
                <button 
                  onClick={() => setError(null)} 
                  className="absolute top-4 right-4 text-red-500 hover:text-red-700"
                >
                  ✕
                </button>
                {error}
              </div>
            )}

            {/* Loading State */}
            {loading && (
              <div className="text-center py-16">
                <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-600">Loading your favourites...</p>
              </div>
            )}

            {/* Favourites Grid */}
            {!loading && favouriteRestaurants.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favouriteRestaurants.map((restaurant) => (
              <RestaurantCard
              key={restaurant.restaurant_id}
              restaurant={restaurant}
              isLiked={likes.includes(restaurant.restaurant_id)}
              onRemoveFavourite={handleRemoveFavourite}
              onToggleLike={handleLike}
              />
            ))}
          </div>
        )}

            {/* Empty State */}
            {!loading && favouriteRestaurants.length === 0 && !error && (
              <div className="text-center py-16">
                <div className="text-6xl mb-4">🤍</div>
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No favourites yet</h3>
                <p className="text-gray-500 mb-6">Start adding restaurants to your favourites!</p>
                <a 
                  href="/RestaurantList" 
                  className="inline-block bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-6 rounded-lg font-medium transition-colors"
                >
                  Browse Restaurants
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default Favourites