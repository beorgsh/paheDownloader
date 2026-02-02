
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // Sets the base path to relative, fixing 404 errors for assets on GitHub Pages
  base: './',
});
