"use client"

import { Routes, Route, useLocation } from "react-router-dom"
import { AnimatePresence } from "framer-motion"
import { MouseTracker } from "./components/mouse-tracker"
import { Navigation } from "./components/navigation"
import HomePage from "./pages/home"
import ProjectsPage from "./pages/projects"
import ResumePage from "./pages/resume"
import ContactPage from "./pages/contact"
import TestimonialsPage from "./pages/testimonials"

function App() {
  const location = useLocation()

  return (
    <>
      <MouseTracker />
      <Navigation />
      <main className="relative z-10">
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  )
}

export default App

