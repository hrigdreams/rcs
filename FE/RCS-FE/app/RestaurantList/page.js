'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Header from '../../components/Header'
import UserSidebar from '../../components/UserSidebar'
import { useAuth } from '@/context/AuthContext'
import SearchBar from '../../components/SearchBar'

const RestaurantList = () => {
  const [restaurants, setRestaurants] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [favourites, setFavourites] = useState([])
  const [likes, setLikes] = useState([])
  const [filteredRestaurants, setFilteredRestaurants] = useState(restaurants)

  const router = useRouter()
  const { user } = useAuth()
  const userId = user?.data?.id
  const API_URL = 'http://localhost:8000/api/restaurant'
  const LIKE_API_URL = 'http://localhost:8000/api/like'
  const FAV_API_URL = 'http://localhost:8000/api/favourite'

  useEffect(() => {
  if (!userId) {
    setLoading(false)
    return
  }

  fetchRestaurants()
  fetchUserLikes()
  fetchUserFavourites()
}, [userId])
  useEffect(() => {
    setFilteredRestaurants(restaurants)
  },[restaurants])

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/all`)
      const data = response.data
      setRestaurants(data.data)
      setError(null)
    } catch (err) {
      console.error('Error fetching restaurants:', err)

      if (err.response?.status === 404) {
        setError('Restaurant endpoint not found. Please check your backend.')
      } else if (err.response?.status === 500) {
        setError('Server error. Please check your backend is running correctly.')
      } else {
        setError(`Failed to load restaurants: ${err.response?.data?.message || err.message}`)
      }
    } finally {
      setLoading(false)
    }
  }

  const fetchUserLikes = async () => {
    try {
      const response = await axios.get(`${LIKE_API_URL}/user/${userId}`)
      const likedIds = response.data.data?.map(item => 
        item.restaurantId || item.restaurant_id || item.id
      ) || []
      setLikes(likedIds)
    } catch (err) {
      console.error('Error fetching likes:', err)
    }
  }

  const fetchUserFavourites = async () => {
    try {
      const response = await axios.get(`${FAV_API_URL}/user/${userId}`)
      const favIds = response.data.data?.map(item => 
        item.restaurantId || item.restaurant_id || item.id
      ) || []
      setFavourites(favIds)
    } catch (err) {
      console.error('Error fetching favourites:', err)
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

  const handleFavourite = async (restaurantId) => {
    try {
      if (favourites.includes(restaurantId)) {
        await axios.post(`${FAV_API_URL}/remove`, {
          userId: userId,
          restaurantId: restaurantId
        })
        setFavourites(favourites.filter(id => id !== restaurantId))
      } else {
        await axios.post(`${FAV_API_URL}/add`, {
          userId: userId,
          restaurantId: restaurantId
        })
        setFavourites([...favourites, restaurantId])
      }
    } catch (err) {
      console.error('Error toggling favourite:', err)
      alert('Failed to update favourite. Please try again.')
    }
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-50">
        <UserSidebar />

        <div className="flex-1 p-8">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-4xl font-bold text-gray-900 mb-8">Restaurants</h1>

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
                <p className="mt-4 text-gray-600">Loading restaurants...</p>
              </div>
            )}
            <SearchBar restaurants={restaurants} onSearch={setFilteredRestaurants}/>

            {/* Restaurants Grid */}
            {!loading && filteredRestaurants.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredRestaurants.map((restaurant) => (
                  <div
                    key={restaurant.restaurant_id}
                    className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col"
                  >
                    {/* Restaurant Header */}
                    <div className="bg-linear-to-r from-emerald-500 to-emerald-600 h-32 flex items-center justify-center relative">
                      {/* Favourite Button - Top Right */}
                      <button
                        onClick={() => handleFavourite(restaurant.restaurant_id)}
                        className="absolute top-3 right-3 bg-white p-2 rounded-full hover:scale-110 transition-transform shadow-md"
                        title={favourites.includes(restaurant.restaurant_id) ? "Remove from favourites" : "Add to favourites"}
                      >
                        {favourites.includes(restaurant.restaurant_id) ? '❤️' : '🤍'}
                      </button>
                    </div>

                    {/* Restaurant Info */}
                    <div className="p-6 flex flex-col grow">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">{restaurant.r_name}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{restaurant.r_desc}</p>

                      <div className="space-y-2 mb-4">
                        <div className="flex items-start text-sm">
                          <span className="text-gray-500 mr-2">📍</span>
                          <span className="text-gray-700">{restaurant.r_location}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <span className="text-gray-500 mr-2">📞</span>
                          <span className="text-gray-700">{restaurant.phone}</span>
                        </div>
                      </div>

                      {/* Action Buttons */}
                      <div className="flex gap-2 pt-4 border-t border-gray-100 mt-auto">
                        <button 
                          onClick={() => router.push(`/RestaurantView/${restaurant.restaurant_id}`)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                        >
                          View Details
                        </button>
                        <button
                          onClick={() => handleLike(restaurant.restaurant_id)}
                          className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                            likes.includes(restaurant.restaurant_id)
                              ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          }`}
                        >
                          {likes.includes(restaurant.restaurant_id) ? '👍 Liked' : '👍 Like'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Empty State */}
            {!loading && restaurants.length === 0 && !error && (
              <div className="text-center py-16">
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No restaurants found</h3>
                <p className="text-gray-500">Check back later for new restaurants!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  )
}

export default RestaurantList 