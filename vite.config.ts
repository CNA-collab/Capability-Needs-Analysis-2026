import path from 'node:path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    // This loads your variables from Render's environment
    const env = loadEnv(mode, '.', '');

    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
        // ADD THIS SECTION TO FIX THE RENDER ERROR:
        allowedHosts: [
          'capability-needs-analysis-2026.onrender.com'
        ]
      },
      plugins: [react()],
      define: {
        // This maps your Gemini Key so the code can see it
        'process.env.API_KEY': JSON.stringify(env.GEMINI_API_KEY),
        'process.env.GEMINI_API_KEY': JSON.stringify(env.GEMINI_API_KEY)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      },
      optimizeDeps: {
        include: ['pdf-parse']
      }
    };
});
