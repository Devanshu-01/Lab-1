// Cloudinary URL transform: by inserting f_auto,q_auto,w_500 into the /upload/
// path, Cloudinary builds a smaller, modern-format image and serves it from its
// CDN. f_auto = best format, q_auto = compress, w_500 = resize. No dashboard
// setup needed — the path tells Cloudinary what to generate.
export function optimized(url) {
  if (!url || typeof url !== 'string') return url
  if (!url.includes('/upload/')) return url // not a Cloudinary asset
  if (url.includes('/upload/f_auto')) return url // already optimized
  return url.replace('/upload/', '/upload/f_auto,q_auto,w_500/')
}

export default optimized
