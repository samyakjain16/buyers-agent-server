// Utility functions for color and status

// Function to get color for capacity percentage
export const getCapacityColor = (percentage) => {
  if (percentage <= 60) return '#dcfce7'; // Green
  if (percentage <= 85) return '#fef9c3'; // Yellow
  if (percentage <= 100) return '#ffedd5'; // Orange
  return '#fee2e2'; // Red
};

// Function to get border color for capacity
export const getBorderColor = (percentage) => {
  if (percentage <= 60) return '#4ade80'; // Green
  if (percentage <= 85) return '#eab308'; // Yellow/Gold
  if (percentage <= 100) return '#f97316'; // Orange
  return '#ef4444'; // Red
};

// Function to get status text based on capacity
export const getStatusText = (percentage) => {
  if (percentage <= 60) return 'Available';
  if (percentage <= 85) return 'Busy';
  if (percentage <= 100) return 'At Capacity';
  return 'Overloaded';
};

// Pie chart colors
export const CHART_COLORS = [
  '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'
];
