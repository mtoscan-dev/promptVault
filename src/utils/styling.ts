export const TAG_COLORS: Record<string, string> = {
  // Desarrollo
  coding: '#00ff41',      // Verde Matrix
  frontend: '#00d9ff',    // Cian eléctrico
  backend: '#ff8000',     // Naranja fuego
  database: '#bd00ff',    // Morado profundo
  api: '#6366f1',         // Indigo
  
  // Creatividad
  creative: '#ff0055',    // Neón Pink
  storytelling: '#ffcc00',// Amarillo Cyber
  writing: '#d946ef',     // Fucsia
  
  // Otros
  debugging: '#ff3131',   // Rojo alerta
  analysis: '#22d3ee',    // Cyan
  translation: '#facc15', // Yellow
  summary: '#fb923c',     // Orange
  education: '#4ade80',   // Green
  
  // Default
  general: '#888888',     // Gris
  default: '#888888'      // Gris para desconocidos (fallback)
};

export const getTagStyle = (tag: string) => {
  const color = TAG_COLORS[tag.toLowerCase()] || TAG_COLORS.default;
  
  return {
    color: color,
    borderColor: color,
    backgroundColor: `${color}15`, // Agrega un 15% de opacidad al fondo
    boxShadow: `0 0 5px ${color}33`, // Un pequeño resplandor (glow)
  };
};
