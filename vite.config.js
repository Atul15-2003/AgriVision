import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                homepage: resolve(__dirname, 'homepage.html'),
                analysis: resolve(__dirname, 'analysis.html'),
                resources: resolve(__dirname, 'resources.html'),
                about: resolve(__dirname, 'about.html'),
                contact: resolve(__dirname, 'contact.html'),
                login: resolve(__dirname, 'login.html'),
                signup: resolve(__dirname, 'signup.html'),
            },
        },
    },
});
