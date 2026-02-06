import { useState } from "react";
import { getInitials, getAvatarColor } from "@/lib/utils";

interface InitialsAvatarProps {
  name: string;
  imageUrl?: string | null;
  size?: "sm" | "md" | "lg";
}

export function InitialsAvatar({
  name,
  imageUrl,
  size = "md",
}: InitialsAvatarProps) {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    sm: "w-10 h-10 text-xs",
    md: "w-16 h-16 text-base",
    lg: "w-24 h-24 text-lg",
  };

  const borderClasses = {
    sm: "border",
    md: "border-2",
    lg: "border-2",
  };

  const initials = getInitials(name);
  const bgColor = getAvatarColor(name);

  if (!imageUrl || imgError) {
    return (
      <div
        className={`${sizeClasses[size]} ${bgColor} rounded-full ${borderClasses[size]} border-primary/50 flex items-center justify-center font-bold text-white`}
      >
        {initials}
      </div>
    );
  }

  return (
    <img
      src={imageUrl}
      alt={name}
      className={`${sizeClasses[size]} rounded-full object-cover ${borderClasses[size]} border-primary/50`}
      onError={() => setImgError(true)}
    />
  );
}
