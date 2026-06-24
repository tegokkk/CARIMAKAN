const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_ORIGIN = API_BASE_URL.replace(/\/api\/?$/, "");

export const getImageUrl = (imagePath, width = 600) => {
  if (!imagePath) return "";

  const value = String(imagePath).trim();
  if (!value) return "";

  if (/^(https?:)?\/\//i.test(value) || value.startsWith("data:") || value.startsWith("blob:")) {
    if (value.includes("commons.wikimedia.org/wiki/Special:FilePath")) {
      const char = value.includes("?") ? "&" : "?";
      return `${value}${char}width=${width}`;
    }
    if (value.includes("picsum.photos") && width) {
      return value.replace(/\/\d+\/\d+$/, `/${width}/${Math.round(width * 0.75)}`);
    }
    return value;
  }

  const normalizedPath = value.startsWith("/") ? value : `/${value}`;
  return `${API_ORIGIN}${normalizedPath}`;
};
