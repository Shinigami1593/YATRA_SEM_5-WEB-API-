export const getBackendImageUrl = (imagePath) => {
  if (!imagePath) return null;
  const apiUrl = import.meta.env.VITE_BACKEND_URL || "http://localhost:5050";
  // Avoid double slashes, so trim any leading slash from imagePath
  return apiUrl + (imagePath.startsWith('/') ? '' : '/') + imagePath;
}
