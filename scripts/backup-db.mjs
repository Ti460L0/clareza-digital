import { DatabaseSync, backup } from 'node:sqlite';
import { openSync, closeSync, mkdirSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { pathToFileURL } from 'node:url';

export async function backupDatabase(sourcePath, destinationPath) {
  const source = resolve(sourcePath), destination = resolve(destinationPath);
  if (source === destination) throw Error('Origem e destino precisam ser diferentes.');
  const db = new DatabaseSync(source, { readOnly: true, timeout: 5000 });
  try {
    mkdirSync(dirname(destination), { recursive: true });
    // Exclusive creation prevents replacement of any previous backup.
    closeSync(openSync(destination, 'wx', 0o600));
    await backup(db, destination);
    const copied = new DatabaseSync(destination, { readOnly: true });
    try {
      const rows = copied.prepare('PRAGMA integrity_check').all();
      if (rows.length !== 1 || rows[0].integrity_check !== 'ok') throw Error('Backup não passou pela verificação de integridade.');
      const count = copied.prepare('SELECT COUNT(*) AS n FROM reservations').get();
      return { reservations: Number(count.n) };
    } finally { copied.close(); }
  } finally { db.close(); }
}

if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const source = process.env.DATABASE_PATH || 'data/usage.sqlite';
  const destination = process.argv[2];
  if (!destination) { console.error('Informe um arquivo novo para o backup.'); process.exitCode = 1; }
  else {
    try { await backupDatabase(source, destination); console.info('Backup criado e integridade verificada.'); }
    catch { console.error('Backup não concluído. Não use o arquivo de destino antes de verificar a causa.'); process.exitCode = 1; }
  }
}
