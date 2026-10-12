import React, { useEffect, useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import AwesomeSlider from 'react-awesome-slider';

function sendEmail(email) {
  const user = localStorage.getItem('user') || '';
  const body = `Здравствуйте, я нашел вашего питомца.
-----------
С уважением, ${user}`;
  window.location.href = `mailto:${email}?subject=${encodeURIComponent('Потерянный зверь')}&body=${encodeURIComponent(body)}`;
}

export function Animal({ data }) {
  if (!data) return <p>Загрузка…</p>;
  return <div className="pet-slide">
    <img src={data.img || '/pet-placeholder.svg'} alt={data.header} />
    <div className="caption"><h2>{data.header}</h2><p>{data.content}</p>
      {data.email && <a href={`mailto:${data.email}`} onClick={event => { event.preventDefault(); event.stopPropagation(); sendEmail(data.email); }}>Написать владельцу</a>}
    </div>
  </div>;
}

export default function Home() {
  const [animals, setAnimals] = useState([]);
  const [user, setUser] = useState('');
  const [error, setError] = useState('');
  useEffect(() => {
    const read = url => fetch(url, { cache: 'no-store' }).then(r => {
      if (!r.ok) throw new Error(); return r.json();
    });
    Promise.allSettled([read('/animals.json'), read('/api/profiles')]).then(([announcements, profiles]) => {
      const saved = profiles.status === 'fulfilled' ? profiles.value.map(profile => ({
        id: profile.id, header: profile.nickname,
        content: `${profile.breed} · ${profile.age} лет`, img: profile.photo || '/pet-placeholder.svg'
      })) : [];
      setAnimals([...(announcements.status === 'fulfilled' ? announcements.value : []), ...saved]);
      if (announcements.status === 'rejected' || profiles.status === 'rejected') setError('Не удалось загрузить часть карточек. Обновите страницу.');
    });
  }, []);
  useEffect(() => {
    let name = localStorage.getItem('user');
    if (!name?.trim()) {
      try { name = window.prompt('Введите ваше имя пользователя'); }
      catch { name = ''; }
    }
    if (name?.trim()) {
      localStorage.setItem('user', name.trim());
      setUser(name.trim());
    }
  }, []);
  function logout() {
    localStorage.removeItem('user');
    window.location.reload();
  }
  return <main>
    <Head><title>Petto — поиск потерянных животных</title></Head>
    <h1>Petto</h1>
    {!user && <form onSubmit={event => {
      event.preventDefault();
      const name = new FormData(event.currentTarget).get('username').trim();
      if (name) { localStorage.setItem('user', name); setUser(name); }
    }}><label htmlFor="username">Имя пользователя</label><input id="username" name="username" required maxLength={80} /><button>Сохранить имя</button></form>}
    <nav><Link href="/animal-profile">Анкета животного</Link><Link href="/content">Видео с YouTube</Link><button onClick={logout}>Выйти</button></nav>
    <h2>Поиск потерянных животных</h2>
    {error && <p className="error" role="alert">{error}</p>}
    {animals.length > 0 && <div className="slider"><AwesomeSlider style={{ '--slider-height-percentage': '52%' }}>
      {animals.map((animal, index) => <div key={animal.id || `${index}-${animal.header}`} onClick={() => { if (animal.email) sendEmail(animal.email); }}><Animal data={animal} /></div>)}
    </AwesomeSlider></div>}
  </main>;
}
