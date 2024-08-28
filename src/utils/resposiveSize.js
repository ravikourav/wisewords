const customBreakpoints = {
xxs: 360,  // Extra Extra Small screens (e.g., old phones)
xs: 576,   // Extra Small screens (e.g., phones)
sm: 768,   // Small screens (e.g., tablets)
md: 992,   // Medium screens (e.g., small desktops)
lg: 1400,  // Large screens (e.g., desktops)
xl: 1600,  // Extra Large screens (e.g., large desktops)
};
  
export function getCurrentSize() {
const width = window.innerWidth;
if (width < customBreakpoints.xs) return 'xxs';
if (width < customBreakpoints.sm) return 'xs';
if (width < customBreakpoints.md) return 'sm';
if (width < customBreakpoints.lg) return 'md';
if (width < customBreakpoints.xl) return 'lg';
return 'xl';
}