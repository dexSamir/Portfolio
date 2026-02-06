export interface Technology {
  id: string;
  name: string;
  isDeleted: boolean;
  createdTime: string;
  updatedTime: string;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  imageUrl?: string;
  liveUrl?: string;
  githubUrl?: string;
  createdTime: string;
  updatedTime: string;
  isDeleted: boolean;
  technologies: Technology[];
}

export interface Testimonial {
  id: string;
  fullName: string;
  profileImageUrl?: string;
  company: string;
  position: string;
  message: string;
  rating: number;
  status: "pending" | "approved" | "denied" | number;
}

export interface PendingTestimonial extends Testimonial {}

export const mapTestimonialStatus = (
  status: number | string,
): "pending" | "approved" | "denied" => {
  if (typeof status === "string") {
    return status as "pending" | "approved" | "denied";
  }
  // Backend enum: 0 = pending, 1 = approved, 2 = denied
  switch (status) {
    case 0:
      return "pending";
    case 1:
      return "approved";
    case 2:
      return "denied";
    default:
      return "pending";
  }
};

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
}

export interface AuthContextType {
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
}
