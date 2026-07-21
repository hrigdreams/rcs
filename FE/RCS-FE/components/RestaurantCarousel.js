const RestaurantCarousel = ({ children, isEmpty, emptyMessage }) => {
  return isEmpty ? (
    <div className="rounded-2xl border border-dashed border-gray-200 bg-white/70 px-6 py-10 text-center text-gray-500">
      {emptyMessage}
    </div>
  ) : (
    <div className="flex w-full min-w-0 gap-4 sm:gap-5 overflow-x-auto pb-3 snap-x snap-mandatory">
      {children}
    </div>
  )
}

export default RestaurantCarousel