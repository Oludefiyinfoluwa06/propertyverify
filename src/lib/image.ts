import api from './api';

export function absoluteImageUrl(src?: string | null) {
  if (!src) return '';
  if (src.startsWith('http://') || src.startsWith('https://')) return src;
  const base = api.rawBase?.replace(/\/$/, '');
  if (src.startsWith('/')) return `${base}${src}`;
  return `${base}/${src}`;
}

export default absoluteImageUrl;
