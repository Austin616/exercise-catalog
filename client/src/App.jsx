import React from 'react'
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home/Home'
import Exercises from './pages/Exercises/Exercises'
import About from './pages/About/About'
import Search from './pages/Search/Search'
import MuscleGroup from './pages/Exercises/MuscleGroup'
import ExerciseInstance from './pages/Exercises/ExerciseInstance'
import Layout from './components/Layout'
import NotFound from './pages/NotFound'
import "./App.css"

const App = () => {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-grow">
          <Routes>
            <Route path="/" element={<Layout><Home /></Layout>} />
            <Route path="/exercises" element={<Layout><Exercises /></Layout>} />
            <Route path="/about" element={<Layout><About /></Layout>} />
            <Route path="/search" element={<Layout><Search /></Layout>} />
            <Route path="*" element={<Layout><NotFound/></Layout>} />
            <Route path="/exercises/:id" element={<Layout><MuscleGroup/></Layout>} />
            <Route path="/exercises/instance/:id" element={<Layout><ExerciseInstance/></Layout>} />
          </Routes>
        </main>
        <Footer />
      </div>
    </BrowserRouter>
  )
}

export default App
