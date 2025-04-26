import React from 'react'
import { Link } from 'react-router-dom'
import { FaSadTear } from 'react-icons/fa' // import the icon

const NotFound = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-80px)] bg-gray-100 text-center px-4">
      {/* Icon */}
      <FaSadTear className="text-blue-400 text-8xl mb-6" />

      {/* Text */}
      <h1 className="text-6xl font-bold mb-4 text-gray-800">404</h1>
      <h2 className="text-2xl font-semibold mb-2 text-gray-700">Page Not Found</h2>
      <p className="text-gray-600 mb-6">
        The page you are looking for does not exist. <br />
        Please check the URL or return to the home page.
      </p>

      {/* Button */}
      <Link
        to="/"
        className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
      >
        Go to Home
      </Link>
    </div>
  )
}

export default NotFound