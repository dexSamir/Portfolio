import axios from "axios";
import type { Project, Testimonial } from "@/types/data-types";

const API_BASE_URL = "https://portfolio-back-fs-1.onrender.com";

export const getProjects = async (): Promise<Project[]> => {
  try {
    console.log("API Service: Fetching all projects...");
    const response = await axios.get<Project[]>(`${API_BASE_URL}/project`);
    console.log("API Service: Projects fetched successfully.", response.data);
    return response.data;
  } catch (error) {
    console.error("API Service Error: Failed to fetch projects.", error);
    throw error;
  }
};

export const getProjectById = async (id: string): Promise<Project> => {
  try {
    console.log(`API Service: Fetching project with ID: ${id}...`);
    const response = await axios.get<Project>(`${API_BASE_URL}/project/${id}`);
    console.log(
      `API Service: Project ${id} fetched successfully.`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `API Service Error: Failed to fetch project with ID: ${id}.`,
      error
    );
    throw error;
  }
};

export const createProject = async (
  project: Omit<Project, "_id" | "createdAt">
): Promise<Project> => {
  try {
    console.log("API Service: Creating new project...", project);
    const response = await axios.post<Project>(
      `${API_BASE_URL}/project`,
      project
    );
    console.log("API Service: Project created successfully.", response.data);
    return response.data;
  } catch (error) {
    console.error("API Service Error: Failed to create project.", error);
    throw error;
  }
};

export const updateProject = async (
  id: string,
  project: Omit<Project, "_id" | "createdAt">
): Promise<Project> => {
  try {
    console.log(`API Service: Updating project with ID: ${id}...`, project);
    const response = await axios.put<Project>(
      `${API_BASE_URL}/project/${id}`,
      project
    );
    console.log(
      `API Service: Project ${id} updated successfully.`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `API Service Error: Failed to update project with ID: ${id}.`,
      error
    );
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    console.log(`API Service: Deleting project with ID: ${id}...`);
    await axios.delete(`${API_BASE_URL}/project/${id}`);
    console.log(`API Service: Project ${id} deleted successfully.`);
  } catch (error) {
    console.error(
      `API Service Error: Failed to delete project with ID: ${id}.`,
      error
    );
    throw error;
  }
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    console.log("API Service: Fetching all testimonials...");
    const response = await axios.get<Testimonial[]>(
      `${API_BASE_URL}/testimonial`
    );
    console.log(
      "API Service: Testimonials fetched successfully.",
      response.data
    );
    return response.data;
  } catch (error) {
    console.error("API Service Error: Failed to fetch testimonials.", error);
    throw error;
  }
};

export const getTestimonialById = async (id: string): Promise<Testimonial> => {
  try {
    console.log(`API Service: Fetching testimonial with ID: ${id}...`);
    const response = await axios.get<Testimonial>(
      `${API_BASE_URL}/testimonial/${id}`
    );
    console.log(
      `API Service: Testimonial ${id} fetched successfully.`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `API Service Error: Failed to fetch testimonial with ID: ${id}.`,
      error
    );
    throw error;
  }
};

export const createTestimonial = async (
  testimonial: Omit<Testimonial, "_id" | "createdAt">
): Promise<Testimonial> => {
  try {
    console.log("API Service: Creating new testimonial...", testimonial);
    const response = await axios.post<Testimonial>(
      `${API_BASE_URL}/testimonial`,
      {
        ...testimonial,
        status: "pending",
      }
    );
    console.log(
      "API Service: Testimonial created successfully.",
      response.data
    );
    return response.data;
  } catch (error) {
    console.error("API Service Error: Failed to create testimonial.", error);
    throw error;
  }
};

export const updateTestimonial = async (
  id: string,
  testimonial: Omit<Testimonial, "_id" | "createdAt">
): Promise<Testimonial> => {
  try {
    console.log(
      `API Service: Updating testimonial with ID: ${id}...`,
      testimonial
    );
    const response = await axios.put<Testimonial>(
      `${API_BASE_URL}/testimonial/${id}`,
      testimonial
    );
    console.log(
      `API Service: Testimonial ${id} updated successfully.`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `API Service Error: Failed to update testimonial with ID: ${id}.`,
      error
    );
    throw error;
  }
};

export const updateTestimonialStatus = async (
  id: string,
  status: "pending" | "approved" | "rejected"
): Promise<Testimonial> => {
  try {
    console.log(
      `API Service: Updating testimonial status for ID: ${id} to ${status}...`
    );
    const response = await axios.put<Testimonial>(
      `${API_BASE_URL}/testimonial/${id}`,
      { status }
    );
    console.log(
      `API Service: Testimonial status for ${id} updated to ${status}.`,
      response.data
    );
    return response.data;
  } catch (error) {
    console.error(
      `API Service Error: Failed to update testimonial status for ID: ${id}.`,
      error
    );
    throw error;
  }
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  try {
    console.log(`API Service: Deleting testimonial with ID: ${id}...`);
    await axios.delete(`${API_BASE_URL}/testimonial/${id}`);
    console.log(`API Service: Testimonial ${id} deleted successfully.`);
  } catch (error) {
    console.error(
      `API Service Error: Failed to delete testimonial with ID: ${id}.`,
      error
    );
    throw error;
  }
};
