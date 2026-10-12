import formidable from 'formidable';
import { put } from '@vercel/blob';
import fs from 'node:fs/promises';
import path from 'node:path';
import { randomUUID } from 'node:crypto';

export const config = { api: { bodyParser: false } };

export default async function handler(req, res) {
  if (req.method !== 'POST') { res.setHeader('Allow', 'POST'); return res.status(405).json({ error: 'Use POST' }); }
  let uploaded;
  try {
    const form = formidable({ maxFiles: 1, maxFileSize: 5 * 1024 * 1024, allowEmptyFiles: false });
    const [, files] = await form.parse(req);
    uploaded = files.file?.[0];
    const types = { 'image/png': '.png', 'image/jpeg': '.jpg', 'image/webp': '.webp' };
    if (!uploaded || !types[uploaded.mimetype]) return res.status(400).json({ error: 'Выберите PNG, JPEG или WebP до 5 МБ' });
    const filename = randomUUID() + types[uploaded.mimetype];
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`uploads/${filename}`, await fs.readFile(uploaded.filepath), { access: 'public', contentType: uploaded.mimetype, addRandomSuffix: false });
      return res.status(201).json({ url: blob.url });
    }
    if (process.env.VERCEL) return res.status(503).json({ error: 'Подключите Vercel Blob' });
    const directory = path.join(process.cwd(), 'public', 'uploads');
    await fs.mkdir(directory, { recursive: true });
    await fs.copyFile(uploaded.filepath, path.join(directory, filename));
    return res.status(201).json({ url: `/api/uploads/${filename}` });
  } catch (error) {
    return res.status(error.httpCode === 413 ? 413 : 400).json({ error: 'Не удалось загрузить файл. Проверьте формат и размер.' });
  } finally { if (uploaded) await fs.unlink(uploaded.filepath).catch(() => {}); }
}
