smejor cagada
Plataforma estudiantil en una sola página (`index.html`) para visualizar horario, tareas y recursos, con panel de administración y persistencia en Turso (SQLite/libSQL) desplegada en Vercel.

## Características principales

- Dashboard con métricas de tareas y vista de agenda semanal.
- Gestión de tareas y recursos desde panel admin.
- Alta de administradores desde el propio panel admin.
- Persistencia remota en Turso para tareas, recursos y admins.

4`

> Puedes agregar más administradores desde la sección **Agregar administrador** dentro del panel admin.

## Estructura del proyecto

- `index.html`: aplicación completa (UI + lógica JS).
- `favicon-euler.svg`: favicon con símbolo de Euler (`e`).
- `vercel.json`: configuración para despliegue estático en Vercel.
- `api/state.js`: endpoint para leer/escribir estado global (`tasks`, `resources`, `admins`).
- `api/admin-login.js`: endpoint de autenticación admin.
- `api/_lib/turso.js`: cliente libSQL y esquema.

## Ejecutar en local

Al ser un sitio estático, puedes abrir `index.html` directamente en el navegador o servir la carpeta con cualquier servidor estático.

## Configurar Turso + Vercel

1. Conecta este repositorio a tu proyecto en Vercel.
2. En local, vincula el proyecto:
   - `vercel link`
3. Baja variables de entorno:
   - `vercel env pull .env.development.local`
4. Instala dependencias:
   - `npm install`

Variables necesarias:

- `TURSO_DATABASE_URL`
- `TURSO_AUTH_TOKEN`

Snippet usado para cliente Turso:

```ts
import { createClient } from "@libsql/client";

const client = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});
```

## Despliegue en Vercel

1. Importa este repositorio en Vercel.
2. Usa preset **Other**.
3. Deja vacío `Output Directory`.
4. Deploy.

`vercel.json` ya enruta `/` a `index.html`.

## Notas

- Ahora los datos se guardan en Turso; el frontend usa `localStorage` solo como fallback local.
- Para archivos/libros de ~10MB: Turso puede guardar metadatos y enlaces, pero para binarios grandes en producción se recomienda almacenamiento de archivos (ej. Vercel Blob o S3) y en Turso solo guardar URL + metadata.
