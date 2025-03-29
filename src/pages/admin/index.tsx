"use client"

import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { motion } from "framer-motion"
import {
  LayoutDashboard,
  FolderGit2,
  MessageSquareQuote,
  Settings,
  LogOut,
  Plus,
  Trash2,
  Edit,
  User,
  Star,
} from "lucide-react"
import { AdminGuard } from "@/components/admin-guard"

interface Project {
  id: string
  title: string
  description: string
  image?: string
  technologies: string[]
  githubUrl?: string
  liveUrl?: string
}

interface Testimonial {
  id: string
  name: string
  position: string
  company: string
  avatar?: string
  content: string
  rating: number
}

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [projects, setProjects] = useState<Project[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const userStr = localStorage.getItem("user")
    if (userStr) {
      setUser(JSON.parse(userStr))
    }

    setProjects([])
    setTestimonials([])
  }, [])

  const handleLogout = () => {
    localStorage.removeItem("auth_token")
    localStorage.removeItem("user")
    navigate("/login")
  }

  return (
    <AdminGuard>
      <div className="min-h-screen flex">
        <div className="w-64 bg-black/80 backdrop-blur-md border-r border-gray-800 fixed h-full">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-primary">Admin Panel</h1>
            <div className="mt-6 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center">
                <User className="text-primary" size={20} />
              </div>
              <div>
                <p className="font-medium">{user?.name || "Admin"}</p>
                <p className="text-xs text-gray-400 capitalize">{user?.role || "admin"}</p>
              </div>
            </div>
          </div>

          <nav className="mt-6">
            <ul className="space-y-2">
              <li>
                <button
                  onClick={() => setActiveTab("dashboard")}
                  className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-primary/10 transition-colors ${
                    activeTab === "dashboard" ? "bg-primary/20 border-l-4 border-primary" : ""
                  }`}
                >
                  <LayoutDashboard size={20} className={activeTab === "dashboard" ? "text-primary" : ""} />
                  <span>Dashboard</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("projects")}
                  className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-primary/10 transition-colors ${
                    activeTab === "projects" ? "bg-primary/20 border-l-4 border-primary" : ""
                  }`}
                >
                  <FolderGit2 size={20} className={activeTab === "projects" ? "text-primary" : ""} />
                  <span>Projects</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("testimonials")}
                  className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-primary/10 transition-colors ${
                    activeTab === "testimonials" ? "bg-primary/20 border-l-4 border-primary" : ""
                  }`}
                >
                  <MessageSquareQuote size={20} className={activeTab === "testimonials" ? "text-primary" : ""} />
                  <span>Testimonials</span>
                </button>
              </li>
              <li>
                <button
                  onClick={() => setActiveTab("settings")}
                  className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-primary/10 transition-colors ${
                    activeTab === "settings" ? "bg-primary/20 border-l-4 border-primary" : ""
                  }`}
                >
                  <Settings size={20} className={activeTab === "settings" ? "text-primary" : ""} />
                  <span>Settings</span>
                </button>
              </li>
            </ul>
          </nav>

          <div className="absolute bottom-0 w-full p-6">
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-2 rounded-lg bg-red-500/20 hover:bg-red-500/30 text-red-300 transition-colors"
            >
              <LogOut size={20} />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="ml-64 flex-1 p-8 gradient-bg">
          {activeTab === "dashboard" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <h2 className="text-3xl font-bold mb-6">Dashboard</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-2">Projects</h3>
                  <p className="text-4xl font-bold text-primary">{projects.length}</p>
                  <p className="text-gray-400 mt-2">Total projects in your portfolio</p>
                </div>

                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-2">Testimonials</h3>
                  <p className="text-4xl font-bold text-primary">{testimonials.length}</p>
                  <p className="text-gray-400 mt-2">Total client testimonials</p>
                </div>

                <div className="glass-card rounded-xl p-6">
                  <h3 className="text-xl font-semibold mb-2">Last Login</h3>
                  <p className="text-xl font-medium">{new Date().toLocaleDateString()}</p>
                  <p className="text-gray-400 mt-2">{new Date().toLocaleTimeString()}</p>
                </div>
              </div>

              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Quick Actions</h3>
                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate("/admin/create?type=project")}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors"
                  >
                    <Plus size={18} className="text-primary" />
                    <span>Add New Project</span>
                  </button>

                  <button
                    onClick={() => navigate("/admin/create?type=testimonial")}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors"
                  >
                    <Plus size={18} className="text-primary" />
                    <span>Add New Testimonial</span>
                  </button>

                  <button
                    onClick={() => setActiveTab("settings")}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors"
                  >
                    <Settings size={18} className="text-primary" />
                    <span>Update Profile</span>
                  </button>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === "projects" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Projects</h2>
                <button
                  onClick={() => navigate("/admin/create?type=project")}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus size={18} />
                  <span>Add Project</span>
                </button>
              </div>

              {projects.length > 0 ? (
                <div className="glass-card rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-black/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Technologies
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Links
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {projects.map((project) => (
                        <tr key={project.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {project.image ? (
                                <img
                                  src={project.image || "/placeholder.svg"}
                                  alt={project.title}
                                  className="w-10 h-10 rounded object-cover mr-3"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded bg-primary/20 flex items-center justify-center mr-3">
                                  <FolderGit2 size={20} className="text-primary" />
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{project.title}</div>
                                <div className="text-sm text-gray-400 truncate max-w-xs">{project.description}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex flex-wrap gap-1">
                              {project.technologies.slice(0, 3).map((tech) => (
                                <span key={tech} className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary">
                                  {tech}
                                </span>
                              ))}
                              {project.technologies.length > 3 && (
                                <span className="px-2 py-1 text-xs rounded-full bg-gray-700 text-gray-300">
                                  +{project.technologies.length - 3}
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex gap-2">
                              {project.githubUrl && (
                                <a
                                  href={project.githubUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-primary"
                                >
                                  GitHub
                                </a>
                              )}
                              {project.liveUrl && (
                                <a
                                  href={project.liveUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-gray-400 hover:text-primary"
                                >
                                  Live Demo
                                </a>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button className="text-blue-400 hover:text-blue-300 mr-3">
                              <Edit size={18} />
                            </button>
                            <button className="text-red-400 hover:text-red-300">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="glass-card rounded-xl p-8 text-center">
                  <FolderGit2 size={48} className="text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No projects yet</h3>
                  <p className="text-gray-400 mb-6">Add your first project to showcase your work</p>
                  <button
                    onClick={() => navigate("/admin/create?type=project")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus size={18} />
                    <span>Add Your First Project</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "testimonials" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold">Testimonials</h2>
                <button
                  onClick={() => navigate("/admin/create?type=testimonial")}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus size={18} />
                  <span>Add Testimonial</span>
                </button>
              </div>

              {testimonials.length > 0 ? (
                <div className="glass-card rounded-xl overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-black/50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Client
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Content
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Rating
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-300 uppercase tracking-wider">
                          Actions
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {testimonials.map((testimonial) => (
                        <tr key={testimonial.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              {testimonial.avatar ? (
                                <img
                                  src={testimonial.avatar || "/placeholder.svg"}
                                  alt={testimonial.name}
                                  className="w-10 h-10 rounded-full object-cover mr-3"
                                />
                              ) : (
                                <div className="w-10 h-10 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                                  <span className="text-primary font-semibold">{testimonial.name.charAt(0)}</span>
                                </div>
                              )}
                              <div>
                                <div className="font-medium">{testimonial.name}</div>
                                <div className="text-sm text-gray-400">
                                  {testimonial.position}, {testimonial.company}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm text-gray-300 truncate max-w-xs">{testimonial.content}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <Star
                                  key={i}
                                  size={16}
                                  className={
                                    i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"
                                  }
                                />
                              ))}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right">
                            <button className="text-blue-400 hover:text-blue-300 mr-3">
                              <Edit size={18} />
                            </button>
                            <button className="text-red-400 hover:text-red-300">
                              <Trash2 size={18} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="glass-card rounded-xl p-8 text-center">
                  <MessageSquareQuote size={48} className="text-primary mx-auto mb-4" />
                  <h3 className="text-xl font-semibold mb-2">No testimonials yet</h3>
                  <p className="text-gray-400 mb-6">Add your first client testimonial</p>
                  <button
                    onClick={() => navigate("/admin/create?type=testimonial")}
                    className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    <Plus size={18} />
                    <span>Add Your First Testimonial</span>
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {activeTab === "settings" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <h2 className="text-3xl font-bold mb-6">Settings</h2>

              <div className="glass-card rounded-xl p-6 mb-6">
                <h3 className="text-xl font-semibold mb-4">Profile Settings</h3>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium mb-2">
                        Name
                      </label>
                      <input
                        type="text"
                        id="name"
                        className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        defaultValue="Admin"
                      />
                    </div>
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium mb-2">
                        Email
                      </label>
                      <input
                        type="email"
                        id="email"
                        className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                        defaultValue="admin@example.com"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="bio" className="block text-sm font-medium mb-2">
                      Bio
                    </label>
                    <textarea
                      id="bio"
                      rows={4}
                      className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      defaultValue="Portfolio admin and developer."
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Save Changes
                  </button>
                </form>
              </div>

              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Change Password</h3>
                <form className="space-y-4">
                  <div>
                    <label htmlFor="current-password" className="block text-sm font-medium mb-2">
                      Current Password
                    </label>
                    <input
                      type="password"
                      id="current-password"
                      className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="new-password" className="block text-sm font-medium mb-2">
                        New Password
                      </label>
                      <input
                        type="password"
                        id="new-password"
                        className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label htmlFor="confirm-password" className="block text-sm font-medium mb-2">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        id="confirm-password"
                        className="w-full px-4 py-2 bg-black/30 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition-all"
                      />
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Update Password
                  </button>
                </form>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </AdminGuard>
  )
}

