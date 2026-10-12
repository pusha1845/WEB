function validateProfile(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Некорректная анкета' };
  const nickname = typeof input.nickname === 'string' ? input.nickname.trim() : '';
  const breed = typeof input.breed === 'string' ? input.breed.trim() : '';
  const age = typeof input.age === 'string' && input.age.trim() !== '' ? Number(input.age) : input.age;
  if (!nickname || nickname.length > 80) return { error: 'Введите кличку длиной от 1 до 80 символов' };
  if (!breed || breed.length > 100) return { error: 'Введите породу длиной от 1 до 100 символов' };
  if (typeof age !== 'number' || !Number.isFinite(age) || age < 0 || age > 100) return { error: 'Возраст должен быть числом от 0 до 100 лет' };
  const value = { nickname, breed, age };
  if (input.photo !== undefined && input.photo !== '') {
    if (typeof input.photo !== 'string' || input.photo.length > 2048) return { error: 'Некорректное фото' };
    const local = /^\/api\/uploads\/[0-9a-f-]{36}\.(png|jpg|webp)$/.test(input.photo);
    let cloud = false;
    try {
      const url = new URL(input.photo);
      cloud = url.protocol === 'https:' && /^[a-z0-9]+\.public\.blob\.vercel-storage\.com$/.test(url.hostname) && /^\/uploads\/[0-9a-f-]{36}\.(png|jpg|webp)$/.test(url.pathname) && !url.username && !url.password && !url.search && !url.hash;
    } catch {}
    if (!local && !cloud) return { error: 'Используйте фото, загруженное через форму' };
    value.photo = input.photo;
  }
  return { value };
}
module.exports = { validateProfile };
