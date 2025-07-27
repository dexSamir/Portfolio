import axios from "axios";
import type { Project, Testimonial } from "@/types/data-types";

const API_BASE_URL = "https://portfolio-back-fs-vtio.onrender.com";

export const getProjects = async (): Promise<Project[]> => {
  const response = await axios.get<Project[]>(`${API_BASE_URL}/project`);
  return response.data;
};

export const getProjectById = async (id: string): Promise<Project> => {
  const response = await axios.get<Project>(`${API_BASE_URL}/project/${id}`);
  return response.data;
};

export const createProject = async (
  project: Omit<Project, "_id" | "createdAt">
): Promise<Project> => {
  const response = await axios.post<Project>(
    `${API_BASE_URL}/project`,
    project
  );
  return response.data;
};

export const updateProject = async (
  id: string,
  project: Omit<Project, "_id" | "createdAt">
): Promise<Project> => {
  const response = await axios.put<Project>(
    `${API_BASE_URL}/project/${id}`,
    project
  );
  return response.data;
};

export const deleteProject = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/project/${id}`);
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
  const response = await axios.get<Testimonial[]>(
    `${API_BASE_URL}/testimonial`
  );
  return response.data;
};

export const getTestimonialById = async (id: string): Promise<Testimonial> => {
  const response = await axios.get<Testimonial>(
    `${API_BASE_URL}/testimonials/${id}`
  );
  return response.data;
};

export const createTestimonial = async (
  testimonial: Omit<Testimonial, "_id" | "createdAt">
): Promise<Testimonial> => {
  const response = await axios.post<Testimonial>(
    `${API_BASE_URL}/testimonial`,
    {
      ...testimonial,
      status: "pending",
    }
  );
  return response.data;
};

export const updateTestimonial = async (
  id: string,
  testimonial: Omit<Testimonial, "_id" | "createdAt">
): Promise<Testimonial> => {
  const response = await axios.put<Testimonial>(
    `${API_BASE_URL}/testimonial/${id}`,
    testimonial
  );
  return response.data;
};

export const updateTestimonialStatus = async (
  id: string,
  status: "pending" | "approved" | "rejected"
): Promise<Testimonial> => {
  const response = await axios.put<Testimonial>(
    `${API_BASE_URL}/testimonial/${id}`,
    { status }
  );
  return response.data;
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  await axios.delete(`${API_BASE_URL}/testimonial/${id}`);
};
