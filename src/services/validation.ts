import type { Project, Testimonial, Technology } from '@/types/data-types';
import { ApiError } from './http';
const record = (value: unknown): value is Record<string, unknown> => !!value && typeof value === 'object';
export function validateList<T>(value: unknown, valid: (item: unknown) => boolean): T[] {
  if (!Array.isArray(value) || !value.every(valid)) throw new ApiError('The service returned unexpected data. Please try again.');
  return value as T[];
}
export const isTechnology = (v: unknown): v is Technology => record(v) && typeof v.id === 'string' && typeof v.name === 'string';
export const isProject = (v: unknown): v is Project => record(v) && typeof v.id === 'string' && typeof v.title === 'string' && typeof v.description === 'string' && Array.isArray(v.technologies) && v.technologies.every(isTechnology);
export const isTestimonial = (v: unknown): v is Testimonial => record(v) && ['id','fullName','company','position','message'].every(k => typeof v[k] === 'string') && typeof v.rating === 'number' && Number.isInteger(v.rating) && v.rating >= 1 && v.rating <= 5 && ['pending','approved','denied',0,1,2].includes(v.status as string | number);
