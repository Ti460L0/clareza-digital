import { defineConfig } from 'vite';
export default defineConfig({
  ssr: { noExternal: ['zod'] },
  build: {
    ssr: 'apps/api/src/server.ts',
    target: 'node24',
    outDir: 'apps/api/dist',
    emptyOutDir: true,
    minify: false,
  },
});
