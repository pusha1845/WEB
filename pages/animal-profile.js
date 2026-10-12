import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function AnimalProfile() {
  const [nickname, setNickname] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [photo, setPhoto] = useState(null);
  const [preview, setPreview] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    if (!photo) { setPreview(''); return; }
    const url = URL.createObjectURL(photo);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [photo]);
  useEffect(() => {
    fetch('/api/profiles').then(async response => {
      const result = await response.json(); if (!response.ok) throw new Error(result.error); return result;
    }).then(setProfiles).catch(error => setStatus(error.message));
  }, []);
  async function submit(event) {
    event.preventDefault(); const form = event.currentTarget; setBusy(true); setStatus('');
    try {
      let photoUrl;
      if (photo) {
        const body = new FormData(); body.append('file', photo);
        const upload = await fetch('/api/handleUpload', { method: 'POST', body });
        const uploaded = await upload.json();
        if (!upload.ok) throw new Error(uploaded.error || 'Не удалось загрузить фото');
        photoUrl = uploaded.url;
      }
      const response = await fetch('/api/profiles', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, breed, age: Number(age), photo: photoUrl })
      });
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      setProfiles(current => [...current, result]);
      setStatus(`Анкета «${result.nickname}» сохранена и добавлена в общий слайдер.`);
      setNickname(''); setBreed(''); setAge(''); setPhoto(null); form.reset();
    } catch (error) { setStatus(error.message || 'Не удалось отправить анкету'); }
    finally { setBusy(false); }
  }
  return <main>
    <Head><title>Анкета животного — вариант 5</title></Head>
    <h1>Анкета животного</h1>
    <form onSubmit={submit}><fieldset><legend>Данные животного</legend>
      <label htmlFor="nickname">Кличка</label><input id="nickname" value={nickname} maxLength={80} required onChange={e => setNickname(e.target.value)} />
      <label htmlFor="breed">Порода</label><input id="breed" value={breed} maxLength={100} required onChange={e => setBreed(e.target.value)} />
      <label htmlFor="age">Возраст в годах</label><input id="age" type="number" min="0" max="100" step="0.1" value={age} required onChange={e => setAge(e.target.value)} />
      <label htmlFor="photo">Фото (необязательно, до 4 МБ)</label>
      <input id="photo" name="photo" type="file" accept="image/png,image/jpeg,image/webp" disabled={busy} onChange={event => {
        const file = event.target.files?.[0]; setStatus('');
        if (file && (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type) || file.size > 4 * 1024 * 1024)) {
          setStatus('Выберите PNG, JPEG или WebP до 4 МБ.'); event.target.value = ''; setPhoto(null); return;
        }
        setPhoto(file || null);
      }} />
      {preview && <img src={preview} alt="Предпросмотр фото" style={{ maxWidth: '100%', width: 240, maxHeight: 180, objectFit: 'contain' }} />}
      <button type="submit" disabled={busy}>{busy ? 'Сохранение…' : 'Сохранить анкету'}</button>
    </fieldset></form>
    <p role="status">{status}</p><h2>Сохранённые анкеты</h2>
    {profiles.length === 0 ? <p>Анкет пока нет.</p> : <ul className="profiles">{profiles.map(p => <li key={p.id}>{p.nickname} · {p.breed} · {p.age} лет</li>)}</ul>}
    <Link href="/">На главную</Link>
  </main>;
}
