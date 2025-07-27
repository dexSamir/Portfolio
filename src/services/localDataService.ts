import type { Project, Testimonial } from "@/types/data-types"
import {
  getProjects as apiGetProjects,
  getTestimonials as apiGetTestimonials,
  createProject as apiCreateProject,
  updateProject as apiUpdateProject,
  deleteProject as apiDeleteProject,
  createTestimonial as apiCreateTestimonial,
  deleteTestimonial as apiDeleteTestimonial,
  updateTestimonialStatus as apiUpdateTestimonialStatus,
} from "@/services/apiService"

export const getProjects = async (): Promise<Project[]> => {
  try {
    return await apiGetProjects()
  } catch (error) {
    console.error("Error getting projects from API:", error)
    return []
  }
}

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    return await apiGetTestimonials()
  } catch (error) {
    console.error("Error getting testimonials from API:", error)
    return []
  }
}

export const addProject = async (project: Omit<Project, "_id" | "createdAt">): Promise<Project> => {
  try {
    const newProject = await apiCreateProject(project)
    return newProject
  } catch (error) {
    console.error("Error adding project via API:", error)
    throw error
  }
}

export const updateProject = async (project: Project): Promise<Project> => {
  try {
    const updatedProject = await apiUpdateProject(project._id, {
      name: project.name,
      description: project.description,
      image: project.image,
      technologies: project.technologies,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
    })
    return updatedProject
  } catch (error) {
    console.error("Error updating project via API:", error)
    throw error
  }
}

export const addTestimonial = async (testimonial: Omit<Testimonial, "_id" | "createdAt">): Promise<Testimonial> => {
  try {
    const newTestimonial = await apiCreateTestimonial(testimonial)
    return newTestimonial
  } catch (error) {
    console.error("Error adding testimonial via API:", error)
    throw error
  }
}

export const approveTestimonial = async (id: string): Promise<Testimonial> => {
  try {
    const approvedTestimonial = await apiUpdateTestimonialStatus(id, "approved")
    return approvedTestimonial
  } catch (error) {
    console.error("Error approving testimonial via API:", error)
    throw error
  }
}

export const deleteProject = async (id: string): Promise<void> => {
  try {
    await apiDeleteProject(id)
  } catch (error) {
    console.error("Error deleting project via API:", error)
    throw error
  }
}

export const deleteTestimonial = async (id: string): Promise<void> => {
  try {
    await apiDeleteTestimonial(id)
  } catch (error) {
    console.error("Error deleting testimonial via API:", error)
    throw error
  }
}
