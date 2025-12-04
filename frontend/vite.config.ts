import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
// @ts-ignore
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'happy-dom', // We installed happy-dom
    setupFiles: './src/test/setup.js', // This file will run before tests
    css: true,
  },
})