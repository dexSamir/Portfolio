export const getProjectImageUrl = (imageUrl?: string | null): string => {
  if (!imageUrl || imageUrl.trim() === "") {
    return "/placeholder.svg?height=192&width=384";
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return imageUrl;
};

export const getTestimonialImageUrl = (imageUrl?: string | null): string => {
  if (!imageUrl || imageUrl.trim() === "") {
    return "/placeholder.svg?height=64&width=64";
  }

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return imageUrl;
};
