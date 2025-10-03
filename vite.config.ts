import * as path from 'path';
import react from '@vitejs/plugin-react';
import * as dotenv from 'dotenv';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

dotenv.config({ path: './.env' });

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  define: {
    'process.env': process.env,
  },
  envPrefix: 'PUBLIC_',
  plugins: [svgr(), react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': '/tmp/cc-agent/shared',
    },
    preserveSymlinks: true,
  },
  server: {
    port: Number(process.env.PORT),
  },
});
