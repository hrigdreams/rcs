const RecommendationCard = ({ restaurant, gradientFrom, gradientTo, scoreColor, score }) => {
  const formatSimilarityScore = (score) => {
    if (!score && score !== 0) return 'N/A'
    return score > 1 ? Math.round(score) + '%' : Math.round(score * 100) + '%'
  }

  return (
    <article className="w-[85vw] max-w-[320px] sm:w-72 lg:w-80 shrink-0 snap-start overflow-hidden rounded-2xl border border-gray-100 bg-white shadow-sm flex flex-col">
      <div className={`relative flex h-28 sm:h-32 items-center justify-center bg-linear-to-r ${gradientFrom} ${gradientTo}`}>
        <div className={`absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs sm:text-sm font-bold ${scoreColor} shadow-md`}>
          🎯 {formatSimilarityScore(score)}
        </div>
      </div>

      <div className="flex min-h-[220px] flex-col grow p-4 sm:p-5">
        <div className="mb-3 sm:mb-4 space-y-2">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900">{restaurant.r_name}</h3>
          <p className="line-clamp-3 text-sm text-gray-600">{restaurant.r_desc}</p>
        </div>

        <div className="space-y-2 text-sm text-gray-600">
          <p>
            <span className="mr-2">📍</span>
            {restaurant.r_location}
          </p>
          <p>
            <span className="mr-2">📞</span>
            {restaurant.phone}
          </p>
        </div>

        <div className="mt-auto pt-4 sm:pt-5">
          <a
            href={`/RestaurantView/${restaurant.restaurant_id}`}
            className="inline-flex w-full items-center justify-center rounded-lg bg-emerald-600 px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-emerald-700"
          >
            View Details
          </a>
        </div>
      </div>
    </article>
  )
}

export default RecommendationCard