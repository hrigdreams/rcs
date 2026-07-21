'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import axios from 'axios'
import Header from '../../../components/Header'
import UserSidebar from '../../../components/UserSidebar'
import { useAuth } from '@/context/AuthContext'
import BookingForm from '../../../components/BookinForm'

const RestaurantView = () => {
  const params = useParams()
  const restaurantId = params.id

  const [restaurant, setRestaurant] = useState(null)
  const [tags, setTags] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [isLiked, setIsLiked] = useState(false)
  const [isFavourite, setIsFavourite] = useState(false)

  const { user } = useAuth()
  const userId = user?.data?.id
  const API_URL = 'http://localhost:8000/api/restaurant'
  const TAG_API_URL = 'http://localhost:8000/api/tag'
  const LIKE_API_URL = 'http://localhost:8000/api/like'
  const FAV_API_URL = 'http://localhost:8000/api/favourite'

  useEffect(() => {
    if (restaurantId && userId) {
      fetchRestaurantData()
      fetchRestaurantTags()
      fetchUserInteractions()
    }
  }, [restaurantId, userId])

  const fetchRestaurantData = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/all`)
      const allRestaurants = response.data.data || []
      const found = allRestaurants.find(r => r.restaurant_id === parseInt(restaurantId))
      
      if (found) {
        setRestaurant(found)
        setError(null)
      } else {
        setError('Restaurant not found')
      }
    } catch (err) {
      console.error('Error fetching restaurant:', err)
      setError('Failed to load restaurant details')
    } finally {
      setLoading(false)
    }
  }

  const fetchRestaurantTags = async () => {
    try {
      const response = await axios.get(`${TAG_API_URL}/restaurant/${restaurantId}`)
      setTags(response.data.data || [])
    } catch (err) {
      console.error('Error fetching tags:', err)
    }
  }

  const fetchUserInteractions = async () => {
    try {
      const [likesRes, favRes] = await Promise.all([
        axios.get(`${LIKE_API_URL}/user/${userId}`),
        axios.get(`${FAV_API_URL}/user/${userId}`)
      ])

      const likedIds = likesRes.data.data?.map(item =>
        item.restaurant_id || item.restaurantId || item.id
      ) || []
      const favIds = favRes.data.data?.map(item =>
        item.restaurant_id || item.restaurantId || item.id
      ) || []

      setIsLiked(likedIds.includes(parseInt(restaurantId)))
      setIsFavourite(favIds.includes(parseInt(restaurantId)))
    } catch (err) {
      console.error('Error fetching user interactions:', err)
    }
  }

  const handleLike = async () => {
    try {
      if (isLiked) {
        await axios.post(`${LIKE_API_URL}/remove`, {
          userId: userId,
          restaurantId: parseInt(restaurantId)
        })
        setIsLiked(false)
      } else {
        await axios.post(`${LIKE_API_URL}/add`, {
          userId: userId,
          restaurantId: parseInt(restaurantId)
        })
        setIsLiked(true)
      }
    } catch (err) {
      console.error('Error updating like:', err)
    }
  }

  const handleFavourite = async () => {
    try {
      if (isFavourite) {
        await axios.post(`${FAV_API_URL}/remove`, {
          userId: userId,
          restaurantId: parseInt(restaurantId)
        })
        setIsFavourite(false)
      } else {
        await axios.post(`${FAV_API_URL}/add`, {
          userId: userId,
          restaurantId: parseInt(restaurantId)
        })
        setIsFavourite(true)
      }
    } catch (err) {
      console.error('Error updating favourite:', err)
    }
  }

  if (loading) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen bg-gray-50">
          <UserSidebar />
          <main className="flex-1 p-6 md:p-8">
            <div className="py-20 text-center">
              <div className="inline-block h-10 w-10 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
              <p className="mt-4 text-gray-600">Loading restaurant details...</p>
            </div>
          </main>
        </div>
      </>
    )
  }

  if (error || !restaurant) {
    return (
      <>
        <Header />
        <div className="flex min-h-screen bg-gray-50">
          <UserSidebar />
          <main className="flex-1 p-6 md:p-8">
            <div className="rounded-xl border border-red-200 bg-red-50 px-6 py-4 text-red-700">
              {error || 'Restaurant not found'}
            </div>
          </main>
        </div>
      </>
    )
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-50">
        <UserSidebar />

        <main className="flex-1 p-6 md:p-8">
          <div className="mx-auto max-w-2xl">
            <div className="overflow-hidden rounded-3xl border border-gray-100 bg-white shadow-lg">
              {/* Hero Section */}
              <div className="h-40 bg-linear-to-r from-emerald-600 to-teal-500" />

              {/* Content */}
              <div className="p-8 space-y-6">
                {/* Name */}
                <div>
                  <h1 className="text-4xl font-bold text-gray-900">{restaurant.r_name}</h1>
                </div>

                {/* Description */}
                <div>
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-widest mb-2">About</h2>
                  <p className="text-gray-600 leading-relaxed">{restaurant.r_desc}</p>
                </div>

                {/* Location & Phone */}
                <div className="space-y-3">
                  <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-widest">Contact</h2>
                  <div className="space-y-2 text-gray-600">
                    <p className="flex items-start gap-3">
                      <span className="text-xl">📍</span>
                      <span>{restaurant.r_location}</span>
                    </p>
                    <p className="flex items-start gap-3">
                      <span className="text-xl">📞</span>
                      <span>{restaurant.phone}</span>
                    </p>
                  </div>
                </div>

                {/* Tags */}
                {tags.length > 0 && (
                  <div>
                    <h2 className="text-sm font-semibold text-gray-700 uppercase tracking-widest mb-3">Tags</h2>
                    <div className="flex flex-wrap gap-2">
                      {tags.map(tag => (
                        <div
                          key={tag.tag_id}
                          className="flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-2 border border-emerald-200"
                        >
                          <span className="text-sm font-medium text-emerald-800">{tag.name}</span>
                          {tag.weight && (
                            <span className="text-xs text-emerald-600 font-semibold">
                              {tag.weight}
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="pt-4 flex gap-3">
                  <button
                    onClick={handleLike}
                    className={`flex-1 rounded-lg px-4 py-3 font-medium transition-colors ${
                      isLiked
                        ? 'bg-red-600 text-white hover:bg-red-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {isLiked ? '❤️ Liked' : '🤍 Like'}
                  </button>
                  <button
                    onClick={handleFavourite}
                    className={`flex-1 rounded-lg px-4 py-3 font-medium transition-colors ${
                      isFavourite
                        ? 'bg-amber-600 text-white hover:bg-amber-700'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {isFavourite ? '⭐ Saved' : '☆ Save'}
                  </button>
                </div>
                <BookingForm restaurantId={parseInt(restaurantId)} userId={userId} userRole={user?.data?.role || user?.role} />  
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  )
}

export default RestaurantView