import { cached, invalidatePublicCache } from "./public-cache";
import { isProject, isTechnology, isTestimonial, validateList } from "./validation";
import { api, ApiError } from "./http";
import { API_BASE_URL } from "@/config/environment";
import type { Project, Testimonial, Technology } from "@/types/data-types";



// ==================== PROJECTS API ====================

export const getProjects = async (): Promise<Project[]> => cached("getProjects", async () => {
  const response = await api.get<Project[]>(
    `${API_BASE_URL}/api/Projects/GetAll`,
  );
  return validateList<Project>(response.data, isProject);
});

export const getProjectById = async (id: string): Promise<Project> => {
  const response = await api.get<Project>(
    `${API_BASE_URL}/api/Projects/GetById/${encodeURIComponent(id)}`,
  );
  if (!isProject(response.data)) throw new ApiError("The project response is invalid.");
  return response.data;
};

export const getProjectsByTechnology = async (
  technologyIds: string[],
): Promise<Project[]> => {
  invalidatePublicCache();
  const response = await api.post<Project[]>(
    `${API_BASE_URL}/api/Projects/GetByTechnology`,
    technologyIds,
  );
  return response.data;
};

export const createProject = async (formData: FormData): Promise<Project> => {
  invalidatePublicCache();
  const response = await api.post<Project>(
    `${API_BASE_URL}/api/Projects/Create`,
    formData,
  );
  return response.data;
};

export const updateProject = async (
  id: string,
  formData: FormData,
): Promise<Project> => {
  invalidatePublicCache();
  const response = await api.patch<Project>(
    `${API_BASE_URL}/api/Projects/Update/${encodeURIComponent(id)}`,
    formData,
  );
  return response.data;
};

export const deleteProject = async (ids: string | string[]): Promise<void> => {
  const idArray = Array.isArray(ids) ? ids : [ids];
  const queryParams = idArray.map((id) => `ids=${encodeURIComponent(id)}`).join("&");
  invalidatePublicCache();
  await api.delete(`${API_BASE_URL}/api/Projects/Delete/Soft?${queryParams}`);
};

// ==================== TECHNOLOGIES API ====================

export const getTechnologies = async (): Promise<Technology[]> => cached("getTechnologies", async () => {
  const response = await api.get<Technology[]>(
    `${API_BASE_URL}/api/Technologies/GetAll`,
  );
  return validateList<Technology>(response.data, isTechnology);
});

export const getTechnologyById = async (id: string): Promise<Technology> => {
  const response = await api.get<Technology>(
    `${API_BASE_URL}/api/Technologies/GetById/${encodeURIComponent(id)}`,
  );
  return response.data;
};

export const createTechnology = async (
  technology: Omit<
    Technology,
    "id" | "createdTime" | "updatedTime" | "isDeleted"
  >,
): Promise<Technology> => {
  invalidatePublicCache();
  const response = await api.post<Technology>(
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
  invalidatePublicCache();
  const response = await api.post<Technology[]>(
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
  invalidatePublicCache();
  const response = await api.patch<Technology>(
    `${API_BASE_URL}/api/Technologies/Update/${encodeURIComponent(id)}`,
    technology,
  );
  return response.data;
};

export const deleteTechnology = async (ids: string[]): Promise<void> => {
  const queryParams = ids.map((id) => `ids=${encodeURIComponent(id)}`).join("&");
  invalidatePublicCache();
  await api.delete(
    `${API_BASE_URL}/api/Technologies/Delete/Soft?${queryParams}`,
  );
};

// ==================== TESTIMONIALS API ====================

export const getApprovedTestimonials = async (): Promise<Testimonial[]> => cached("getApprovedTestimonials", async () => {
  const response = await api.get<Testimonial[]>(
    `${API_BASE_URL}/api/Testimonials/GetApproved`,
  );
  return validateList<Testimonial>(response.data, isTestimonial);
});

export const getAllTestimonials = async (): Promise<Testimonial[]> => {
  const response = await api.get<Testimonial[]>(
    `${API_BASE_URL}/api/Testimonials/GetAll`,
  );
  return validateList<Testimonial>(response.data, isTestimonial);
};

export const getTestimonialsByStatus = async (
  status: "pending" | "approved" | "denied",
): Promise<Testimonial[]> => {
  const response = await api.get<Testimonial[]>(
    `${API_BASE_URL}/api/Testimonials/GetByStatus/${status}`,
  );
  return response.data;
};

export const createTestimonial = async (
  formData: FormData,
): Promise<Testimonial> => {
  invalidatePublicCache();
  const response = await api.post<Testimonial>(
    `${API_BASE_URL}/api/Testimonials/Create`,
    formData,
  );
  return response.data;
};

export const approveTestimonial = async (id: string): Promise<Testimonial> => {
  invalidatePublicCache();
  const response = await api.patch<Testimonial>(
    `${API_BASE_URL}/api/Testimonials/Approve/${encodeURIComponent(id)}/approve`,
  );
  return response.data;
};

export const denyTestimonial = async (id: string): Promise<Testimonial> => {
  invalidatePublicCache();
  const response = await api.patch<Testimonial>(
    `${API_BASE_URL}/api/Testimonials/Deny/${encodeURIComponent(id)}/deny`,
  );
  return response.data;
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  invalidatePublicCache();
  await api.delete(`${API_BASE_URL}/api/Testimonials/Delete/${encodeURIComponent(id)}`);
};
