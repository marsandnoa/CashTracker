import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
 server: {
    host: '0.0.0.0', // Listen on all available network interfaces
    port: 5174,      // Specify the port number you want to use
 },
  plugins: [react()],
})
