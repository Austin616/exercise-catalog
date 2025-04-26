import React, { useState } from 'react';
import { IoClose } from 'react-icons/io5';

const SearchBar = ({ 
  onSearch, 
  onFilter, 
  onSort,
  searchPlaceholder = "Search...",
  filterOptions = {},
  sortOptions = []
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState(
    Object.keys(filterOptions).reduce((acc, key) => {
      acc[key] = 'all';
      return acc;
    }, {})
  );
  const [sortBy, setSortBy] = useState(sortOptions[0]?.value || '');
  const [sortOrder, setSortOrder] = useState('asc');

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
    onSearch('');
  };

  const handleFilterChange = (category, value) => {
    const newFilters = { ...filters, [category]: value };
    setFilters(newFilters);
    onFilter(newFilters);
  };

  const handleSortChange = (e) => {
    const value = e.target.value;
    setSortBy(value);
    onSort(value, sortOrder);
  };

  const handleSortOrderChange = (e) => {
    const value = e.target.value;
    setSortOrder(value);
    onSort(sortBy, value);
  };

  return (
    <div className="w-full max-w-4xl mb-8">
      {/* Search Input */}
      <div className="mb-4 relative">
        <input
          type="text"
          placeholder={searchPlaceholder}
          value={searchTerm}
          onChange={handleSearchChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
        />
        {searchTerm && (
          <button
            onClick={handleClearSearch}
            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            aria-label="Clear search"
          >
            <IoClose size={20} />
          </button>
        )}
      </div>

      {/* Filters and Sort */}
      <div className="flex flex-wrap gap-4">
        {/* Filter Dropdowns */}
        {Object.entries(filterOptions).map(([category, options]) => (
          <div key={category} className="flex-1 min-w-[200px]">
            <select
              value={filters[category]}
              onChange={(e) => handleFilterChange(category, e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All {category}</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option.charAt(0).toUpperCase() + option.slice(1)}
                </option>
              ))}
            </select>
          </div>
        ))}

        {/* Sort Dropdowns */}
        {sortOptions.length > 0 && (
          <>
            <div className="flex-1 min-w-[200px]">
              <select
                value={sortBy}
                onChange={handleSortChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                {sortOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    Sort by {option.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex-1 min-w-[200px]">
              <select
                value={sortOrder}
                onChange={handleSortOrderChange}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default SearchBar; 