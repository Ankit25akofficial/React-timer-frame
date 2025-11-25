import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// IMPORTANT: Replace 'my-react-app' with YOUR actual repository name
export default defineConfig({
  plugins: [react()],
  base: '/my-react-app/',
})
