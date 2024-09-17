export const generatePastelColor = () => {
  // Generate random values for red, green, and blue
  const r = Math.floor(Math.random() * 55 + 200);
  const g = Math.floor(Math.random() * 55 + 200);
  const b = Math.floor(Math.random() * 55 + 200);

  // Convert to hexadecimal and ensure two digits
  const rHex = r.toString(16).padStart(2, '0');
  const gHex = g.toString(16).padStart(2, '0');
  const bHex = b.toString(16).padStart(2, '0');

  // Return the color as a hexadecimal string
  return `#${rHex}${gHex}${bHex}`;
};

const generatedColors = new Set();

export const generateUniquePastelColor = () => {
  let color;
  do {
    color = generatePastelColor();
  } while (generatedColors.has(color));

  generatedColors.add(color);
  return color;
};
