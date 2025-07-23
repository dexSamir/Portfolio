
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
  Code,
  Menu,
  X,
  Github,
  ExternalLink,
  Bell,
} from "lucide-react"
import { AdminGuard } from "@/components/admin-guard"
import {
  getProjects,
  getTestimonials,
  deleteProject,
  deleteTestimonial,
  getPendingTestimonials,
  approveTestimonial,
  deletePendingTestimonial,
} from "@/services/localDataService"
import type { Project, Testimonial, PendingTestimonial } from "@/types/data-types"
import type React from "react"

import { Upload, Download } from "lucide-react"
import { DataFileGuide } from "@/components/data-file-guide"
import { CodeExportDialog } from "@/components/code-export-dialog"
import { DeleteConfirmDialog } from "@/components/delete-confirm-dialog"
import { PendingTestimonials } from "@/components/pending-testimonials"

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [projects, setProjects] = useState<Project[]>([])
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [pendingTestimonials, setPendingTestimonials] = useState<PendingTestimonial[]>([])
  const [user, setUser] = useState<{ name: string; role: string } | null>(null)
  const [loading, setLoading] = useState(true)
  const [importError, setImportError] = useState<string | null>(null)
  const [importSuccess, setImportSuccess] = useState<string | null>(null)
  const [isCodeExportOpen, setIsCodeExportOpen] = useState(false)
  const [projectsCode, setProjectsCode] = useState("")
  const [testimonialsCode, setTestimonialsCode] = useState("")
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [itemToDelete, setItemToDelete] = useState<{
    id: string
    type: "project" | "testimonial" | "pendingTestimonial"
    name: string
  } | null>(null)

  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const [projectsData, testimonialsData, pendingTestimonialsData] = await Promise.all([
          getProjects(),
          getTestimonials(),
          getPendingTestimonials(),
        ])

        setProjects(projectsData)
        setTestimonials(testimonialsData)
        setPendingTestimonials(pendingTestimonialsData)

        const userStr = localStorage.getItem("user")
        if (userStr) {
          setUser(JSON.parse(userStr))
        }
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarOpen(false)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  const handleDeleteClick = (id: string, type: "project" | "testimonial" | "pendingTestimonial", name: string) => {
    setItemToDelete({ id, type, name })
    setDeleteDialogOpen(true)
  }

  const handleConfirmDelete = async () => {
    if (!itemToDelete) return

    try {
      if (itemToDelete.type === "project") {
        await deleteProject(itemToDelete.id)
        setProjects(projects.filter((project) => project.id !== itemToDelete.id))
      } else if (itemToDelete.type === "testimonial") {
        await deleteTestimonial(itemToDelete.id)
        setTestimonials(testimonials.filter((testimonial) => testimonial.id !== itemToDelete.id))
      } else if (itemToDelete.type === "pendingTestimonial") {
        await deletePendingTestimonial(itemToDelete.id)
        setPendingTestimonials(pendingTestimonials.filter((testimonial) => testimonial.id !== itemToDelete.id))
      }
    } catch (error) {
      console.error(`Error deleting ${itemToDelete.type}:`, error)
      alert(`Failed to delete ${itemToDelete.type}. Please try again.`)
    } finally {
      setDeleteDialogOpen(false)
      setItemToDelete(null)
    }
  }

  const handleApproveTestimonial = async (id: string) => {
    try {
      await approveTestimonial(id)

      setPendingTestimonials(pendingTestimonials.filter((testimonial) => testimonial.id !== id))

      const updatedTestimonials = await getTestimonials()
      setTestimonials(updatedTestimonials)

      alert("Testimonial approved successfully!")
    } catch (error) {
      console.error("Error approving testimonial:", error)
      alert("Failed to approve testimonial. Please try again.")
    }
  }

  const handleEditProject = (project: Project) => {
    localStorage.setItem("editingProject", JSON.stringify(project))
    navigate(`/admin/create?type=project&edit=true`)
  }

  const handleLogout = () => {
    localStorage.removeItem("user")
    navigate("/login")
  }

  const handleExportData = () => {
    const data = {
      projects,
      testimonials,
      pendingTestimonials,
    }

    const jsonData = JSON.stringify(data, null, 2)
    const blob = new Blob([jsonData], { type: "application/json" })
    const url = URL.createObjectURL(blob)

    const downloadLink = document.createElement("a")
    downloadLink.href = url
    downloadLink.download = "portfolio-data.json"
    downloadLink.click()

    URL.revokeObjectURL(url)
  }

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportError(null)
    setImportSuccess(null)

    const reader = new FileReader()

    reader.onload = (event) => {
      try {
        const data = JSON.parse(event.target?.result as string)

        if (!data.projects || !data.testimonials) {
          setImportError("Invalid JSON structure.")
          return
        }

        localStorage.setItem("projects", JSON.stringify(data.projects))
        localStorage.setItem("testimonials", JSON.stringify(data.testimonials))

        if (data.pendingTestimonials) {
          localStorage.setItem("pendingTestimonials", JSON.stringify(data.pendingTestimonials))
        }

        setImportSuccess("Datas imported successfully! Reloading...")

        setTimeout(() => {
          window.location.reload()
        }, 1500)
      } catch (error) {
        console.error("Error parsing JSON:", error)
        setImportError("JSON parsing error. Please check the file format.")
      }
    }

    reader.onerror = () => {
      setImportError("Dosya okunamadı")
    }

    reader.readAsText(file)
  }

  const handleGenerateTypeScriptCode = async () => {
    const projectsCodeStr = `import type { Project } from "@/types/data-types"

export const projects: Project[] = ${JSON.stringify(projects, null, 2)}`

    const testimonialsCodeStr = `import type { Testimonial } from "@/types/data-types"

export const testimonials: Testimonial[] = ${JSON.stringify(testimonials, null, 2)}`

    setProjectsCode(projectsCodeStr)
    setTestimonialsCode(testimonialsCodeStr)
    setIsCodeExportOpen(true)
  }

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen)
  }

  if (loading) {
    return (
      <AdminGuard>
        <div className="min-h-screen gradient-bg flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
        </div>
      </AdminGuard>
    )
  }

  return (
    <AdminGuard>
      <div className="min-h-screen flex relative">
        <button
          onClick={toggleSidebar}
          className="lg:hidden fixed top-4 left-4 z-50 p-2 rounded-md bg-black/50 text-white"
        >
          {sidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        <div className="hidden lg:block w-64 bg-black/80 backdrop-blur-md border-r border-gray-800 fixed h-full">
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
                  {pendingTestimonials.length > 0 && (
                    <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                      {pendingTestimonials.length}
                    </span>
                  )}
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

        {sidebarOpen && (
          <div className="lg:hidden fixed inset-0 z-40 bg-black/80 backdrop-blur-md">
            <div className="p-6 pt-16">
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
                    onClick={() => {
                      setActiveTab("dashboard")
                      setSidebarOpen(false)
                    }}
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
                    onClick={() => {
                      setActiveTab("projects")
                      setSidebarOpen(false)
                    }}
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
                    onClick={() => {
                      setActiveTab("testimonials")
                      setSidebarOpen(false)
                    }}
                    className={`w-full flex items-center gap-3 px-6 py-3 hover:bg-primary/10 transition-colors ${
                      activeTab === "testimonials" ? "bg-primary/20 border-l-4 border-primary" : ""
                    }`}
                  >
                    <MessageSquareQuote size={20} className={activeTab === "testimonials" ? "text-primary" : ""} />
                    <span>Testimonials</span>
                    {pendingTestimonials.length > 0 && (
                      <span className="ml-auto bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {pendingTestimonials.length}
                      </span>
                    )}
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => {
                      setActiveTab("settings")
                      setSidebarOpen(false)
                    }}
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
        )}

        <div className="w-full lg:ml-64 p-4 lg:p-8 gradient-bg">
          {activeTab === "dashboard" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <h2 className="text-3xl font-bold mb-6 mt-12 lg:mt-0">Dashboard</h2>

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

                <div className="glass-card rounded-xl p-6 relative">
                  <h3 className="text-xl font-semibold mb-2">Pending Reviews</h3>
                  <p className="text-4xl font-bold text-primary">{pendingTestimonials.length}</p>
                  <p className="text-gray-400 mt-2">Testimonials awaiting approval</p>

                  {pendingTestimonials.length > 0 && (
                    <div className="absolute top-4 right-4">
                      <div className="animate-ping absolute h-3 w-3 rounded-full bg-red-500 opacity-75"></div>
                      <div className="relative rounded-full h-3 w-3 bg-red-500"></div>
                    </div>
                  )}
                </div>
              </div>

              <div className="glass-card rounded-xl p-6 mb-6">
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
                    onClick={handleGenerateTypeScriptCode}
                    className="flex items-center gap-2 px-4 py-2 bg-primary/20 hover:bg-primary/30 rounded-lg transition-colors"
                  >
                    <Code size={18} className="text-primary" />
                    <span>Generate TypeScript Code</span>
                  </button>

                  {pendingTestimonials.length > 0 && (
                    <button
                      onClick={() => setActiveTab("testimonials")}
                      className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 rounded-lg transition-colors text-red-300"
                    >
                      <Bell size={18} />
                      <span>Review Pending Testimonials</span>
                      <span className="ml-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                        {pendingTestimonials.length}
                      </span>
                    </button>
                  )}
                </div>
              </div>

              <div className="glass-card rounded-xl p-6">
                <h3 className="text-xl font-semibold mb-4">Data Management</h3>

                {importError && (
                  <div className="bg-red-500/20 border border-red-500/50 text-red-200 px-4 py-3 rounded-lg mb-6">
                    {importError}
                  </div>
                )}

                {importSuccess && (
                  <div className="bg-green-500/20 border border-green-500/50 text-green-200 px-4 py-3 rounded-lg mb-6">
                    {importSuccess}
                  </div>
                )}

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={handleExportData}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
                  >
                    <Download size={18} />
                    <span>Export Data (JSON)</span>
                  </button>

                  <label className="flex items-center gap-2 px-4 py-2 bg-green-500/20 hover:bg-green-500/30 text-green-300 rounded-lg transition-colors cursor-pointer">
                    <Upload size={18} />
                    <span>Import Data (JSON)</span>
                    <input type="file" accept=".json" onChange={handleImportData} className="hidden" />
                  </label>
                </div>

                <div className="mt-4 text-sm text-gray-400">
                  <p className="mb-2">
                    <strong>Export:</strong> Download your portfolio data as a JSON file. Keep this file as a backup.
                  </p>
                  <p>
                    <strong>Import:</strong> Upload a previously exported JSON file to restore your portfolio data.
                  </p>
                </div>
              </div>
              <DataFileGuide />
            </motion.div>
          )}

          {activeTab === "projects" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.3 }}>
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 mt-12 lg:mt-0">
                <h2 className="text-3xl font-bold mb-4 sm:mb-0">Projects</h2>
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
                  <div className="hidden md:block overflow-x-auto">
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
                                    onError={(e) => {
                                      ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                                    }}
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
                                  <span
                                    key={tech}
                                    className="px-2 py-1 text-xs rounded-full bg-primary/20 text-primary"
                                  >
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
                              <button
                                className="text-blue-400 hover:text-blue-300 mr-3"
                                onClick={() => handleEditProject(project)}
                              >
                                <Edit size={18} />
                              </button>
                              <button
                                className="text-red-400 hover:text-red-300"
                                onClick={() => handleDeleteClick(project.id, "project", project.title)}
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="md:hidden space-y-4 p-4">
                    {projects.map((project) => (
                      <div key={project.id} className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          {project.image ? (
                            <img
                              src={project.image || "/placeholder.svg"}
                              alt={project.title}
                              className="w-12 h-12 rounded object-cover mr-3"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded bg-primary/20 flex items-center justify-center mr-3">
                              <FolderGit2 size={24} className="text-primary" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium text-lg">{project.title}</h3>
                          </div>
                        </div>

                        <p className="text-sm text-gray-300 mb-3 line-clamp-2">{project.description}</p>

                        <div className="flex flex-wrap gap-1 mb-3">
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

                        <div className="flex justify-between items-center">
                          <div className="flex gap-2">
                            {project.githubUrl && (
                              <a
                                href={project.githubUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-primary text-sm flex items-center"
                              >
                                <Github size={14} className="mr-1" />
                                GitHub
                              </a>
                            )}
                            {project.liveUrl && (
                              <a
                                href={project.liveUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-gray-400 hover:text-primary text-sm flex items-center"
                              >
                                <ExternalLink size={14} className="mr-1" />
                                Live
                              </a>
                            )}
                          </div>
                          <div className="flex">
                            <button
                              className="text-blue-400 hover:text-blue-300 mr-3 p-1"
                              onClick={() => handleEditProject(project)}
                            >
                              <Edit size={18} />
                            </button>
                            <button
                              className="text-red-400 hover:text-red-300 p-1"
                              onClick={() => handleDeleteClick(project.id, "project", project.title)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 mt-12 lg:mt-0">
                <h2 className="text-3xl font-bold mb-4 sm:mb-0">Testimonials</h2>
                <button
                  onClick={() => navigate("/admin/create?type=testimonial")}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
                >
                  <Plus size={18} />
                  <span>Add Testimonial</span>
                </button>
              </div>

              {pendingTestimonials.length > 0 && (
                <PendingTestimonials
                  pendingTestimonials={pendingTestimonials}
                  handleApproveTestimonial={handleApproveTestimonial}
                  handleDeleteClick={handleDeleteClick}
                />
              )}

              <div className="mb-4">
                <h3 className="text-xl font-semibold mb-4">Approved Testimonials</h3>
              </div>

              {testimonials.length > 0 ? (
                <div className="glass-card rounded-xl overflow-hidden">
                  <div className="hidden md:block overflow-x-auto">
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
                                    onError={(e) => {
                                      ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                                    }}
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
                              <button
                                className="text-red-400 hover:text-red-300"
                                onClick={() => handleDeleteClick(testimonial.id, "testimonial", testimonial.name)}
                              >
                                <Trash2 size={18} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="md:hidden space-y-4 p-4">
                    {testimonials.map((testimonial) => (
                      <div key={testimonial.id} className="bg-black/30 rounded-lg p-4">
                        <div className="flex items-center mb-3">
                          {testimonial.avatar ? (
                            <img
                              src={testimonial.avatar || "/placeholder.svg"}
                              alt={testimonial.name}
                              className="w-12 h-12 rounded-full object-cover mr-3"
                              onError={(e) => {
                                ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                              }}
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mr-3">
                              <span className="text-primary font-semibold text-lg">{testimonial.name.charAt(0)}</span>
                            </div>
                          )}
                          <div>
                            <h3 className="font-medium">{testimonial.name}</h3>
                            <p className="text-sm text-gray-400">
                              {testimonial.position}, {testimonial.company}
                            </p>
                          </div>
                        </div>

                        <p className="text-sm text-gray-300 mb-3 line-clamp-3">{testimonial.content}</p>

                        <div className="flex justify-between items-center">
                          <div className="flex">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                size={16}
                                className={i < testimonial.rating ? "text-yellow-400 fill-yellow-400" : "text-gray-500"}
                              />
                            ))}
                          </div>
                          <div className="flex">
                            <button className="text-blue-400 hover:text-blue-300 mr-3 p-1">
                              <Edit size={18} />
                            </button>
                            <button
                              className="text-red-400 hover:text-red-300 p-1"
                              onClick={() => handleDeleteClick(testimonial.id, "testimonial", testimonial.name)}
                            >
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
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
              <h2 className="text-3xl font-bold mb-6 mt-12 lg:mt-0">Settings</h2>

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
                        defaultValue={user?.name || "Admin"}
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

      <CodeExportDialog
        isOpen={isCodeExportOpen}
        onClose={() => setIsCodeExportOpen(false)}
        projectsCode={projectsCode}
        testimonialsCode={testimonialsCode}
      />

      <DeleteConfirmDialog
        isOpen={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.name || ""}
        itemType={itemToDelete?.type === "pendingTestimonial" ? "testimonial" : itemToDelete?.type || "item"}
      />
    </AdminGuard>
  )
}
