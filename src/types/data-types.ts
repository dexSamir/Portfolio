export interface Project {
  _id: string;
  name: string;
  description: string;
  image?: string;
  technologies: string[];
  githubUrl?: string;
  liveUrl?: string;
  createdAt: string;
}

export interface Testimonial {
  _id: string;
  name: string;
  position: string;
  company: string;
  avatar?: string;
  content: string;
  rating: number;
  createdAt: string;
}
