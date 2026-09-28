# BUILD THE NEXT: notas de deploy

## Dónde está cada cosa

| Qué | Dónde |
|---|---|
| **App en internet** | https://marcelo-mauve.vercel.app |
| Código (GitHub) | https://github.com/mnoceda23-sudo/Marcelo (rama `main`) |
| Hosting (Vercel) | Proyecto `marcelo` en https://vercel.com (cuenta Hobby) |
| Base de datos y login (Supabase) | Proyecto `iizklbfzotdpjodxkfgx`: https://supabase.com/dashboard/project/iizklbfzotdpjodxkfgx |
| Código en tu Mac | `~/Downloads/build_the_next_platform/app` |

## Archivos del proyecto

| Archivo | Para qué sirve |
|---|---|
| `index.html` | Estructura de la página y pantalla de login |
| `src/main.js` | Toda la lógica: scores, finanzas, físico, proyectos, revisión semanal y conexión con Supabase |
| `src/style.css` | Diseño (colores, tipografía, modo claro y oscuro) |
| `supabase/migrations/20260928000000_init.sql` | Tablas de la base de datos y reglas de seguridad (RLS) |
| `.env` | Tus claves para correr la app en local. **No se sube a GitHub** |
| `.env.example` | Plantilla de `.env` sin valores |

## Claves y variables

La app usa solo dos variables, ambas públicas por diseño:

- `VITE_SUPABASE_URL`: la URL de tu proyecto de Supabase.
- `VITE_SUPABASE_ANON_KEY`: la clave *publishable* (`sb_publishable_…`).

Dónde viven:

- **En tu Mac:** en el archivo `.env`, que está excluido en `.gitignore`.
- **En Vercel:** en Settings → Environment Variables, tipo *Config*, para Production, Preview y Development.

**La service_role / secret key (`sb_secret_…`) nunca se usa en la app.** No la pongas en `.env`, en Vercel ni en el código.

## Seguridad de los datos

- Hay 5 tablas: `settings`, `daily_logs`, `transactions`, `weekly_reviews` y `trips`.
- Todas tienen **Row Level Security** activado y forzado. Cada usuario solo puede leer, crear, editar y borrar sus propias filas (`user_id = auth.uid()`).
- Alguien sin sesión no puede leer nada (el rol `anon` no tiene permisos).
- El login es por email con link mágico, sin contraseña.

## Cómo publicar cambios

Vercel publica solo cada vez que subes cambios a la rama `main` de GitHub:

```bash
cd ~/Downloads/build_the_next_platform/app
git add -A
git commit -m "Describe el cambio"
git push
```

En 30–60 segundos el cambio está en https://marcelo-mauve.vercel.app. Puedes ver el progreso en Vercel → Deployments.

Otra opción, sin pasar por GitHub: `npx vercel --prod`. La primera vez pide `npx vercel login` y `npx vercel link`.

## Probar cambios en tu Mac antes de publicarlos

```bash
cd ~/Downloads/build_the_next_platform/app
npm install
npm run dev
```

La app se abre en http://localhost:5173. Usa la misma base de datos que la versión en internet, así que lo que registres ahí también es real.

## Configuración de login en Supabase

En Authentication → URL Configuration:

- **Site URL:** `https://marcelo-mauve.vercel.app`
- **Redirect URLs:** `https://marcelo-mauve.vercel.app/**` y `http://localhost:5173/**`

Si algún día cambias de dominio en Vercel, agrega el nuevo dominio aquí. Si no, el link del correo no funciona.

## Cambios en la base de datos

Si hace falta una tabla o columna nueva, crea otro archivo en `supabase/migrations/` con fecha en el nombre (por ejemplo `20261015000000_agregar_x.sql`). Luego pégalo en el SQL Editor de Supabase y ejecútalo con **Run**. No edites una migración que ya se ejecutó.

## Problemas comunes

| Problema | Qué hacer |
|---|---|
| No llega el correo de login | Revisa spam. El plan gratis envía pocos correos por hora: espera unos minutos antes de pedir otro. |
| El link del correo lleva a `localhost` o da error | Revisa la Site URL y las Redirect URLs en Supabase (sección anterior). |
| La app dice "Falta configurar VITE_SUPABASE_URL…" | Faltan las variables en Vercel. Agrégalas y haz Redeploy en Deployments → ⋯ → Redeploy. |
| La app dice "No se pudieron cargar tus datos" | Revisa tu conexión. Si sigue, mira en Supabase si el proyecto está pausado: los proyectos gratis se pausan tras 7 días sin uso y se reactivan desde el panel. |
| Un deploy falla en Vercel | Abre el deploy en Vercel → Deployments y lee el log. Corre `npm run build` en tu Mac para ver el mismo error. |

## Pendientes recomendados

- **Cerrar el registro de usuarios nuevos:** en Supabase, Authentication → Sign In / Providers, desactiva **Allow new users to sign up**. Tu usuario ya existe y seguirá entrando. Así nadie más puede crear cuenta en tu app.
- **Hacer privado el repo** (opcional): GitHub → Settings → Change visibility → Private.
- **Respaldo:** Ajustes → *Exportar datos (JSON)* descarga todos tus registros.
