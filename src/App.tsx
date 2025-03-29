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
import LoginPage from "./pages/login"
import AdminDashboard from "./pages/admin"
import AdminCreatePage from "./pages/admin/create"

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith("/admin")
  const isLoginRoute = location.pathname === "/login"

  return (
    <>
      {!isAdminRoute && !isLoginRoute && <MouseTracker />}
      {!isAdminRoute && !isLoginRoute && <Navigation />}
      <main className={`relative ${!isAdminRoute && !isLoginRoute ? "z-10" : ""}`}>
        <AnimatePresence mode="wait">
          <Routes location={location} key={location.pathname}>
            <Route path="/" element={<HomePage />} />
            <Route path="/projects" element={<ProjectsPage />} />
            <Route path="/resume" element={<ResumePage />} />
            <Route path="/contact" element={<ContactPage />} />
            <Route path="/testimonials" element={<TestimonialsPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/create" element={<AdminCreatePage />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  )
}

export default App

