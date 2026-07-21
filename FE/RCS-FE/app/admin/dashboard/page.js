'use client'
import React, { useState, useEffect } from 'react'
import axios from 'axios'
import Header from '../../../components/Header'
import AdminSidebar from '../../../components/AdminSidebar'
import AdminAuth from '../../../components/AdminAuth'

const AdminRestaurants = () => {
  const [restaurants, setRestaurants] = useState([])
  const [tags, setTags] = useState([])
  const [showAddForm, setShowAddForm] = useState(false)
  const [showTagForm, setShowTagForm] = useState(false)
  const [showAssignTagModal, setShowAssignTagModal] = useState(false)
  const [selectedRestaurant, setSelectedRestaurant] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [originalTags, setOriginalTags] = useState([])
  const [originalTagWeights, setOriginalTagWeights] = useState({})
  const [newRestaurant, setNewRestaurant] = useState({
    r_name: '',
    r_desc: '',
    r_location: '',
    phone: '',
  })
  const [newTag, setNewTag] = useState({
    name: '',
  })
  const [selectedTags, setSelectedTags] = useState([])
  const [restaurantTags, setRestaurantTags] = useState({})
  const [tagWeights, setTagWeights] = useState({})

  const API_URL = 'http://localhost:8000/api/restaurant'
  const TAG_API_URL = 'http://localhost:8000/api/tag'

  useEffect(() => {
    fetchRestaurants()
    fetchTags()
  }, [])

  const fetchRestaurants = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`${API_URL}/all`)
      const data = response.data

      setRestaurants(data.data)
      
      // Fetch tags for each restaurant
      await fetchRestaurantTags(data.data)
      
      setError(null)
    } catch (err) {
      console.error('Error fetching restaurants:', err)
      setError(`Failed to load restaurants: ${err.response?.data?.message || err.message}`)
    } finally {
      setLoading(false)
    }
  }

  const fetchRestaurantTags = async (restaurants) => {
    try {
      const tagPromises = restaurants.map(restaurant => 
        axios.get(`${TAG_API_URL}/restaurant/${restaurant.restaurant_id}`)
          .then(res => ({ restaurantId: restaurant.restaurant_id, tags: res.data.data || [] }))
          .catch(() => ({ restaurantId: restaurant.restaurant_id, tags: [] }))
      )
      
      const results = await Promise.all(tagPromises)
      
      // Convert array to object for easy lookup
      const tagsMap = {}
      results.forEach(result => {
        tagsMap[result.restaurantId] = result.tags
      })
      
      console.log('Restaurant tags map:', tagsMap)
      setRestaurantTags(tagsMap)
    } catch (err) {
      console.error('Error fetching restaurant tags:', err)
    }
  }

  const fetchTags = async () => {
    try {
      const response = await axios.get(`${TAG_API_URL}/all`)
      setTags(response.data.data || [])
    } catch (err) {
      console.error('Error fetching tags:', err)
    }
  }

  const handleInputChange = (e) => {
    setNewRestaurant({
      ...newRestaurant,
      [e.target.name]: e.target.value
    })
  }

  const handleTagInputChange = (e) => {
    setNewTag({
      ...newTag,
      [e.target.name]: e.target.value
    })
  }

  const handleAddRestaurant = async (e) => {
    e.preventDefault()
    const normalizedName = newRestaurant.r_name.trim().toLowerCase()
    const duplicateExists = restaurants.some(
    restaurant => restaurant.r_name?.trim().toLowerCase() === normalizedName
  )

  if (duplicateExists) {
    setError('Restaurant already exists.')
    return
  }
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${API_URL}/create`, newRestaurant)
      
      const newData = response.data.data || response.data
      setRestaurants([...restaurants, newData])
      
      setNewRestaurant({ r_name: '', r_desc: '', r_location: '', phone: '' })
      setShowAddForm(false)
      
      alert('Restaurant added successfully!')
    } catch (err) {
      console.error('Error adding restaurant:', err)
      setError(err.response?.data?.message || 'Failed to add restaurant. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAddTag = async (e) => {
    e.preventDefault()

    const normalizedName = newTag.name.trim().toLowerCase()
    const duplicateExists = tags.some(
    tag => tag.name?.trim().toLowerCase() === normalizedName
    )
    
      if (duplicateExists) {
    setError('Tag already exists.')
    return
    }
    setLoading(true)
    setError(null)

    try {
      const response = await axios.post(`${TAG_API_URL}/create`, newTag)
      
      const newTagData = response.data.data || response.data
      setTags([...tags, newTagData])
      
      setNewTag({ name: '' })
      
      alert('Tag added successfully!')
      fetchTags()
    } catch (err) {
      console.error('Error adding tag:', err)
      setError(err.response?.data?.message || 'Failed to add tag. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteTag = async (tagId) => {
    if (!confirm('Are you sure you want to delete this tag? This will remove it from all restaurants.')) return

    try {
      setLoading(true)
      await axios.delete(`${TAG_API_URL}/delete/${tagId}`)
      setTags(tags.filter(tag => tag.tag_id !== tagId))
        
      alert('Tag deleted successfully!')
      fetchRestaurants()
    } catch (err) {
      console.error('Error deleting tag:', err)
      setError(err.response?.data?.message || 'Failed to delete tag')
    } finally {
      setLoading(false)
    }
  }

  const handleAssignTags = async () => {
  if (!selectedRestaurant) return

  try {
    setLoading(true)

    const toAssign = selectedTags.filter(id => !originalTags.includes(id))
    const toUnassign = originalTags.filter(id => !selectedTags.includes(id))

    const toUpdate = selectedTags.filter(id =>
      originalTags.includes(id) &&
      Number(tagWeights[id]) !== Number(originalTagWeights[id])
    )

    const assignPromises = toAssign.map(tagId =>
      axios.post(`${TAG_API_URL}/assign`, {
        restaurantId: selectedRestaurant.restaurant_id,
        tagId,
        weight: parseFloat(tagWeights[tagId]) ?? 1
      })
    )

    const updatePromises = toUpdate.map(tagId =>
      axios.put(`${TAG_API_URL}/weight`, {
        restaurantId: selectedRestaurant.restaurant_id,
        tagId,
        weight: parseFloat(tagWeights[tagId]) ?? 1
      })
    )

    const unassignPromises = toUnassign.map(tagId =>
      axios.post(`${TAG_API_URL}/remove`, {
      restaurantId: selectedRestaurant.restaurant_id,
      tagId
    })
  )

    await Promise.all([...assignPromises, ...updatePromises, ...unassignPromises])

    alert('Tags updated successfully!')
    setShowAssignTagModal(false)
    setSelectedTags([])
    setOriginalTags([])
    setTagWeights({})
    fetchRestaurants()
  } catch (err) {
    console.error('Error updating tags:', err)
    setError(err.response?.data?.message || 'Failed to update tags')
  } finally {
    setLoading(false)
  }
}

  const openAssignTagModal = (restaurant) => {
    setSelectedRestaurant(restaurant)
    const currentTags = restaurantTags[restaurant.restaurant_id] || []
    
    const tagIds = currentTags.map(tag => tag.tag_id)
    setSelectedTags(tagIds)
    setOriginalTags(tagIds)
    // Initialize weights for current tags
    const weights = {}
    currentTags.forEach(tag => {
      weights[tag.tag_id] = tag.weight || 1
    })
    setTagWeights(weights)
    setOriginalTagWeights(weights)
    setShowAssignTagModal(true)
  }

  const toggleTagSelection = (tagId) => {
    setSelectedTags(prev => 
      prev.includes(tagId) 
        ? prev.filter(id => id !== tagId)
        : [...prev, tagId]
    )
  }

  const handleWeightChange = (tagId, weight) => {
    setTagWeights(prev => ({
      ...prev,
      [tagId]: weight || 1
    }))
  }

  const handleDeleteRestaurant = async (id) => {
    if (!confirm('Are you sure you want to delete this restaurant?')) return

    try {
      await axios.delete(`${API_URL}/delete/${id}`)
      setRestaurants(restaurants.filter(restaurant => restaurant.restaurant_id !== id))
      
      alert('Restaurant deleted successfully!')
    } catch (err) {
      console.error('Error deleting restaurant:', err)
      setError(err.response?.data?.message || 'Failed to delete restaurant')
    }
  }

  return (
    <>
      <AdminAuth>
      <Header />
      <div className="flex min-h-screen bg-gray-100">
        <AdminSidebar />
        <div className="flex-1 p-8">
          <div className="max-w-6xl text-black mx-auto">
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-3xl font-bold">Manage Restaurants</h1>
              <div className="flex gap-3">
                <button 
                  onClick={() => setShowTagForm(!showTagForm)} 
                  className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition"
                >
                  {showTagForm ? 'Cancel' : '+ Add Tag'}
                </button>
                <button 
                  onClick={() => setShowAddForm(!showAddForm)} 
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                >
                  {showAddForm ? 'Cancel' : '+ Add Restaurant'}
                </button>
              </div>
            </div>

            {error && (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4 relative">
                <button onClick={() => setError(null)} className="absolute top-2 right-2 text-red-700">X</button>
                {error}
              </div>
            )}

            {showTagForm && (
              <>
                <div className="bg-white rounded-lg shadow-md p-6 mb-4">
                  <h2 className="text-xl font-semibold mb-4">Add New Tag</h2>
                  <form onSubmit={handleAddTag} className="flex flex-row gap-4">
                    <input
                      type="text"
                      name="name"
                      value={newTag.name}
                      onChange={handleTagInputChange}
                      placeholder="Tag Name (e.g., Vegan, Fast Food)"
                      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 flex-1"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
                    >
                      {loading ? 'Adding...' : 'Add Tag'}
                    </button>
                  </form>
                </div>

                {/* Tag List */}
                <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                  <h2 className="text-xl font-semibold mb-4">All Tags</h2>
                  {tags.length > 0 ? (
                    <div className="space-y-2">
                      {tags.map(tag => (
                        <div 
                          key={tag.tag_id} 
                          className="flex items-center justify-between p-3 border rounded-lg hover:bg-gray-50 transition"
                        >
                          <div className="flex items-center gap-3">
                            <span className="inline-block bg-purple-100 text-purple-800 text-xs px-3 py-1 rounded-full font-medium">
                              {tag.name}
                            </span>
                            <span className="text-sm text-gray-500">ID: {tag.tag_id}</span>
                          </div>
                          <button
                            onClick={() => handleDeleteTag(tag.tag_id)}
                            className="text-red-600 hover:text-red-800 font-medium px-3 py-1 rounded hover:bg-red-50 transition"
                            disabled={loading}
                          >
                            Delete
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-gray-500 text-center py-4">No tags available. Create your first tag!</p>
                  )}
                </div>
              </>
            )}

            {showAddForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-semibold mb-4">Add New Restaurant</h2>
                <form onSubmit={handleAddRestaurant} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="r_name"
                    value={newRestaurant.r_name}
                    onChange={handleInputChange}
                    placeholder="Restaurant Name"
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input
                    type="text"
                    name="r_location"
                    value={newRestaurant.r_location}
                    onChange={handleInputChange}
                    placeholder="Location"
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <input 
                    type="text" 
                    name="phone" 
                    value={newRestaurant.phone} 
                    onChange={handleInputChange} 
                    placeholder="Phone"
                    className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required 
                  />
                  <textarea
                    name="r_desc"
                    value={newRestaurant.r_desc}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Description"
                    className="col-span-1 md:col-span-3 w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <button
                    type="submit"
                    disabled={loading}
                    className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition md:col-span-3 disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {loading ? 'Adding...' : 'Add Restaurant'}
                  </button>
                </form>
              </div>
            )}

            {showAssignTagModal && (
              <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
                  <h2 className="text-xl font-semibold mb-4">
                    Assign Tags to {selectedRestaurant?.r_name}
                  </h2>
                  <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
                    {tags.map(tag => (
                      <div key={tag.tag_id} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50">
                        <input
                          type="checkbox"
                          checked={selectedTags.includes(tag.tag_id)}
                          onChange={() => toggleTagSelection(tag.tag_id)}
                          className="w-4 h-4 text-blue-600 rounded"
                        />
                        <div className="flex-1">
                          <div className="font-medium">{tag.name}</div>
                        </div>
                        {selectedTags.includes(tag.tag_id) && (
                          <div className="flex items-center gap-2">
                            <label className="text-sm text-gray-600">Weight:</label>
                            <input
                              type="number"
                              min="0"
                              max="100"
                              step="0.1"
                              value={tagWeights[tag.tag_id] || 1}
                              onChange={(e) => handleWeightChange(tag.tag_id, e.target.value)}
                              className="w-16 px-2 py-1 border rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                              placeholder="1"
                            />
                          </div>
                        )}
                      </div>
                    ))}
                    {tags.length === 0 && (
                      <p className="text-gray-500 text-center py-4">No tags available. Create tags first.</p>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setShowAssignTagModal(false)}
                      className="flex-1 bg-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-400 transition"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleAssignTags}
                      disabled={loading}
                      className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition disabled:bg-gray-400"
                    >
                      {loading ? 'Saving...' : 'Save Tags'}
                    </button>
                  </div>
                </div>
              </div>
            )}

            {loading && restaurants.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                Loading restaurants...
              </div>
            )}

            {!loading && Array.isArray(restaurants) && restaurants.length > 0 && (
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <table className="w-full">
                  <thead className="bg-black border-b">
                    <tr>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Name</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Description</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Location</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Phone</th>
                      <th className="px-6 py-3 text-left text-sm font-semibold text-gray-200">Tags</th>
                      <th className="px-6 py-3 text-right text-sm font-semibold text-gray-200">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {restaurants.map((restaurant, index) => {
                      const tags = restaurantTags[restaurant.restaurant_id] || []
                      return (
                        <tr key={restaurant.restaurant_id || index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 text-sm text-gray-900">{restaurant.r_name}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{restaurant.r_desc}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{restaurant.r_location}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">{restaurant.phone}</td>
                          <td className="px-6 py-4">
                            <div className="flex flex-wrap gap-1">
                              {tags.length > 0 ? (
                                tags.map(tag => (
                                  <span key={tag.tag_id} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                                    {tag.name}
                                  </span>
                                ))
                              ) : (
                                <span className="text-gray-400 text-xs">No tags</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => openAssignTagModal(restaurant)}
                              className="text-blue-600 hover:text-blue-800 font-medium mr-3"
                            >
                              Tags
                            </button>
                            <button
                              onClick={() => handleDeleteRestaurant(restaurant.restaurant_id)}
                              className="text-red-600 hover:text-red-800 font-medium"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
            )}

            {!loading && restaurants.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                No restaurants found. Add your first restaurant!
              </div>
            )}
          </div>
        </div>
      </div>
      </AdminAuth>
    </>
  )
}

export default AdminRestaurants