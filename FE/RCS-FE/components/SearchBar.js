import React,{useState,useMemo} from 'react'

const SearchBar = ({restaurants=[],onSearch}) => {
    const [searchQuery,setSearchQuery]=useState('')
    const [isSelected,setIsSelected]=useState(false)

    const filteredResults = useMemo(()=>{
        if(!searchQuery.trim()) return restaurants

        return restaurants.filter(restaurants => 
            restaurants.r_name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    },[searchQuery,restaurants])
    const handleClear = () =>{
        setSearchQuery('')
        setIsSelected(false)
        onSearch(restaurants)
    }
    const handleSelect = (restaurant) =>{
        setSearchQuery(restaurant.r_name)
        setIsSelected(true)
        onSearch([restaurant])
    }
  return (
    <div className="relative w-full mx-auto mb-6">
      <div className="flex items-center bg-white border border-gray-500 rounded-lg px-4 py-2">
        <input
          type="text"
          placeholder="Search restaurants by name..."
          value={searchQuery}
          onChange={(e) => {
            const newQuery=e.target.value
            setSearchQuery(e.target.value)
            setIsSelected(false)
            
            const newFiltered = !newQuery.trim() ? restaurants : 
                restaurants.filter(r => r.r_name.toLowerCase().includes(newQuery.toLowerCase()))
            onSearch?.(newFiltered)
          }}
          className="w-full outline-none text-gray-700"
        />
        {searchQuery && (
          <button
            onClick={handleClear}
            className="ml-2 text-gray-500 hover:text-gray-700"
          >
            ✕
          </button>
        )}
      </div>

      {/* Dropdown Results */}
      {searchQuery &&!isSelected && filteredResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg shadow-lg max-h-64 overflow-y-auto z-10">
          {filteredResults.map(restaurant => (
            <button
              key={restaurant.restaurant_id}
              onClick={() => handleSelect(restaurant)}
              className="w-full text-left px-4 py-3 hover:bg-gray-100 border-b border-gray-200 last:border-b-0"
            >
              <div className="font-medium text-gray-900">{restaurant.r_name}</div>
              <div className="text-sm text-gray-500">{restaurant.r_location}</div>
            </button>
          ))}
        </div>
      )}

      {/* No Results Message */}
      {searchQuery && filteredResults.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-300 rounded-lg px-4 py-3 text-gray-500 text-sm">
          No restaurants found
        </div>
      )}
    </div>
  )
}

export default SearchBar
