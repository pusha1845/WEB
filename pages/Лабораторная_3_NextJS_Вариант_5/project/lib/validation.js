function validateProfile(input) {
  if (!input || typeof input !== 'object' || Array.isArray(input)) return { error: 'Некорректная анкета' };
  const nickname = typeof input.nickname === 'string' ? input.nickname.trim() : '';
  const breed = typeof input.breed === 'string' ? input.breed.trim() : '';
  const age = typeof input.age === 'string' && input.age.trim() !== '' ? Number(input.age) : input.age;
  if (!nickname || nickname.length > 80) return { error: 'Введите кличку длиной от 1 до 80 символов' };
  if (!breed || breed.length > 100) return { error: 'Введите породу длиной от 1 до 100 символов' };
  if (typeof age !== 'number' || !Number.isFinite(age) || age < 0 || age > 100) return { error: 'Возраст должен быть числом от 0 до 100 лет' };
  return { value: { nickname, breed, age } };
}
module.exports = { validateProfile };
