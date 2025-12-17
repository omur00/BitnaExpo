// utils/formatDate.js

export function formatDate(dateString) {
  if (!dateString) return "";

  const date = new Date(dateString);

  // Example: "10 Nov 2025, 14:30"
  return date.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}
