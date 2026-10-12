import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';

export default function AnimalProfile() {
  const [nickname, setNickname] = useState('');
  const [breed, setBreed] = useState('');
  const [age, setAge] = useState('');
  const [profiles, setProfiles] = useState([]);
  const [status, setStatus] = useState('');
  const [busy, setBusy] = useState(false);
  useEffect(() => {
    fetch('/api/profiles').then(async response => {
      const result = await response.json(); if (!response.ok) throw new Error(result.error); return result;
    }).then(setProfiles).catch(error => setStatus(error.message));
  }, []);
  async function submit(event) {
    event.preventDefault(); setBusy(true); setStatus('');
    try {
      const response = await fetch('/api/profiles', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ nickname, breed, age: Number(age) })
      });
      const result = await response.json(); if (!response.ok) throw new Error(result.error);
      setProfiles(current => [...current, result]);
      setStatus(`Анкета «${result.nickname}» сохранена на сервере.`);
      setNickname(''); setBreed(''); setAge('');
    } catch (error) { setStatus(error.message || 'Не удалось отправить анкету'); }
    finally { setBusy(false); }
  }
  return <main>
    <Head><title>Анкета животного — вариант 5</title></Head>
    <p className="eyebrow">Next.js · Лабораторная работа 3 · Вариант 5</p>
    <h1>Анкета животного</h1>
    <form onSubmit={submit}><fieldset><legend>Данные животного</legend>
      <label htmlFor="nickname">Кличка</label><input id="nickname" value={nickname} maxLength={80} required onChange={e => setNickname(e.target.value)} />
      <label htmlFor="breed">Порода</label><input id="breed" value={breed} maxLength={100} required onChange={e => setBreed(e.target.value)} />
      <label htmlFor="age">Возраст в годах</label><input id="age" type="number" min="0" max="100" step="0.1" value={age} required onChange={e => setAge(e.target.value)} />
      <button type="submit" disabled={busy}>{busy ? 'Сохранение…' : 'Сохранить анкету'}</button>
    </fieldset></form>
    <p role="status">{status}</p><h2>Сохранённые анкеты</h2>
    {profiles.length === 0 ? <p>Анкет пока нет.</p> : <ul className="profiles">{profiles.map(p => <li key={p.id}>{p.nickname} · {p.breed} · {p.age} лет</li>)}</ul>}
    <Link href="/">На главную</Link>
  </main>;
}
