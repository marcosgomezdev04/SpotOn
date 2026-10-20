import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

// El navegador llama a /api/... y Vite reenvía al backend (sin CORS).
// Si tu backend usa otro puerto, creá un archivo .env con: API_TARGET=http://localhost:3001
export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), "");
    const target = env.API_TARGET || "http://localhost:3000";

    return {
        plugins: [react()],
        server: {
            port: 5173,
            proxy: {
                "/api": {
                    target,
                    changeOrigin: true,
                    rewrite: (path: string) => path.replace(/^\/api/, "")
                }
            }
        }
    };
});
