'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import axios from 'axios'
import Header from '../../components/Header'
import UserSidebar from '../../components/UserSidebar'
import { useAuth } from '@/context/AuthContext'
import RestaurantCardHorizontal from '../../components/RestaurantCardHorizontal'
import RecommendationCard from '../../components/RecommendationCard'
import RestaurantCarousel from '../../components/RestaurantCarousel'

const Homepage = () => {
  const [likedRestaurants, setLikedRestaurants] = useState([])
  const [favouriteRestaurants, setFavouriteRestaurants] = useState([])
  const [contentBasedRecs, setContentBasedRecs] = useState([])
  const [collaborativeRecs, setCollaborativeRecs] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { user } = useAuth()
  const userId = user?.data?.id
  const router = useRouter()
  const API_URL = 'http://localhost:8000/api/restaurant'
  const LIKE_API_URL = 'http://localhost:8000/api/like'
  const FAV_API_URL = 'http://localhost:8000/api/favourite'
  const REC_URL = 'http://localhost:8000/api/recommendations/user'

  useEffect(() => {
  if (!userId) {
    setLoading(false)
    return
  }

  const init = async () => {
    const hasPreferences = await checkColdStartPreferences()
    if (hasPreferences) {
      fetchHomepageData()
    }
  }

  init()
}, [userId])
  const checkColdStartPreferences = async () => {
  try {
    const response = await axios.get(`http://localhost:8000/api/coldstart/${userId}`)
    const savedTags = response.data.data || []

    if (!savedTags.length) {
      router.push('/coldstart')
      return false
    }

    return true
  } catch (err) {
    router.push('/coldstart')
    return false
  }
}
  const fetchHomepageData = async () => {
    try {
      setLoading(true)

      const restaurantsResponse = await axios.get(`${API_URL}/all`)
      const allRestaurants = restaurantsResponse.data.data || []

      await fetchUserLikes(allRestaurants)
      await fetchUserFavourites(allRestaurants)
      await fetchContentBasedRecommendations()
      await fetchCollaborativeRecommendations()

      setError(null)
    } catch (err) {
      console.error('Error fetching homepage data:', err)
      setError('Failed to load your restaurant activity. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const fetchUserLikes = async (allRestaurants) => {
    try {
      const response = await axios.get(`${LIKE_API_URL}/user/${userId}`)
      const likedIds = response.data.data?.map(item =>
        item.restaurant_id || item.restaurantId || item.id
      ) || []

      const liked = allRestaurants.filter(restaurant =>
        likedIds.includes(restaurant.restaurant_id)
      )

      setLikedRestaurants(liked)
    } catch (err) {
      console.error('Error fetching likes:', err)
    }
  }

  const fetchUserFavourites = async (allRestaurants) => {
    try {
      const response = await axios.get(`${FAV_API_URL}/user/${userId}`)
      const favouriteIds = response.data.data?.map(item =>
        item.restaurant_id || item.restaurantId || item.id
      ) || []

      const favourited = allRestaurants.filter(restaurant =>
        favouriteIds.includes(restaurant.restaurant_id)
      )

      setFavouriteRestaurants(favourited)
    } catch (err) {
      console.error('Error fetching favourites:', err)
    }
  }

  const fetchContentBasedRecommendations = async () => {
    try {
      const response = await axios.get(`${REC_URL}/${userId}/content-based?k=5`)
      setContentBasedRecs(response.data.data || [])
    } catch (err) {
      console.error('Error fetching content-based recommendations:', err)
    }
  }

  const fetchCollaborativeRecommendations = async () => {
    try {
      const response = await axios.get(`${REC_URL}/${userId}/collaborative?k=5`)
      setCollaborativeRecs(response.data.data || [])
    } catch (err) {
      console.error('Error fetching collaborative recommendations:', err)
    }
  }

  return (
    <>
      <Header />
      <div className="flex min-h-screen bg-gray-50 overflow-x-hidden">
        <UserSidebar />

        <main className="flex-1 min-w-0 p-4 sm:p-6 md:p-8">
          <div className="mx-auto max-w-7xl space-y-6 sm:space-y-8">
            <section className="rounded-2xl sm:rounded-3xl bg-linear-to-r from-emerald-600 via-emerald-500 to-teal-500 px-5 sm:px-8 py-8 sm:py-10 text-white shadow-lg">
              <p className="text-xs sm:text-sm font-semibold uppercase tracking-widest text-emerald-100">HOME</p>
              <h1 className="mt-2 sm:mt-3 text-2xl sm:text-4xl font-bold">Your restaurant activity</h1>
              <p className="mt-2 sm:mt-3 max-w-2xl text-sm text-emerald-50 md:text-base">
                Browse the restaurants you liked and marked as favourites, all in one place.
              </p>
            </section>

            {error && (
              <div className="rounded-xl border border-red-200 bg-red-50 px-4 sm:px-6 py-3 sm:py-4 text-red-700 text-sm sm:text-base">
                {error}
              </div>
            )}

            {loading ? (
              <div className="py-16 sm:py-20 text-center">
                <div className="inline-block h-9 w-9 sm:h-10 sm:w-10 animate-spin rounded-full border-4 border-solid border-emerald-600 border-r-transparent"></div>
                <p className="mt-4 text-gray-600 text-sm sm:text-base">Loading your saved restaurants...</p>
              </div>
            ) : (
              <div className="space-y-8 sm:space-y-10">
                {/* Favourite Restaurants Section */}
                <section className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Favourite Restaurants</h2>
                      <p className="text-sm text-gray-500">
                        Quick access to the places you saved for later.
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm border border-gray-100">
                      {favouriteRestaurants.length} saved
                    </span>
                  </div>

                  <RestaurantCarousel 
                    isEmpty={favouriteRestaurants.length === 0}
                    emptyMessage="You have not added any favourites yet."
                  >
                    {favouriteRestaurants.map((restaurant) => (
                      <RestaurantCardHorizontal
                        key={`favourite-${restaurant.restaurant_id}`}
                        restaurant={restaurant}
                        gradientFrom="from-rose-500"
                        gradientTo="to-orange-400"
                      />
                    ))}
                  </RestaurantCarousel>
                </section>

                {/* Liked Restaurants Section */}
                <section className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Liked Restaurants</h2>
                      <p className="text-sm text-gray-500">
                        Places you reacted to and may want to revisit.
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm border border-gray-100">
                      {likedRestaurants.length} saved
                    </span>
                  </div>

                  <RestaurantCarousel 
                    isEmpty={likedRestaurants.length === 0}
                    emptyMessage="You have not liked any restaurants yet."
                  >
                    {likedRestaurants.map((restaurant) => (
                      <RestaurantCardHorizontal
                        key={`liked-${restaurant.restaurant_id  }`}
                        restaurant={restaurant}
                        gradientFrom="from-sky-500"
                        gradientTo="to-cyan-400"
                      />
                    ))}
                  </RestaurantCarousel>
                </section>

                {/* Content-based Recommendations Section */}
                <section className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recommended for You (Tag-based)</h2>
                      <p className="text-sm text-gray-500">
                        Suggestions based on restaurant tags you like.
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm border border-gray-100">
                      {contentBasedRecs.length} found
                    </span>
                  </div>

                  <RestaurantCarousel 
                    isEmpty={contentBasedRecs.length === 0}
                    emptyMessage="No tag-based recommendations available yet."
                  >
                    {contentBasedRecs.map((restaurant) => (
                      <RecommendationCard
                        key={`content-${restaurant.restaurant_id}`}
                        restaurant={restaurant}
                        gradientFrom="from-purple-500"
                        gradientTo="to-pink-400"
                        scoreColor="text-purple-600"
                        score={restaurant.similarity_score}
                      />
                    ))}
                  </RestaurantCarousel>
                </section>

                {/* Collaborative Recommendations Section */}
                <section className="space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 sm:gap-4">
                    <div>
                      <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Recommended for You (Similar Users)</h2>
                      <p className="text-sm text-gray-500">
                        Based on what similar users like (collaborative filtering).
                      </p>
                    </div>
                    <span className="w-fit rounded-full bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm border border-gray-100">
                      {collaborativeRecs.length} found
                    </span>
                  </div>

                  <RestaurantCarousel 
                    isEmpty={collaborativeRecs.length === 0}
                    emptyMessage="No collaborative recommendations available yet."
                  >
                    {collaborativeRecs.map((restaurant) => (
                      <RecommendationCard
                        key={`collab-${restaurant.restaurant_id}`}
                        restaurant={restaurant}
                        gradientFrom="from-indigo-500"
                        gradientTo="to-blue-400"
                        scoreColor="text-indigo-600"
                        score={restaurant.similarity_score}
                      />
                    ))}
                  </RestaurantCarousel>
                </section>
              </div>
            )}
          </div>
        </main>
      </div>
    </>
  )
}

export default Homepage