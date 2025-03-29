"use client"

import type React from "react"

import { useEffect } from "react"
import { useNavigate } from "react-router-dom"

export const AdminGuard = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate()

  useEffect(() => {
    const token = localStorage.getItem("auth_token")
    if (!token) {
      navigate("/login")
    }
  }, [navigate])

  return <>{children}</>
}

