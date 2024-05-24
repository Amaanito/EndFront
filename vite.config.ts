import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
    port: 10181, 
    /*hmr: {
      host: '130.225.170.52',
      port: 10181,
      clientPort: 10181 // Tilføj clientPort
    },*/  
  },

})
