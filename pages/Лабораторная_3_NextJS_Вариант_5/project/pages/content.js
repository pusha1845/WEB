import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import YouTube from 'react-youtube';

export default function Content() {
  const [error, setError] = useState('');
  return <main>
    <Head><title>Вариант 5 — видео с YouTube</title></Head>
    <h1>Видео с YouTube</h1>
    <div className="video">
      <YouTube videoId="M7lc1UVf-VE" className="video" title="YouTube IFrame Player API Demo"
        opts={{ width: '100%', height: '100%', playerVars: { autoplay: 0, rel: 0 } }}
        onError={() => setError('Не удалось загрузить видео. Попробуйте позже.')} />
    </div>
    {error && <p role="alert">{error}</p>}
    <Link href="/">На главную</Link>
  </main>;
}
