import type { Project, Testimonial } from "@/types/data-types";
import {
  getProjects as apiGetProjects,
  getTestimonials as apiGetTestimonials,
  createProject as apiCreateProject,
  updateProject as apiUpdateProject,
  deleteProject as apiDeleteProject,
  createTestimonial as apiCreateTestimonial,
  deleteTestimonial as apiDeleteTestimonial,
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
    return await apiGetTestimonials();
  } catch (error) {
    console.error("Error getting testimonials from API:", error);
    return [];
  }
};

export const addProject = async (
  project: Omit<Project, "_id" | "createdAt">
): Promise<Project> => {
  try {
    const newProject = await apiCreateProject(project);
    await generateTypeScriptCode();
    return newProject;
  } catch (error) {
    console.error("Error adding project via API:", error);
    throw error;
  }
};

export const updateProject = async (project: Project): Promise<Project> => {
  try {
    const updatedProject = await apiUpdateProject(project._id, {
      name: project.name,
      description: project.description,
      image: project.image,
      technologies: project.technologies,
      githubUrl: project.githubUrl,
      liveUrl: project.liveUrl,
    });
    await generateTypeScriptCode();
    return updatedProject;
  } catch (error) {
    console.error("Error updating project via API:", error);
    throw error;
  }
};

export const addTestimonial = async (
  testimonial: Omit<Testimonial, "_id" | "createdAt">
): Promise<Testimonial> => {
  try {
    const newTestimonial = await apiCreateTestimonial(testimonial);
    await generateTypeScriptCode();
    return newTestimonial;
  } catch (error) {
    console.error("Error adding testimonial via API:", error);
    throw error;
  }
};

export const deleteProject = async (id: string): Promise<void> => {
  try {
    await apiDeleteProject(id);
    await generateTypeScriptCode();
  } catch (error) {
    console.error("Error deleting project via API:", error);
    throw error;
  }
};

export const deleteTestimonial = async (id: string): Promise<void> => {
  try {
    await apiDeleteTestimonial(id);
    await generateTypeScriptCode();
  } catch (error) {
    console.error("Error deleting testimonial via API:", error);
    throw error;
  }
};

const generateTypeScriptCode = async () => {
  try {
    const projects = await getProjects();
    const testimonials = await getTestimonials();

    const projectsCode = `import type { Project } from "@/types/data-types";

export const projects: Project[] = ${JSON.stringify(projects, null, 2)};`;

    const testimonialsCode = `import type { Testimonial } from "@/types/data-types";

export const testimonials: Testimonial[] = ${JSON.stringify(
      testimonials,
      null,
      2
    )};`;

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
