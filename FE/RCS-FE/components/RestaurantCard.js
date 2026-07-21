const RestaurantCard = ({ restaurant, isLiked, onRemoveFavourite, onToggleLike }) => {
  return (
    <div
      className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow overflow-hidden border border-gray-100 flex flex-col"
    >
      {/* Restaurant Header */}
      <div className="bg-linear-to-r from-emerald-500 to-emerald-600 h-32 flex items-center justify-center relative">
        {/* Remove from Favourites Button */}
        <button
          onClick={() => onRemoveFavourite(restaurant.restaurant_id)}
          className="absolute top-3 right-3 bg-white p-2 rounded-full hover:scale-110 transition-transform shadow-md"
          title="Remove from favourites"
        >
          ❤️
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
            onClick={() => window.location.href = `/RestaurantView/${restaurant.restaurant_id}`} 
            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            View Details
          </button>
          <button
            onClick={() => onToggleLike(restaurant.restaurant_id)}
            className={`py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
              isLiked
                ? 'bg-emerald-600 text-white hover:bg-emerald-700'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {isLiked ? '👍 Liked' : '👍 Like'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default RestaurantCard