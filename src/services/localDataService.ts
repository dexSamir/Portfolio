import type { Project, Testimonial } from "@/types/data-types";
import { projects as initialProjects } from "@/data/projectdata";
import { testimonials as initialTestimonials } from "@/data/testimonialdata";

const PROJECTS_KEY = "projects";
const TESTIMONIALS_KEY = "testimonials";

const initializeLocalStorage = () => {
  if (!localStorage.getItem(PROJECTS_KEY)) {
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(initialProjects));
  }

  if (!localStorage.getItem(TESTIMONIALS_KEY)) {
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(initialTestimonials));
  }
};

initializeLocalStorage();

export const getProjects = async (): Promise<Project[]> => {
  try {
    const projectsJson = localStorage.getItem(PROJECTS_KEY);
    return projectsJson ? JSON.parse(projectsJson) : [];
  } catch (error) {
    console.error("Error getting projects:", error);
    return [];
  }
};

export const getTestimonials = async (): Promise<Testimonial[]> => {
  try {
    const testimonialsJson = localStorage.getItem(TESTIMONIALS_KEY);
    return testimonialsJson ? JSON.parse(testimonialsJson) : [];
  } catch (error) {
    console.error("Error getting testimonials:", error);
    return [];
  }
};

export const addProject = async (
  project: Omit<Project, "id" | "createdAt">
): Promise<Project> => {
  try {
    const projects = await getProjects();

    const newProject: Project = {
      ...project,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedProjects = [...projects, newProject];
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));

    generateTypeScriptCode();

    return newProject;
  } catch (error) {
    console.error("Error adding project:", error);
    throw error;
  }
};

export const updateProject = async (project: Project): Promise<Project> => {
  try {
    const projects = await getProjects();
    const index = projects.findIndex((p) => p.id === project.id);

    if (index === -1) {
      throw new Error("Project not found");
    }

    const updatedProjects = [...projects];
    updatedProjects[index] = project;

    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));

    generateTypeScriptCode();

    return project;
  } catch (error) {
    console.error("Error updating project:", error);
    throw error;
  }
};

export const addTestimonial = async (
  testimonial: Omit<Testimonial, "id" | "createdAt">
): Promise<Testimonial> => {
  try {
    const testimonials = await getTestimonials();

    const newTestimonial: Testimonial = {
      ...testimonial,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    };

    const updatedTestimonials = [...testimonials, newTestimonial];
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(updatedTestimonials));

    generateTypeScriptCode();

    return newTestimonial;
  } catch (error) {
    console.error("Error adding testimonial:", error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    const projects = await getProjects();
    const updatedProjects = projects.filter((project) => project.id !== id);
    localStorage.setItem(PROJECTS_KEY, JSON.stringify(updatedProjects));

    generateTypeScriptCode();
  } catch (error) {
    console.error("Error deleting project:", error);
    throw error;
  }
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  try {
    const testimonials = await getTestimonials();
    const updatedTestimonials = testimonials.filter(
      (testimonial) => testimonial.id !== id
    );
    localStorage.setItem(TESTIMONIALS_KEY, JSON.stringify(updatedTestimonials));

    generateTypeScriptCode();
  } catch (error) {
    console.error("Error deleting testimonial:", error);
    throw error;
  }
};

const generateTypeScriptCode = async () => {
  try {
    const projects = await getProjects();
    const testimonials = await getTestimonials();

    const projectsCode = `import type { Project } from "@/types/data-types"

export const projects: Project[] = ${JSON.stringify(projects, null, 2)}`;

    const testimonialsCode = `import type { Testimonial } from "@/types/data-types"

export const testimonials: Testimonial[] = ${JSON.stringify(
      testimonials,
      null,
      2
    )}`;

    console.log("--- projectdata.ts ---");
    console.log(projectsCode);
    console.log("\n--- testimonialdata.ts ---");
    console.log(testimonialsCode);

    return { projectsCode, testimonialsCode };
  } catch (error) {
    console.error("Error generating TypeScript code:", error);
    throw error;
  }
};
