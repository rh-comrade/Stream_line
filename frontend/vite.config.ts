import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0', // Allow access on local network
    port: 5173,       // Optional: Set a specific port
    allowedHosts: ['rnsna-157-66-104-23.a.free.pinggy.link'],

  }
})
