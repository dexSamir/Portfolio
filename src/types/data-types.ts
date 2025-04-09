export interface Project {
    id: string
    title: string
    description: string
    image?: string
    technologies: string[]
    githubUrl?: string
    liveUrl?: string
    createdAt: string
  }
  
  export interface Testimonial {
    id: string
    name: string
    position: string
    company: string
    avatar?: string
    content: string
    rating: number
    createdAt: string
  }
  
  export interface PendingTestimonial {
    id: string
    name: string
    position: string
    company: string
    avatar?: string
    content: string
    rating: number
    createdAt: string
    status: "pending" | "approved" | "rejected"
  }
  