import { useState } from 'react'

export default function AdvancedFilters({ filters, onFiltersChange, onApplyFilters, onClearFilters }) {
  const [isExpanded, setIsExpanded] = useState(false)

  const bodyTypes = [
    'Sedan', 'SUV', 'Sports', 'Convertible', 'Compact', 'Pick Up', 'Crossover', 'Electric'
  ]

  const sortOptions = [
    { value: 'endingSoon', label: 'Ending Soonest' },
    { value: 'newlyListed', label: 'Newly Listed' },
    { value: 'priceLow', label: 'Price: Low to High' },
    { value: 'priceHigh', label: 'Price: High to Low' }
  ]

  function handleFilterChange(field, value) {
    onFiltersChange(prev => ({
      ...prev,
      [field]: value
    }))
  }

  function handleSubmit(e) {
    e.preventDefault()
    onApplyFilters()
  }

  return (
    <div className="card p-6 mb-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-neutral-900">Advanced Filters</h3>
        <button
          type="button"
          onClick={() => setIsExpanded(!isExpanded)}
          className="text-primary hover:text-primary-600 transition-colors"
        >
          {isExpanded ? 'Hide Filters' : 'Show Filters'}
        </button>
      </div>

      {isExpanded && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Make Filter */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Make
              </label>
              <input
                type="text"
                className="input"
                placeholder="e.g., Toyota"
                value={filters.make || ''}
                onChange={(e) => handleFilterChange('make', e.target.value)}
              />
            </div>

            {/* Body Type Filter */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Body Type
              </label>
              <select
                className="input"
                value={filters.bodyType || ''}
                onChange={(e) => handleFilterChange('bodyType', e.target.value)}
              >
                <option value="">All Body Types</option>
                {bodyTypes.map(type => (
                  <option key={type} value={type}>{type}</option>
                ))}
              </select>
            </div>

            {/* Price Range */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Min Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">$</span>
                <input
                  type="number"
                  className="input pl-8"
                  placeholder="0"
                  value={filters.minPrice || ''}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Max Price
              </label>
              <div className="relative">
                <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-500">$</span>
                <input
                  type="number"
                  className="input pl-8"
                  placeholder="100000"
                  value={filters.maxPrice || ''}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Year Range */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Min Year
              </label>
              <input
                type="number"
                className="input"
                placeholder="1990"
                min="1990"
                max={new Date().getFullYear()}
                value={filters.minYear || ''}
                onChange={(e) => handleFilterChange('minYear', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Max Year
              </label>
              <input
                type="number"
                className="input"
                placeholder={new Date().getFullYear()}
                min="1990"
                max={new Date().getFullYear()}
                value={filters.maxYear || ''}
                onChange={(e) => handleFilterChange('maxYear', e.target.value)}
              />
            </div>

            {/* Mileage Range */}
            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Min Mileage
              </label>
              <input
                type="number"
                className="input"
                placeholder="0"
                value={filters.minMileage || ''}
                onChange={(e) => handleFilterChange('minMileage', e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-neutral-700 mb-2">
                Max Mileage
              </label>
              <input
                type="number"
                className="input"
                placeholder="200000"
                value={filters.maxMileage || ''}
                onChange={(e) => handleFilterChange('maxMileage', e.target.value)}
              />
            </div>
          </div>

          {/* Sort Options */}
          <div>
            <label className="block text-sm font-semibold text-neutral-700 mb-2">
              Sort By
            </label>
            <select
              className="input max-w-xs"
              value={filters.sort || 'endingSoon'}
              onChange={(e) => handleFilterChange('sort', e.target.value)}
            >
              {sortOptions.map(option => (
                <option key={option.value} value={option.value}>{option.label}</option>
              ))}
            </select>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4 border-t border-neutral-200">
            <button
              type="submit"
              className="btn-primary"
            >
              Apply Filters
            </button>
            <button
              type="button"
              onClick={onClearFilters}
              className="btn-outline"
            >
              Clear All
            </button>
          </div>
        </form>
      )}
    </div>
  )
}
