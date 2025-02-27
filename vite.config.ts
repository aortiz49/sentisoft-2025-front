import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');

    const host = env.VITE_HOST || 'localhost';
    const port = Number(env.VITE_PORT) || 5173;

    return {
        plugins: [react()],
        resolve: {
            alias: {
                '#': path.resolve(__dirname), // Resolves # to the root of the project
            },
        },
        server: {
            host,
            port,
        },
    };
});
