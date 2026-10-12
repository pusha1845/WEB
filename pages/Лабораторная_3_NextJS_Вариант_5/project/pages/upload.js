import React, { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Upload() {
  const [animals, setAnimals] = useState([]);
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    fetch('/api/getAnimals').then(r => { if (!r.ok) throw new Error(); return r.json(); })
      .then(setAnimals).catch(() => setStatus('Не удалось загрузить список животных'));
  }, []);
  async function upload(event) {
    event.preventDefault();
    if (!file) { setStatus('Сначала выберите изображение'); return; }
    setBusy(true);
    try {
      const body = new FormData(); body.append('file', file);
      const response = await fetch('/api/handleUpload', { method: 'POST', body });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error);
      setStatus(`Файл сохранён: ${result.url}`);
    } catch (error) { setStatus(error.message || 'Ошибка загрузки'); }
    finally { setBusy(false); }
  }
  return <main>
    <h1>Загрузка изображения на сервер</h1>
    <form onSubmit={upload}>
      <label htmlFor="animal-type">Тип животного</label>
      <select id="animal-type">{animals.map(name => <option key={name}>{name}</option>)}</select>
      <label htmlFor="file">Изображение до 5 МБ</label>
      <input id="file" type="file" accept="image/png,image/jpeg,image/webp" onChange={event => setFile(event.target.files[0] || null)} />
      <button disabled={busy} type="submit">{busy ? 'Загрузка…' : 'Отправить'}</button>
    </form>
    <p role="status">{status}</p><Link href="/">На главную</Link>
  </main>;
}
