import { defineConfig, loadEnv } from "vite";
export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');
  const proxyEnabled = env.API_DEV_PROXY === 'true';
  if (proxyEnabled && !env.API_SHARED_SECRET) throw Error('Configure API_SHARED_SECRET para o proxy local.');
  return {
  root: "apps/web",
  build: { outDir: "../../dist", emptyOutDir: true },
  server: { port: 5173, strictPort: true,
    proxy: proxyEnabled ? { '/api': {
      target: 'http://127.0.0.1:8788',
      headers: { Authorization: `Bearer ${env.API_SHARED_SECRET}`, Origin: 'http://127.0.0.1:5173', 'X-Clareza-Client-IP': '127.0.0.1' },
    } } : undefined,
  },
  plugins: proxyEnabled ? [] : [{ name: 'local-api-disabled', configureServer(server) {
    server.middlewares.use('/api', (_request, response) => {
      response.writeHead(503, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store' });
      response.end('{"error":"unavailable"}');
    });
  } }],
}; });
