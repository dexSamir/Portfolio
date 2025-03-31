"use client"

import { useState, useEffect } from "react"
import { MessageSquareQuote, Star } from "lucide-react"
import { PageTransition } from "../components/page-transition"
import { ScrollAnimation, StaggerContainer, StaggerItem } from "../components/scroll-animation"
import { PageSkeleton } from "../components/loading-skeleton"
import { getTestimonials } from "../services/localDataService"
import type { Testimonial } from "../types/data-types"

export default function TestimonialsPage() {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const testimonialsData = await getTestimonials()
        setTestimonials(testimonialsData)
      } catch (error) {
        console.error("Error fetching testimonials:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTestimonials()
  }, [])

  return (
    <PageSkeleton>
      <PageTransition>
        <div className="gradient-bg min-h-screen pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <ScrollAnimation direction="up">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Testimonials</h1>
              <div className="h-1 w-20 bg-primary mb-8"></div>
              <p className="text-xl text-gray-300 mb-12 max-w-3xl">
                Here's what people are saying about my work and collaboration experience.
              </p>
            </ScrollAnimation>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : testimonials.length > 0 ? (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {testimonials.map((testimonial) => (
                  <StaggerItem key={testimonial.id}>
                    <div className="glass-card rounded-xl p-6 h-full flex flex-col transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]">
                      <MessageSquareQuote className="text-primary mb-4" size={32} />
                      <p className="text-gray-300 mb-6 flex-1">{testimonial.content}</p>

                      <div className="flex mb-4">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            size={16}
                            className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}
                          />
                        ))}
                      </div>

                      <div className="flex items-center gap-4">
                        {testimonial.avatar ? (
                          <img
                            src={testimonial.avatar || "/placeholder.svg"}
                            alt={testimonial.name}
                            className="w-14 h-14 rounded-full object-cover"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                            }}
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-primary font-semibold text-lg">{testimonial.name.charAt(0)}</span>
                          </div>
                        )}
                        <div>
                          <h3 className="font-semibold">{testimonial.name}</h3>
                          <p className="text-sm text-gray-400">
                            {testimonial.position}, {testimonial.company}
                          </p>
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <MessageSquareQuote className="text-primary mb-4" size={64} />
                <h2 className="text-2xl font-semibold mb-2">No testimonials yet</h2>
                <p className="text-gray-300 text-center max-w-md">
                  I'm looking forward to collecting feedback from clients and collaborators. Check back soon!
                </p>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </PageSkeleton>
  )
}

