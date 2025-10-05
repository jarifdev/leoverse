// Format currency
export const formatCurrency = (amount) => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

// Format SI score
export const formatSI = (score) => {
  return score.toFixed(1);
};

// Generate UUID (simple version for client-side)
export const generateUUID = () => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = Math.random() * 16 | 0;
    const v = c === 'x' ? r : (r & 0x3 | 0x8);
    return v.toString(16);
  });
};

// Calculate progress percentage
export const calculateProgress = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

// Get SI score color
export const getSIColor = (score) => {
  if (score >= 85) return 'text-green-500';
  if (score >= 70) return 'text-yellow-500';
  if (score >= 50) return 'text-orange-500';
  return 'text-red-500';
};

// Get budget status color
export const getBudgetColor = (spent, total) => {
  const percentage = (spent / total) * 100;
  if (percentage < 70) return 'text-green-500';
  if (percentage < 90) return 'text-yellow-500';
  return 'text-red-500';
};

// Truncate text
export const truncate = (text, length = 50) => {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
};

// Format date
export const formatDate = (dateString) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(date);
};

// Calculate component category distribution
export const getCategoryDistribution = (components) => {
  const distribution = {};
  components.forEach(component => {
    distribution[component.category] = (distribution[component.category] || 0) + 1;
  });
  return distribution;
};

// Check if mission is balanced (has components from all categories)
export const isMissionBalanced = (components) => {
  const categories = ['propulsion', 'communication', 'power', 'structure'];
  const presentCategories = new Set(components.map(c => c.category));
  return categories.every(cat => presentCategories.has(cat));
};
