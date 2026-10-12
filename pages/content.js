import React, { useState } from 'react';
import Head from 'next/head';
import Link from 'next/link';
import YouTube from 'react-youtube';

export default function Content() {
  const [status, setStatus] = useState('Ожидание загрузки плеера');
  return <main>
    <Head><title>Вариант 5 — видео с YouTube</title></Head>
    <p className="eyebrow">Next.js · Вариант 5</p>
    <h1>Видео с YouTube</h1>
    <p>Видео отображается компонентом библиотеки react-youtube.</p>
    <div className="video">
      <YouTube videoId="M7lc1UVf-VE" className="video" title="YouTube IFrame Player API Demo"
        opts={{ width: '100%', height: '100%', playerVars: { autoplay: 0, rel: 0 } }}
        onReady={() => setStatus('Плеер готов к просмотру')}
        onPlay={() => setStatus('Видео воспроизводится')}
        onPause={() => setStatus('Воспроизведение приостановлено')}
        onError={() => setStatus('YouTube не смог загрузить видео. Проверьте доступ к YouTube и попробуйте позже.')} />
    </div>
    <p role="status">{status}</p>
    <p className="notice">Для просмотра нужен доступ к YouTube. Автоматическое воспроизведение отключено.</p>
    <Link href="/">На главную</Link>
  </main>;
}
