const API_BASE_URL = "https://portfolio-back-r1hd.onrender.com";

export const getProjectImageUrl = (
  imageUrl: string | null | undefined,
): string => {
  if (!imageUrl) {
    return "/placeholder.svg?height=192&width=384";
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }
  return `${API_BASE_URL}/projects/${imageUrl}`;
};

export const getTestimonialImageUrl = (
  imageUrl: string | null | undefined,
): string => {
 
  return `${API_BASE_URL}/testimonials/${imageUrl}`;
};
