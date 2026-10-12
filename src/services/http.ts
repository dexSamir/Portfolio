import { API_BASE_URL } from '@/config/environment';
import { invalidatePublicCache } from './public-cache';
import { clearSession, getSessionToken } from './session';
export class ApiError extends Error {
  constructor(message: string, public status = 0) { super(message); this.name = 'ApiError'; }
}
export async function request<T>(path: string, method = 'GET', data?: unknown): Promise<{ data: T }> {
  const url = new URL(path, API_BASE_URL + '/');
  if (url.origin !== new URL(API_BASE_URL).origin) throw new ApiError('Untrusted API origin');
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 45000);
  const headers = new Headers({ Accept: 'application/json' });
  const token = getSessionToken();
  if (token && !url.pathname.endsWith('/auth/login')) headers.set('Authorization', `Bearer ${token}`);
  const multipart = data instanceof FormData;
  if (data !== undefined && !multipart) headers.set('Content-Type', 'application/json');
  try {
    const response = await fetch(url, {method, headers, body: data === undefined ? undefined : multipart ? data : JSON.stringify(data), signal:controller.signal, credentials:'omit', cache:'no-store', redirect:'error'});
    if (!response.ok) {
      if (response.status === 401 && token) {
        clearSession();
        if (location.pathname.startsWith('/admin')) location.assign('/login');
      }
      if (response.status === 403 && location.pathname.startsWith('/admin')) location.assign('/403');
      throw new ApiError(response.status === 401 ? 'Invalid or expired credentials.' : response.status === 403 ? 'You do not have permission to perform this action.' : response.status === 429 ? 'Too many requests. Please wait and try again.' : 'The service could not complete your request.', response.status);
    }
    if (method !== "GET") invalidatePublicCache();
    const text = await response.text();
    if (!text) return { data: undefined as T };
    try { return { data: JSON.parse(text) as T }; }
    catch { throw new ApiError('The service returned an invalid response.'); }
  } catch (error) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(controller.signal.aborted ? 'The service took too long to respond. Please try again.' : 'Unable to reach the service. Please try again.');
  } finally { clearTimeout(timeout); }
}
export const api = {
  get: <T>(url: string) => request<T>(url),
  post: <T>(url: string, data?: unknown) => request<T>(url, 'POST', data),
  patch: <T>(url: string, data?: unknown) => request<T>(url, 'PATCH', data),
  delete: (url: string) => request<void>(url, 'DELETE'),
};
export const errorMessage = (error: unknown) => error instanceof ApiError ? error.message : 'Something went wrong. Please try again.';
