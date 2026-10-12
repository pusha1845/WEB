import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';
import { put, list } from '@vercel/blob';

const filename = path.join(process.cwd(), 'data', 'profiles.json');
let pending = Promise.resolve();
function cloud() {
  if (process.env.VERCEL && !process.env.BLOB_READ_WRITE_TOKEN) throw new Error('Подключите Vercel Blob');
  return Boolean(process.env.BLOB_READ_WRITE_TOKEN);
}
export async function listProfiles() {
  if (cloud()) {
    const profiles = []; let cursor;
    do {
      const result = await list({ prefix: 'profiles/', cursor, limit: 1000 });
      const records = await Promise.all(result.blobs.map(async blob => {
        const response = await fetch(blob.url, { cache: 'no-store' });
        if (!response.ok) throw new Error('Ошибка чтения Blob');
        return response.json();
      }));
      profiles.push(...records); cursor = result.hasMore ? result.cursor : undefined;
    } while (cursor);
    return profiles.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }
  try { return JSON.parse(await fs.readFile(filename, 'utf8')); }
  catch (error) { if (error.code === 'ENOENT') return []; throw error; }
}
export function addProfile(value) {
  const operation = pending.then(async () => {
    const profile = { id: randomUUID(), ...value, createdAt: new Date().toISOString() };
    if (cloud()) {
      await put(`profiles/${profile.id}.json`, JSON.stringify(profile), { access: 'public', addRandomSuffix: false, contentType: 'application/json' });
    } else {
      const profiles = await listProfiles(); profiles.push(profile);
      await fs.mkdir(path.dirname(filename), { recursive: true });
      const temporary = filename + '.' + randomUUID() + '.tmp';
      await fs.writeFile(temporary, JSON.stringify(profiles, null, 2), 'utf8');
      await fs.rename(temporary, filename);
    }
    return profile;
  });
  pending = operation.catch(() => {}); return operation;
}
