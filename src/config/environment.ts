const configuredApi = import.meta.env.VITE_API_BASE_URL || 'https://portfolio-back-r1hd.onrender.com';
const api = new URL(configuredApi);
if (api.protocol !== 'https:' && !(import.meta.env.DEV && ['localhost', '127.0.0.1'].includes(api.hostname))) {
  throw new Error('VITE_API_BASE_URL must use HTTPS in production.');
}
export const API_BASE_URL = api.href.replace(/\/$/, '');
export const SITE_URL = import.meta.env.VITE_SITE_URL?.replace(/\/$/, '') || '';
