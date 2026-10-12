import { validateProfile } from '../../lib/validation';
import { listProfiles, addProfile } from '../../lib/profile-store';

export default async function handler(req, res) {
  res.setHeader('Cache-Control', 'no-store');
  try {
    if (req.method === 'GET') return res.status(200).json(await listProfiles());
    if (req.method === 'POST') {
      const result = validateProfile(req.body);
      if (result.error) return res.status(400).json({ error: result.error });
      return res.status(201).json(await addProfile(result.value));
    }
    res.setHeader('Allow', 'GET, POST');
    return res.status(405).json({ error: 'Допустимы только GET и POST' });
  } catch (error) {
    console.error('Ошибка хранения анкеты:', error);
    return res.status(503).json({ error: 'Не удалось сохранить или прочитать анкету. Проверьте настройки хранилища.' });
  }
}
