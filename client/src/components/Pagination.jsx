import React from 'react'
import { MdKeyboardArrowLeft, MdKeyboardArrowRight, MdMoreHoriz } from 'react-icons/md'

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pages = []
    const maxPagesToShow = 3 // how many middle pages to show

    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)

      let left = currentPage - 1
      let right = currentPage + 1

      if (currentPage <= 3) {
        left = 2
        right = 4
      } else if (currentPage >= totalPages - 2) {
        left = totalPages - 3
        right = totalPages - 1
      }

      if (left > 2) {
        pages.push('...')
      }

      for (let i = left; i <= right; i++) {
        if (i > 1 && i < totalPages) {
          pages.push(i)
        }
      }

      if (right < totalPages - 1) {
        pages.push('...')
      }

      pages.push(totalPages)
    }

    return pages
  }

  return (
    <div className="flex items-center justify-center gap-2 mt-10 pb-10">
      {/* Prev Arrow */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="p-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <MdKeyboardArrowLeft size={24} />
      </button>

      {/* Page numbers and ellipses */}
      {getPageNumbers().map((page, index) =>
        page === '...' ? (
          <div key={`ellipsis-${index}`} className="px-2 text-gray-400">
            <MdMoreHoriz size={20} />
          </div>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            className={`px-3 py-1 rounded font-medium transition ${
              page === currentPage
                ? 'bg-blue-500 text-white'
                : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
            }`}
          >
            {page}
          </button>
        )
      )}

      {/* Next Arrow */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="p-2 rounded bg-gray-100 text-gray-700 hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition"
      >
        <MdKeyboardArrowRight size={24} />
      </button>
    </div>
  )
}

export default Pagination