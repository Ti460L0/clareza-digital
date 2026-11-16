import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir: 'tests/deployment',
  use: { baseURL: 'http://127.0.0.1:8789', viewport: { width: 320, height: 800 } },
  webServer: { command: 'npx wrangler dev --local --ip 127.0.0.1 --port 8789', url: 'http://127.0.0.1:8789', reuseExistingServer: false },
});
