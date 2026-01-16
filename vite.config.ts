import path from 'path';
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, '.', '');
    return {
      server: {
        port: 3000,
        host: '0.0.0.0',
      },
      plugins: [react()],
      define: {
        'process.env.OPENROUTER_API_KEY': JSON.stringify(env.OPENROUTER_API_KEY),
        'process.env.API_KEY': JSON.stringify(env.OPENROUTER_API_KEY), // Backwards compatibility
        'process.env.CPANEL_HOST': JSON.stringify(env.CPANEL_HOST),
        'process.env.CPANEL_USERNAME': JSON.stringify(env.CPANEL_USERNAME),
        'process.env.CPANEL_API_TOKEN': JSON.stringify(env.CPANEL_API_TOKEN),
        'process.env.CPANEL_TARGET_PATH': JSON.stringify(env.CPANEL_TARGET_PATH),
        'process.env.AUTO_UPLOAD_ENABLED': JSON.stringify(env.AUTO_UPLOAD_ENABLED)
      },
      resolve: {
        alias: {
          '@': path.resolve(__dirname, '.'),
        }
      }
    };
});
