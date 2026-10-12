import { API_BASE_URL } from '@/config/environment';
import { safeExternalUrl } from './safe-url';
export function getProjectImageUrl(imageUrl?: string | null): string {
  if (!imageUrl?.trim()) return '/placeholder.svg';
  const value = imageUrl.trim();
  if (value === '/placeholder.svg' || value.startsWith('/imgs/')) return value;
  if (value.startsWith('//')) return '/placeholder.svg';
  if (/^[a-z][a-z\d+.-]*:/i.test(value)) return safeExternalUrl(value) || '/placeholder.svg';
  return new URL(value, API_BASE_URL + '/').href;
}
export function getTestimonialImageUrl(imageUrl?: string | null): string | undefined {
  return imageUrl?.trim() ? getProjectImageUrl(imageUrl) : undefined;
}
