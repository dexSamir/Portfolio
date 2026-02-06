import axios from "axios";
import type { Project, Testimonial, Technology } from "@/types/data-types";

const API_BASE_URL = "https://portfolio-back-r1hd.onrender.com";

// ==================== PROJECTS API ====================

export const getProjects = async (): Promise<Project[]> => {
  const response = await axios.get<Project[]>(
    `${API_BASE_URL}/api/Projects/GetAll`,
  );
  return response.data;
};

export const getProjectById = async (id: string): Promise<Project> => {
  const response = await axios.get<Project>(
    `${API_BASE_URL}/api/Projects/GetById/${id}`,
  );
  return response.data;
};

export const getProjectsByTechnology = async (
  technologyIds: string[],
): Promise<Project[]> => {
  const response = await axios.post<Project[]>(
    `${API_BASE_URL}/api/Projects/GetByTechnology`,
    technologyIds,
  );
  return response.data;
};

export const createProject = async (formData: FormData): Promise<Project> => {
  const response = await axios.post<Project>(
    `${API_BASE_URL}/api/Projects/Create`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const updateProject = async (
  id: string,
  formData: FormData,
): Promise<Project> => {
  // Note: Backend expects [FromForm] for multipart/form-data
  // If backend uses [FromBody], axios will automatically remove Content-Type header
  // but FormData with file uploads requires multipart/form-data
  const response = await axios.patch<Project>(
    `${API_BASE_URL}/api/Projects/Update/${id}`,
    formData,
  );
  return response.data;
};

export const deleteProject = async (ids: string | string[]): Promise<void> => {
  const idArray = Array.isArray(ids) ? ids : [ids];
  const queryParams = idArray.map((id) => `ids=${id}`).join("&");
  await axios.delete(`${API_BASE_URL}/api/Projects/Delete/Soft?${queryParams}`);
};

// ==================== TECHNOLOGIES API ====================

export const getTechnologies = async (): Promise<Technology[]> => {
  const response = await axios.get<Technology[]>(
    `${API_BASE_URL}/api/Technologies/GetAll`,
  );
  return response.data;
};

export const getTechnologyById = async (id: string): Promise<Technology> => {
  const response = await axios.get<Technology>(
    `${API_BASE_URL}/api/Technologies/GetById/${id}`,
  );
  return response.data;
};

export const createTechnology = async (
  technology: Omit<
    Technology,
    "id" | "createdTime" | "updatedTime" | "isDeleted"
  >,
): Promise<Technology> => {
  const response = await axios.post<Technology>(
    `${API_BASE_URL}/api/Technologies/Create`,
    technology,
  );
  return response.data;
};

export const createTechnologies = async (
  technologies: Array<
    Omit<Technology, "id" | "createdTime" | "updatedTime" | "isDeleted">
  >,
): Promise<Technology[]> => {
  const response = await axios.post<Technology[]>(
    `${API_BASE_URL}/api/Technologies/CreateRange`,
    technologies,
  );
  return response.data;
};

export const updateTechnology = async (
  id: string,
  technology: Omit<
    Technology,
    "id" | "createdTime" | "updatedTime" | "isDeleted"
  >,
): Promise<Technology> => {
  const response = await axios.patch<Technology>(
    `${API_BASE_URL}/api/Technologies/Update/${id}`,
    technology,
  );
  return response.data;
};

export const deleteTechnology = async (ids: string[]): Promise<void> => {
  const queryParams = ids.map((id) => `ids=${id}`).join("&");
  await axios.delete(
    `${API_BASE_URL}/api/Technologies/Delete/Soft?${queryParams}`,
  );
};

// ==================== TESTIMONIALS API ====================

export const getApprovedTestimonials = async (): Promise<Testimonial[]> => {
  const response = await axios.get<Testimonial[]>(
    `${API_BASE_URL}/api/Testimonials/GetApproved`,
  );
  return response.data;
};

export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  const response = await axios.get<Testimonial[]>(
    `${API_BASE_URL}/api/Testimonials/GetAll`,
  );
  return response.data;
};

export const getTestimonialsByStatus = async (
  status: "pending" | "approved" | "denied",
): Promise<Testimonial[]> => {
  const response = await axios.get<Testimonial[]>(
    `${API_BASE_URL}/api/Testimonials/GetByStatus/${status}`,
  );
  return response.data;
};

export const createTestimonial = async (
  formData: FormData,
): Promise<Testimonial> => {
  const response = await axios.post<Testimonial>(
    `${API_BASE_URL}/api/Testimonials/Create`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    },
  );
  return response.data;
};

export const approveTestimonial = async (id: string): Promise<Testimonial> => {
  const response = await axios.patch<Testimonial>(
    `${API_BASE_URL}/api/Testimonials/Approve/${id}/approve`,
  );
  return response.data;
};

export const denyTestimonial = async (id: string): Promise<Testimonial> => {
  const response = await axios.patch<Testimonial>(
    `${API_BASE_URL}/api/Testimonials/Deny/${id}/deny`,
  );
  return response.data;
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/api/Testimonials/Delete/${id}`);
};
