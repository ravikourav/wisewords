export default function adjustColorBrightness(color, amount) {
  if (!color || typeof color !== 'string' || (color[0] !== '#' && color.length !== 6)) {
    console.error('Invalid color value:', color);
    return '#000000'; // Return a default color or handle it as needed
  }

  let usePound = false;

  // Remove the "#" character if present
  if (color[0] === "#") {
    color = color.slice(1);
    usePound = true;
  }

  // Parse the hex color to its RGB components
  const num = parseInt(color, 16);
  let r = (num >> 16) - amount;
  let g = ((num >> 8) & 0x00FF) - amount;
  let b = (num & 0x0000FF) - amount;

  // Ensure RGB values are within the valid range [0, 255]
  r = Math.min(255, Math.max(0, r));
  g = Math.min(255, Math.max(0, g));
  b = Math.min(255, Math.max(0, b));

  // Convert back to hex and pad with leading zeros if needed
  const newColor = ((r << 16) | (g << 8) | b).toString(16).padStart(6, '0');

  return (usePound ? "#" : "") + newColor;
}
