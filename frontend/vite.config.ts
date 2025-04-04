import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: { 
    cors: {
      // the origin you will be accessing via browser
      origin: 'http://localhost:3000',
    },
    
  },
  build: { 
     manifest: true,
     rollupOptions: {
       input: './src/main.tsx',
     },    
     modulePreload: { 
       polyfill: false,
     }
  },
  
});