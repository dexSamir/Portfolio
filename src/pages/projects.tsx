"use client"

import { useState, useEffect } from "react"
import { Github, ExternalLink, FolderGit2, ChevronDown, ChevronUp, Filter } from "lucide-react"
import { PageTransition } from "@/components/page-transition"
import { ScrollAnimation, StaggerContainer, StaggerItem } from "@/components/scroll-animation"
import { PageSkeleton } from "@/components/loading-skeleton"
import { getProjects } from "@/services/localDataService"
import type { Project } from "@/types/data-types"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [expandedDescriptions, setExpandedDescriptions] = useState<Record<string, boolean>>({})
  const [selectedTechs, setSelectedTechs] = useState<string[]>([])
  const [availableTechs, setAvailableTechs] = useState<string[]>([])
  const [showFilters, setShowFilters] = useState(false)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects()
        setProjects(projectsData)
        setFilteredProjects(projectsData)

        const allTechs = new Set<string>()
        projectsData.forEach((project) => {
          project.technologies.forEach((tech) => {
            allTechs.add(tech)
          })
        })

        setAvailableTechs(Array.from(allTechs).sort())
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  useEffect(() => {
    if (selectedTechs.length === 0) {
      setFilteredProjects(projects)
    } else {
      const filtered = projects.filter((project) => selectedTechs.some((tech) => project.technologies.includes(tech)))
      setFilteredProjects(filtered)
    }
  }, [selectedTechs, projects])

  const toggleDescription = (projectId: string) => {
    setExpandedDescriptions((prev) => ({
      ...prev,
      [projectId]: !prev[projectId],
    }))
  }

  const toggleTechFilter = (tech: string) => {
    setSelectedTechs((prev) => (prev.includes(tech) ? prev.filter((t) => t !== tech) : [...prev, tech]))
  }

  const clearFilters = () => {
    setSelectedTechs([])
  }

  const truncateText = (text: string, maxLength = 100) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength) + "..."
  }

  return (
    <PageSkeleton>
      <PageTransition>
        <div className="gradient-bg min-h-screen pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <ScrollAnimation direction="up">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">My Projects</h1>
              <div className="h-1 w-20 bg-primary mb-8"></div>
              <p className="text-xl text-gray-300 mb-6 max-w-3xl">
                Here are some of the projects I've worked on. Each project represents my skills and experience in
                different technologies.
              </p>

              <div className="mb-8">
                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2 px-4 py-2 bg-black/30 hover:bg-black/40 rounded-lg transition-colors mb-4"
                >
                  <Filter size={18} />
                  <span>Filter by Technology</span>
                  {showFilters ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                </button>

                {showFilters && (
                  <div className="glass-card rounded-xl p-4 mb-4 animate-fadeIn">
                    <div className="flex justify-between items-center mb-3">
                      <h3 className="text-lg font-medium">Technologies</h3>
                      {selectedTechs.length > 0 && (
                        <button onClick={clearFilters} className="text-sm text-primary hover:underline">
                          Clear all
                        </button>
                      )}
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {availableTechs.map((tech) => (
                        <button
                          key={tech}
                          onClick={() => toggleTechFilter(tech)}
                          className={`px-3 py-1 rounded-full text-sm transition-all ${
                            selectedTechs.includes(tech)
                              ? "bg-primary text-black font-medium"
                              : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                          }`}
                        >
                          {tech}
                        </button>
                      ))}
                    </div>
                    {selectedTechs.length > 0 && (
                      <p className="text-sm text-gray-400 mt-3">Showing projects with: {selectedTechs.join(", ")}</p>
                    )}
                  </div>
                )}
              </div>
            </ScrollAnimation>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : filteredProjects.length > 0 ? (
              <StaggerContainer className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
                {filteredProjects.map((project) => (
                  <StaggerItem key={project.id}>
                    <div className="glass-card rounded-xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]">
                      {project.image && (
                        <div className="h-40 overflow-hidden">
                          <img
                            src={project.image || "/placeholder.svg"}
                            alt={project.title}
                            className="w-full h-full object-cover transition-transform duration-500 hover:scale-110"
                            onError={(e) => {
                              ;(e.target as HTMLImageElement).src = "/placeholder.svg"
                            }}
                          />
                        </div>
                      )}
                      <div className="p-4 flex-1 flex flex-col">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-lg font-semibold">{project.title}</h3>
                            <FolderGit2 className="text-primary" size={20} />
                          </div>
                          <div className="mb-4">
                            <p className="text-gray-300 text-sm">
                              {expandedDescriptions[project.id]
                                ? project.description
                                : truncateText(project.description, 100)}
                            </p>
                            {project.description.length > 100 && (
                              <button
                                onClick={() => toggleDescription(project.id)}
                                className="text-primary text-xs flex items-center mt-1 hover:underline"
                              >
                                {expandedDescriptions[project.id] ? (
                                  <>
                                    <ChevronUp size={14} className="mr-1" />
                                    Show Less
                                  </>
                                ) : (
                                  <>
                                    <ChevronDown size={14} className="mr-1" />
                                    Show More
                                  </>
                                )}
                              </button>
                            )}
                          </div>
                          <div className="flex flex-wrap gap-1 mb-4">
                            {project.technologies.map((tech) => (
                              <span key={tech} className="text-xs px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                                {tech}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between mt-auto">
                          {project.githubUrl && (
                            <a
                              href={project.githubUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover-element flex items-center gap-2 text-sm text-gray-300 hover:text-primary transition-colors"
                            >
                              <Github size={18} />
                              Code
                            </a>
                          )}
                          {project.liveUrl && (
                            <a
                              href={project.liveUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover-element flex items-center gap-2 text-sm text-gray-300 hover:text-primary transition-colors"
                            >
                              <ExternalLink size={18} />
                              Live Demo
                            </a>
                          )}
                        </div>
                      </div>
                    </div>
                  </StaggerItem>
                ))}
              </StaggerContainer>
            ) : (
              <div className="flex flex-col items-center justify-center py-20">
                <FolderGit2 className="text-primary mb-4" size={64} />
                <h2 className="text-2xl font-semibold mb-2">No projects found</h2>
                <p className="text-gray-300 text-center max-w-md">
                  {selectedTechs.length > 0
                    ? "No projects match your selected filters. Try selecting different technologies or clear all filters."
                    : "I'm currently working on some exciting projects. Check back soon to see what I've been building!"}
                </p>
                {selectedTechs.length > 0 && (
                  <button
                    onClick={clearFilters}
                    className="mt-4 px-4 py-2 bg-primary text-black rounded-lg hover:bg-primary/90 transition-colors"
                  >
                    Clear Filters
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </PageSkeleton>
  )
}

