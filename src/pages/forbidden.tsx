"use client"

import { motion } from "framer-motion"
import { Link } from "react-router-dom"
import { ShieldAlert, Home } from "lucide-react"
import { PageTransition } from "../components/page-transition"

export default function ForbiddenPage() {
  return (
    <PageTransition>
      <div className="gradient-bg min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="glass-card rounded-2xl p-8 w-full max-w-md text-center"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2, type: "spring" }}
            className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <ShieldAlert className="text-red-500" size={32} />
          </motion.div>

          <h1 className="text-4xl font-bold mb-2">403</h1>
          <h2 className="text-2xl font-semibold mb-4">Access Forbidden</h2>

          <p className="text-gray-300 mb-8">
            You don't have permission to access this page. Please log in or contact the administrator.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/login"
              className="hover-element button-like flex items-center justify-center gap-2 px-6 py-3 bg-primary text-black rounded-full font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)]"
            >
              <ShieldAlert size={18} />
              <span>Login</span>
            </Link>

            <Link
              to="/"
              className="hover-element button-like flex items-center justify-center gap-2 px-6 py-3 border border-primary text-primary rounded-full font-medium transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]"
            >
              <Home size={18} />
              <span>Go Home</span>
            </Link>
          </div>
        </motion.div>
      </div>
    </PageTransition>
  )
}

