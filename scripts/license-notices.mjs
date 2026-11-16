import { readFileSync, readdirSync, writeFileSync, mkdirSync } from 'node:fs';
import { resolve } from 'node:path';

const lock = JSON.parse(readFileSync('package-lock.json', 'utf8'));
const inventory = [];
const notices = ['Clareza Digital — avisos de dependências de produção\nCada dependência mantém sua própria licença. A lista cobre a árvore de produção; nem todo pacote aparece em todos os bundles.\n'];
for (const [path, meta] of Object.entries(lock.packages)) {
  if (!path || meta.dev) continue;
  const pkg = JSON.parse(readFileSync(resolve(path, 'package.json'), 'utf8'));
  const files = readdirSync(path).filter(name => /^license(?:\.(?:md|txt))?$/i.test(name));
  if (pkg.license !== 'MIT' || !files.length) throw Error(`Revisão manual necessária para ${pkg.name}. Não gerar avisos incompletos.`);
  inventory.push({ name: pkg.name, version: pkg.version, license: pkg.license });
  notices.push(`\n--- ${pkg.name}@${pkg.version} ---\n` + files.map(file => readFileSync(resolve(path, file), 'utf8')).join('\n'));
}
mkdirSync('docs/licenses', { recursive: true });
writeFileSync('docs/licenses/runtime-inventory.json', JSON.stringify(inventory, null, 2) + '\n');
writeFileSync('apps/web/public/third-party-notices.txt', notices.join('\n'));
console.info(`Avisos preservados para ${inventory.length} dependências de produção.`);
