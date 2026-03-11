export const Colors = {
  background: '#121212',
  surface: '#1E1E2E',
  surfaceVariant: '#2A2A3E',
  primary: '#6C63FF',
  primaryDark: '#3D35CC',
  accent: '#FF6584',
  onSurface: '#E0E0E0',
  onSurfaceDim: '#9E9E9E',
  divider: '#2E2E42',
  white: '#FFFFFF',
  black: '#000000',
};

export const Gradients: [string, string][] = [
  ['#6C63FF', '#3D35CC'],
  ['#FF6584', '#CC3355'],
  ['#43E97B', '#38F9D7'],
  ['#F7971E', '#FFD200'],
  ['#4FACFE', '#00F2FE'],
  ['#A18CD1', '#FBC2EB'],
  ['#FF9A9E', '#FECFEF'],
  ['#667EEA', '#764BA2'],
];

export function gradientForSeed(seed: string): [string, string] {
  const index =
    seed.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % Gradients.length;
  return Gradients[index];
}
