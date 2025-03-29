"use client"

import type React from "react"

import { useState } from "react"
import { motion } from "framer-motion"
import { MapPin, Phone, Mail, Send, MessageSquare } from "lucide-react"
import { PageTransition } from "@/components/page-transition"
import { ScrollAnimation } from "@/components/scroll-animation"
import { PageSkeleton } from "@/components/loading-skeleton"

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  })

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const message = `Name: ${formData.name}%0AEmail: ${formData.email}%0ASubject: ${formData.subject}%0AMessage: ${formData.message}`

    window.open(`https://wa.me/994506229328?text=${message}`, "_blank")

    setFormData({
      name: "",
      email: "",
      subject: "",
      message: "",
    })
  }

  return (
    <PageSkeleton>
      <PageTransition>
        <div className="gradient-bg min-h-screen pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <ScrollAnimation direction="up">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">Contact Me</h1>
              <div className="h-1 w-20 bg-primary mb-8"></div>
              <p className="text-xl text-gray-300 mb-12 max-w-3xl">
                Feel free to reach out to me for any questions, project inquiries, or just to say hello!
              </p>
            </ScrollAnimation>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <ScrollAnimation direction="left" className="lg:col-span-1 space-y-6">
                <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <Phone className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Phone</h3>
                      <a
                        href="tel:+994506229328"
                        className="text-gray-300 hover:text-primary transition-colors hover-element"
                      >
                        +994 50 622 93 28
                      </a>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <Mail className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Email</h3>
                      <a
                        href="mailto:hebibovsamir26@gmail.com"
                        className="text-gray-300 hover:text-primary transition-colors hover-element"
                      >
                        hebibovsamir26@gmail.com
                      </a>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <MapPin className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">Location</h3>
                      <p className="text-gray-300">Baku, Azerbaijan</p>
                    </div>
                  </div>
                </div>

                <div className="glass-card rounded-xl p-6 transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/20 p-3 rounded-full">
                      <MessageSquare className="text-primary" size={24} />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-2">WhatsApp</h3>
                      <a
                        href="https://wa.me/994506229328"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-gray-300 hover:text-primary transition-colors hover-element flex items-center gap-2"
                      >
                        Message me on WhatsApp
                        <Send size={16} />
                      </a>
                    </div>
                  </div>
                </div>
              </ScrollAnimation>

              <ScrollAnimation direction="right" className="lg:col-span-2">
                <div className="glass-card rounded-xl p-8">
                  <h2 className="text-2xl font-semibold mb-6">Send Me a Message</h2>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label htmlFor="name" className="block text-sm font-medium mb-2">
                          Your Name
                        </label>
                        <input
                          type="text"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="John Doe"
                        />
                      </div>
                      <div>
                        <label htmlFor="email" className="block text-sm font-medium mb-2">
                          Your Email
                        </label>
                        <input
                          type="email"
                          id="email"
                          name="email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                          placeholder="john@example.com"
                        />
                      </div>
                    </div>

                    <div>
                      <label htmlFor="subject" className="block text-sm font-medium mb-2">
                        Subject
                      </label>
                      <input
                        type="text"
                        id="subject"
                        name="subject"
                        value={formData.subject}
                        onChange={handleChange}
                        required
                        className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Project Inquiry"
                      />
                    </div>

                    <div>
                      <label htmlFor="message" className="block text-sm font-medium mb-2">
                        Message
                      </label>
                      <textarea
                        id="message"
                        name="message"
                        value={formData.message}
                        onChange={handleChange}
                        required
                        rows={5}
                        className="w-full px-4 py-3 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        placeholder="Hello, I'd like to discuss a project..."
                      ></textarea>
                    </div>

                    <motion.button
                      type="submit"
                      className="hover-element button-like bg-primary text-black px-8 py-4 rounded-full font-medium transition-all duration-500 hover:scale-105 hover:shadow-[0_0_20px_rgba(0,255,0,0.3)] flex items-center gap-2"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Send via WhatsApp <Send size={18} />
                    </motion.button>
                  </form>
                </div>
              </ScrollAnimation>
            </div>
          </div>
        </div>
      </PageTransition>
    </PageSkeleton>
  )
}

