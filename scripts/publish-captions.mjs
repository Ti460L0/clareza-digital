import { readFileSync, writeFileSync, copyFileSync } from 'node:fs';
const transcripts = {};
for (const code of ['S1', 'S2', 'S3', 'S4', 'S5', 'I4', 'I4-extra']) {
  const data = JSON.parse(readFileSync(`output/notebooklm/${code}-narracao.json`, 'utf8'));
  transcripts[`Aula-${code}`] = data.segments.map(segment => segment.text);
  copyFileSync(`output/notebooklm/${code}-rascunho.vtt`, `apps/web/public/media/Aula-${code}.pt-BR.vtt`);
}
writeFileSync('packages/content/narrated-transcripts.json', JSON.stringify(transcripts, null, 2));
