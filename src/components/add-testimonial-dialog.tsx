"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { X, Star, Send, Upload, AlertCircle, CheckCircle } from "lucide-react"
import { addPendingTestimonial } from "@/services/localDataService"

interface AddTestimonialDialogProps {
  isOpen: boolean
  onClose: () => void
}

export const AddTestimonialDialog = ({ isOpen, onClose }: AddTestimonialDialogProps) => {
  const [formData, setFormData] = useState({
    name: "",
    position: "",
    company: "",
    avatar: "",
    content: "",
    rating: 5,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const handleAvatarUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    if (file.size > 10 * 1024 * 1024) {
      setError("File length must be less than 10MB")
      return
    }

    const reader = new FileReader()
    reader.onload = (event) => {
      if (event.target?.result) {
        setFormData((prev) => ({ ...prev, avatar: event.target?.result as string }))
        setError(null)
      }
    }
    reader.onerror = () => {
      setError("The file could not be read")
    }
    reader.readAsDataURL(file)
  }

  const handleRatingChange = (rating: number) => {
    setFormData((prev) => ({ ...prev, rating }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) {
      setError("Name is required")
      return false
    }
    if (!formData.position.trim()) {
      setError("Position is required")
      return false
    }
    if (!formData.company.trim()) {
      setError("Company is required")
      return false
    }
    if (!formData.content.trim()) {
      setError("Content is required")
      return false
    }

    return true
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setError(null)
    setSuccess(null)

    try {
      await addPendingTestimonial({
        name: formData.name,
        position: formData.position,
        company: formData.company,
        avatar: formData.avatar || undefined,
        content: formData.content,
        rating: formData.rating,
      })

      setSuccess("Your comment has been submitted successfully! It will be published once approved.")

      setTimeout(() => {
        setFormData({
          name: "",
          position: "",
          company: "",
          avatar: "",
          content: "",
          rating: 5,
        })

        setTimeout(() => {
          onClose()
          setSuccess(null)
        }, 1500)
      }, 2000)
    } catch (error) {
      console.error("Error submitting testimonial:", error)
      setError("An error occurred while submitting your comment. Please try again later.")
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/70 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", damping: 20, stiffness: 300 }}
            className="bg-gray-900 border border-gray-800 rounded-xl shadow-xl w-full max-w-lg relative z-10 overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-primary to-primary/50"></div>
              <div className="p-6 flex items-start justify-between">
                <h3 className="text-xl font-bold text-white">Add Testimonial</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors p-1 rounded-full hover:bg-gray-800"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="px-6 pb-6">
              {error && (
                <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6 flex items-center">
                  <AlertCircle size={18} className="mr-2 flex-shrink-0" />
                  <span>{error}</span>
                </div>
              )}

              {success && (
                <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg mb-6 flex items-center">
                  <CheckCircle size={18} className="mr-2 flex-shrink-0" />
                  <span>{success}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium mb-2">
                      Name *
                    </label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="John Doe"
                    />
                  </div>
                  <div>
                    <label htmlFor="avatar" className="block text-sm font-medium mb-2">
                      Profile Photo
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        id="avatar"
                        name="avatar"
                        value={formData.avatar}
                        onChange={handleChange}
                        className="flex-1 px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="https://example.com/avatar.jpg"
                      />
                      <label
                        htmlFor="avatar-upload"
                        className="p-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors cursor-pointer"
                      >
                        <Upload size={18} className="text-primary" />
                      </label>
                      <input
                        id="avatar-upload"
                        type="file"
                        accept="image/*"
                        ref={fileInputRef}
                        onChange={handleAvatarUpload}
                        className="hidden"
                      />
                    </div>
                    {formData.avatar && (
                      <div className="mt-2 relative w-10 h-10">
                        <img
                          src={formData.avatar || "/placeholder.svg"}
                          alt="Avatar Preview"
                          className="w-full h-full object-cover rounded-full"
                          onError={(e) => {
                            ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                            setError(
                              "The image could not be loaded. Please check the URL or upload a different image.",
                            )
                          }}
                        />
                      </div>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="position" className="block text-sm font-medium mb-2">
                      Position *
                    </label>
                    <input
                      type="text"
                      id="position"
                      name="position"
                      value={formData.position}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="Software Developer"
                    />
                  </div>
                  <div>
                    <label htmlFor="company" className="block text-sm font-medium mb-2">
                      Company *
                    </label>
                    <input
                      type="text"
                      id="company"
                      name="company"
                      value={formData.company}
                      onChange={handleChange}
                      required
                      className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      placeholder="ABC Company"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="content" className="block text-sm font-medium mb-2">
                    Content *
                  </label>
                  <textarea
                    id="content"
                    name="content"
                    value={formData.content}
                    onChange={handleChange}
                    required
                    rows={4}
                    className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    placeholder="Share your experience..."
                  ></textarea>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Evaluation *</label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => handleRatingChange(star)}
                        className="focus:outline-none"
                      >
                        <Star
                          size={24}
                          className={star <= formData.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex justify-end pt-4">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 bg-gray-700 text-gray-200 rounded-lg hover:bg-gray-600 transition-colors mr-4"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    {isSubmitting ? (
                      <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-black"></div>
                    ) : (
                      <>
                        <Send size={18} />
                        <span>Send</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
