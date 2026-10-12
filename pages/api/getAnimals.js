import fs from 'node:fs/promises';
import path from 'node:path';

export default async function handler(req, res) {
  if (req.method !== 'GET') { res.setHeader('Allow', 'GET'); return res.status(405).json({ error: 'Use GET' }); }
  try {
    const content = await fs.readFile(path.join(process.cwd(), 'public', 'animal-types.json'), 'utf8');
    return res.status(200).json(JSON.parse(content));
  } catch { return res.status(500).json({ error: 'Не удалось прочитать список животных' }); }
}
