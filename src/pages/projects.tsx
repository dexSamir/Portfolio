import { ExternalLink, Github } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../components/ui/card"
import { PageTransition } from "../components/page-transition"
import { ScrollAnimation, StaggerContainer, StaggerItem } from "../components/scroll-animation"
import { PageSkeleton } from "../components/loading-skeleton"

export default function ProjectsPage() {
  const projects = [
    {
      title: "E-Commerce Platform",
      description: "A full-stack e-commerce platform built with ASP.NET Core and React.",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["ASP.NET Core", "React", "MS SQL", "Redux"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Task Management App",
      description: "A task management application with real-time updates and collaboration features.",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["React", "Node.js", "PostgreSQL", "Socket.io"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Portfolio Website",
      description: "A responsive portfolio website with animations and interactive elements.",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["Next.js", "Tailwind CSS", "Framer Motion"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Weather Application",
      description: "A weather application that provides real-time weather data and forecasts.",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["React", "OpenWeather API", "Tailwind CSS"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Blog Platform",
      description: "A modern blog platform with advanced editing and commenting features.",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["Next.js", "MongoDB", "Tailwind CSS"],
      liveUrl: "#",
      githubUrl: "#",
    },
    {
      title: "Restaurant Booking System",
      description: "A comprehensive booking system for restaurants with table management.",
      image: "/placeholder.svg?height=300&width=500",
      tags: ["ASP.NET Core", "SQL Server", "React"],
      liveUrl: "#",
      githubUrl: "#",
    },
  ]

  return (
    <PageSkeleton>
      <PageTransition>
        <div className="gradient-bg min-h-screen">
          <div className="container mx-auto px-4 pt-24 pb-16">
            <ScrollAnimation>
              <h1 className="text-4xl md:text-6xl font-bold mb-3 text-glow">My Projects</h1>
              <div className="h-1 w-20 bg-primary mb-4"></div>
              <p className="text-xl text-gray-300 mb-12">A showcase of my recent work and projects</p>
            </ScrollAnimation>

            <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <StaggerItem key={index}>
                  <Card className="hover-element bg-black/50 backdrop-blur-sm border-primary/20 overflow-hidden transition-all duration-500 h-full">
                    <div className="relative h-48 w-full overflow-hidden">
                      <img
                        src={project.image || "/placeholder.svg"}
                        alt={project.title}
                        className="w-full h-full object-cover transition-all duration-1000 hover:scale-110"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent opacity-70"></div>
                    </div>

                    <CardHeader>
                      <CardTitle className="text-xl">{project.title}</CardTitle>
                      <CardDescription className="text-gray-400">{project.description}</CardDescription>
                    </CardHeader>

                    <CardContent>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {project.tags.map((tag, tagIndex) => (
                          <span
                            key={tagIndex}
                            className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full transition-all duration-300 hover:bg-primary/40"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    </CardContent>

                    <CardFooter className="flex justify-between">
                      <Button
                        variant="outline"
                        size="sm"
                        className="hover-element border-primary/50 text-primary hover:bg-primary/20 transition-all duration-300"
                        asChild
                      >
                        <a href={project.githubUrl} target="_blank" rel="noopener noreferrer">
                          <Github className="mr-2 h-4 w-4" />
                          Code
                        </a>
                      </Button>

                      <Button
                        variant="default"
                        size="sm"
                        className="hover-element bg-primary text-black hover:bg-primary/80 transition-all duration-300"
                        asChild
                      >
                        <a href={project.liveUrl} target="_blank" rel="noopener noreferrer">
                          <ExternalLink className="mr-2 h-4 w-4" />
                          Live Demo
                        </a>
                      </Button>
                    </CardFooter>
                  </Card>
                </StaggerItem>
              ))}
            </StaggerContainer>
          </div>
        </div>
      </PageTransition>
    </PageSkeleton>
  )
}

