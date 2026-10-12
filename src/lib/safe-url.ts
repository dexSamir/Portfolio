export function safeExternalUrl(value?: string | null): string | undefined {
  if (!value) return undefined;
  try { const url = new URL(value); return url.protocol === 'https:' && !url.username && !url.password ? url.href : undefined; }
  catch { return undefined; }
}
export function validateImage(file: File): string | null {
  if (!['image/jpeg','image/png','image/webp','image/gif','image/avif'].includes(file.type)) return 'Choose a JPEG, PNG, WebP, GIF or AVIF image.';
  return file.size > 10 * 1024 * 1024 ? 'File is too large. Maximum size is 10MB.' : null;
}
