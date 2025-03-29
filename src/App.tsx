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
import NotFoundPage from "./pages/not-found"
import ForbiddenPage from "./pages/forbidden"

function App() {
  const location = useLocation()
  const isAdminRoute = location.pathname.startsWith("/admin")
  const isLoginRoute = location.pathname === "/login"
  const isErrorPage = location.pathname === "/404" || location.pathname === "/403"

  return (
    <>
      {!isAdminRoute && !isLoginRoute && !isErrorPage && <MouseTracker />}
      {!isAdminRoute && !isLoginRoute && !isErrorPage && <Navigation />}
      <main className={`relative ${!isAdminRoute && !isLoginRoute && !isErrorPage ? "z-10" : ""}`}>
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
            <Route path="/403" element={<ForbiddenPage />} />
            <Route path="/404" element={<NotFoundPage />} />
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </AnimatePresence>
      </main>
    </>
  )
}

export default App

