"use client"

import { useState, useEffect } from "react"
import { Github, ExternalLink, FolderGit2 } from "lucide-react"
import { PageTransition } from "../components/page-transition"
import { ScrollAnimation, StaggerContainer, StaggerItem } from "../components/scroll-animation"
import { PageSkeleton } from "../components/loading-skeleton"
import { getProjects } from "../services/localDataService"
import type { Project } from "../types/data-types"

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const projectsData = await getProjects()
        setProjects(projectsData)
      } catch (error) {
        console.error("Error fetching projects:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchProjects()
  }, [])

  return (
    <PageSkeleton>
      <PageTransition>
        <div className="gradient-bg min-h-screen pt-24 pb-16 px-4">
          <div className="container mx-auto">
            <ScrollAnimation direction="up">
              <h1 className="text-4xl md:text-5xl font-bold mb-4">My Projects</h1>
              <div className="h-1 w-20 bg-primary mb-8"></div>
              <p className="text-xl text-gray-300 mb-12 max-w-3xl">
                Here are some of the projects I've worked on. Each project represents my skills and experience in
                different technologies.
              </p>
            </ScrollAnimation>

            {loading ? (
              <div className="flex justify-center items-center py-20">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
              </div>
            ) : projects.length > 0 ? (
              <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((project) => (
                  <StaggerItem key={project.id}>
                    <div className="glass-card rounded-xl overflow-hidden h-full flex flex-col transition-all duration-300 hover:shadow-[0_0_20px_rgba(0,255,0,0.2)]">
                      {project.image && (
                        <div className="h-48 overflow-hidden">
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
                      <div className="p-6 flex-1 flex flex-col">
                        <div className="flex-1">
                          <div className="flex justify-between items-start mb-4">
                            <h3 className="text-xl font-semibold">{project.title}</h3>
                            <FolderGit2 className="text-primary" size={24} />
                          </div>
                          <p className="text-gray-300 mb-6">{project.description}</p>
                          <div className="flex flex-wrap gap-2 mb-6">
                            {project.technologies.map((tech) => (
                              <span key={tech} className="text-xs px-3 py-1 rounded-full bg-primary/20 text-primary">
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
                <h2 className="text-2xl font-semibold mb-2">No projects yet</h2>
                <p className="text-gray-300 text-center max-w-md">
                  I'm currently working on some exciting projects. Check back soon to see what I've been building!
                </p>
              </div>
            )}
          </div>
        </div>
      </PageTransition>
    </PageSkeleton>
  )
}

