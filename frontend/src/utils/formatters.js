/**
 * Format currency amount to Indian Rupees (INR) format
 */
export const formatPrice = (amount, currency = 'INR') => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹ 0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency,
    maximumFractionDigits: 0
  }).format(amount);
};

/**
 * Format ISO date string to readable locale date string
 */
export const formatDate = (dateString) => {
  if (!dateString) return '';
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
};

/**
 * Truncate long text strings cleanly
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text) return '';
  if (text.length <= maxLength) return text;
  return `${text.substring(0, maxLength)}...`;
};

/**
 * Extract image URL from property image objects ({ url, fileId } or raw string)
 */
export const getImageUrl = (imageItem, fallbackUrl = 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80') => {
  if (!imageItem) return fallbackUrl;
  if (typeof imageItem === 'string') return imageItem;
  if (imageItem.url) return imageItem.url;
  return fallbackUrl;
};

/**
 * Optimize ImageKit URLs with dynamic width, quality, and WebP format
 */
export const optimizeImageKitUrl = (url, width = 800, quality = 80) => {
  if (!url || !url.includes('ik.imagekit.io')) return url;
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}tr=w-${width},q-${quality},f-webp`;
};
