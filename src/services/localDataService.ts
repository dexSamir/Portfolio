import type { Project, Testimonial, Technology } from "@/types/data-types";
import {
  getProjects as apiGetProjects,
  getApprovedTestimonials,
  getAllTestimonials,
  getTestimonialsByStatus,
  createProject as apiCreateProject,
  updateProject as apiUpdateProject,
  deleteProject as apiDeleteProject,
  createTestimonial as apiCreateTestimonial,
  deleteTestimonial as apiDeleteTestimonial,
  approveTestimonial as apiApproveTestimonial,
  denyTestimonial as apiDenyTestimonial,
  createTechnology as apiCreateTechnology,
} from "@/services/apiService";

export const getProjects = async (): Promise<Project[]> => {
  try {
    return await apiGetProjects();
  } catch (error) {
    console.error("Error getting projects from API:", error);
    return [];
  }
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    return await getAllTestimonials();
  } catch (error) {
    console.error("Error getting testimonials from API:", error);
    return [];
  }
};

export const getApprovedTestimonialsOnly = async (): Promise<Testimonial[]> => {
  try {
    return await getApprovedTestimonials();
  } catch (error) {
    console.error("Error getting approved testimonials from API:", error);
    return [];
  }
};

export const getPendingTestimonials = async (): Promise<Testimonial[]> => {
  try {
    return await getTestimonialsByStatus("pending");
  } catch (error) {
    console.error("Error getting pending testimonials from API:", error);
    return [];
  }
};

export const addProject = async (formData: FormData): Promise<Project> => {
  try {
    const newProject = await apiCreateProject(formData);
    return newProject;
  } catch (error) {
    console.error("Error adding project via API:", error);
    throw error;
  }
};

export const updateProject = async (
  id: string,
  formData: FormData,
): Promise<Project> => {
  try {
    const updatedProject = await apiUpdateProject(id, formData);
    return updatedProject;
  } catch (error) {
    console.error("Error updating project via API:", error);
    throw error;
  }
};

export const addTestimonial = async (
  formData: FormData,
): Promise<Testimonial> => {
  try {
    const newTestimonial = await apiCreateTestimonial(formData);
    return newTestimonial;
  } catch (error) {
    console.error("Error adding testimonial via API:", error);
    throw error;
  }
};

export const approveTestimonial = async (id: string): Promise<Testimonial> => {
  try {
    const approvedTestimonial = await apiApproveTestimonial(id);
    return approvedTestimonial;
  } catch (error) {
    console.error("Error approving testimonial via API:", error);
    throw error;
  }
};

export const rejectTestimonial = async (id: string): Promise<Testimonial> => {
  try {
    const rejectedTestimonial = await apiDenyTestimonial(id);
    return rejectedTestimonial;
  } catch (error) {
    console.error("Error rejecting testimonial via API:", error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    await apiDeleteProject([id]);
  } catch (error) {
    console.error("Error deleting project via API:", error);
    throw error;
  }
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  try {
    await apiDeleteTestimonial(id);
  } catch (error) {
    console.error("Error deleting testimonial via API:", error);
    throw error;
  }
};

export const addTechnology = async (technologyData: {
  name: string;
}): Promise<Technology> => {
  try {
    const newTechnology = await apiCreateTechnology(technologyData);
    return newTechnology;
  } catch (error) {
    console.error("Error adding technology via API:", error);
    throw error;
  }
};
