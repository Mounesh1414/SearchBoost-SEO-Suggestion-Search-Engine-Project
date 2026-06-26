export default async () => {
  const plugins = [];

  try {
    const tailwind = (await import('tailwindcss')).default;
    plugins.push(tailwind());
  } catch (err) {
    // Tailwind not installed — continue with autoprefixer only
    // eslint-disable-next-line no-console
    console.warn('[postcss] tailwindcss not found — skipping Tailwind plugin');
  }

  try {
    const autoprefixer = (await import('autoprefixer')).default;
    plugins.push(autoprefixer());
  } catch (err) {
    // If autoprefixer is missing, PostCSS will likely fail later — surface clear message
    // eslint-disable-next-line no-console
    console.warn('[postcss] autoprefixer not found');
  }

  return { plugins };
};
