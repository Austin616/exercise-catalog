import React from 'react';

const ViewControls = ({
  viewMode,
  onViewModeChange,
  itemsPerPage,
  onItemsPerPageChange
}) => {
  return (
    <div className="mb-6 flex justify-between items-center">
      <div className="flex items-center space-x-2">
        <button
          className={`p-2 rounded-md ${viewMode === 'grid' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          onClick={() => onViewModeChange('grid')}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
          </svg>
        </button>
        <button
          className={`p-2 rounded-md ${viewMode === 'list' ? 'bg-blue-100' : 'hover:bg-gray-100'}`}
          onClick={() => onViewModeChange('list')}
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Items Per Page Slider */}
      <div className="flex items-center space-x-4">
        <label className="text-sm text-gray-700">Items per page:</label>
        <input
          type="range"
          min="3"
          max="24"
          step="3"
          value={itemsPerPage}
          onChange={(e) => onItemsPerPageChange(Number(e.target.value))}
          className="w-32"
        />
        <span className="text-sm text-gray-700">{itemsPerPage}</span>
      </div>
    </div>
  );
};

export default ViewControls; 