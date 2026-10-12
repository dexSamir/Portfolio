import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function getInitials(fullName: string): string {
  const names = fullName.trim().split(/\s+/);
  if (!fullName.trim()) return "?";
  if (names.length === 1) return names[0].charAt(0).toUpperCase();
  return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
}

export function getAvatarColor(fullName: string): string {
  const colors = [
    "bg-blue-700",
    "bg-purple-700",
    "bg-pink-700",
    "bg-red-700",
    "bg-orange-700",
    "bg-green-700",
    "bg-teal-700",
    "bg-cyan-700",
    "bg-indigo-700",
    "bg-rose-700",
  ];

  const hash = fullName.split("").reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);

  return colors[hash % colors.length];
}
