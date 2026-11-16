import { defineConfig } from '@playwright/test';

// Read-only smoke checks of the authorized public deployment. No local server.
export default defineConfig({
  testDir: 'tests/deployment',
  testMatch: ['worker.spec.ts', 'narrated.spec.ts'],
  use: { baseURL: 'https://clarezadigital.cod4ti.com', viewport: { width: 320, height: 800 } },
  workers: 1,
});
