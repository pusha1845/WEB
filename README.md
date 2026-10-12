# WEB

Лабораторная работа по Next.js, вариант 5. Petto — учебная социальная сеть для владельцев животных.

## Запуск

Node.js 22 или 24. Из корня репозитория:

```sh
npm ci
npm run dev
```

Производственная сборка: `npm run build`, запуск: `npm start`.

## Требования методички

- `/` — объявления о потерянных животных, слайдер react-awesome-slider, имя пользователя в localStorage, mailto владельцу.
- `/content` — YouTube-плеер react-youtube (вариант 5).
- `/animal-profile` — анкета с кличкой, породой, возрастом; GET и POST `/api/profiles`.
- Локально анкеты сохраняются в `data/profiles.json`; на Vercel — отдельными JSON-файлами в Vercel Blob.
- `/upload` и API времени сервера и списка животных — примеры из теоретической части.

## Vercel

Импортировать репозиторий, Framework Next.js, Root Directory `./`, Node.js 24.x, Install Command `npm ci`, Build Command `npm run build`.
Создать Public Blob Store в Storage и подключить его к проекту. Vercel добавит `BLOB_READ_WRITE_TOKEN`; после подключения требуется новый деплой.
Проверить сохранение анкеты и её наличие после перезагрузки страницы.

Фото животных: Unsplash, источники в `public/IMAGE_SOURCES.txt`. Все объявления и контакты демонстрационные.
