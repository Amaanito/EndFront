import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '130.225.170.52', // Angiv den ønskede IP-adresse
    port: 10180, // Angiv den ønskede port
  },
})
