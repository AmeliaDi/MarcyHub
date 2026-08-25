s# MarcyHub

Plataforma estudiantil en una sola página (`index.html`) para visualizar horario, tareas y recursos, con panel de administración y persistencia local.

## Características principales

- Dashboard con métricas de tareas y vista de agenda semanal.
- Gestión de tareas y recursos desde panel admin.
- Alta de administradores desde el propio panel admin.
- Persistencia en `localStorage` para tareas, recursos y admins.

## Credenciales admin iniciales

- `draenora@unam.edu` / `admin1234`
- `profesor@enes.unam.mx` / `admin1234`

> Puedes agregar más administradores desde la sección **Agregar administrador** dentro del panel admin.

## Estructura del proyecto

- `index.html`: aplicación completa (UI + lógica JS).
- `favicon-euler.svg`: favicon con símbolo de Euler (`e`).
- `vercel.json`: configuración para despliegue estático en Vercel.

## Ejecutar en local

Al ser un sitio estático, puedes abrir `index.html` directamente en el navegador o servir la carpeta con cualquier servidor estático.

## Despliegue en Vercel

1. Importa este repositorio en Vercel.
2. Usa preset **Other** (sin build command).
3. Deja vacío `Output Directory`.
4. Deploy.

`vercel.json` ya enruta `/` a `index.html`.

## Notas

- Los datos se guardan en el navegador del usuario (`localStorage`), no en backend.
- Si limpias almacenamiento del navegador, se perderán los cambios locales.
