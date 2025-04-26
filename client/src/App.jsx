import React from 'react'
import { BrowserRouter, BrowserRouter as Router } from 'react-router-dom'
import { Routes, Route } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home/Home'
import Exercises from './pages/Exercises/Exercises'
import About from './pages/About/About'
import Search from './pages/Search/Search'
import MuscleGroup from './pages/Exercises/MuscleGroup'
import NotFound from './pages/NotFound'
import "./App.css"


const App = () => {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/exercises" element={<Exercises />} />
        <Route path="/about" element={<About />} />
        <Route path="/search" element={<Search />} />
        <Route path="*" element={<NotFound/>} />
        <Route path="/exercises/:id" element={<MuscleGroup/>} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
