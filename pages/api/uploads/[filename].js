import fs from 'node:fs/promises';
import path from 'node:path';

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).end(); }
  const name = req.query.filename;
  if (typeof name !== 'string' || !/^[0-9a-f-]{36}\.(png|jpg|webp)$/.test(name)) return res.status(404).end();
  try {
    const bytes = await fs.readFile(path.join(process.cwd(), 'public', 'uploads', name));
    const types = { '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp' };
    res.setHeader('Content-Type', types[path.extname(name)]);
    res.setHeader('X-Content-Type-Options', 'nosniff');
    return res.status(200).send(bytes);
  } catch { return res.status(404).end(); }
}
